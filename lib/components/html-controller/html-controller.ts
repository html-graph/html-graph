import { GraphEventType } from "../../models/events/graph-event-type";
import { DiContainer } from "../di-container/di-container";
import { NodePayload } from "../../models/html/node-payload";

export class HtmlController {
    private readonly host: HTMLElement;

    private readonly nodesContainer: HTMLElement;

    private readonly connectionsContainer: HTMLElement;

    private readonly canvas: HTMLCanvasElement;

    private readonly canvasCtx: CanvasRenderingContext2D;

    private readonly hostResizeObserver: ResizeObserver;

    private readonly nodesResizeObserver: ResizeObserver;

    private readonly nodeIdsMap = new Map<HTMLElement, string>();

    private readonly connectionsMap = new Map<string, SVGSVGElement>();

    private grabbedNodeId: string | null = null;

    private readonly onPointerDown = (event: MouseEvent) => {
        if (event.button !== 0) {
            return;
        }

        this.di.eventSubject.dispatch(GraphEventType.GrabViewport);

        event.stopPropagation();
    }

    private readonly onPointerMove = (event: MouseEvent) => {
        if (event.buttons !== 1) {
            return;
        }

        if (this.grabbedNodeId !== null) {
            this.di.eventSubject.dispatch(
                GraphEventType.DragNode,
                {
                    nodeId: this.grabbedNodeId,
                    dx: event.movementX,
                    dy: event.movementY,
                },
            );
        } else {
            this.di.eventSubject.dispatch(
                GraphEventType.DragViewport,
                { dx: event.movementX, dy: event.movementY },
            );
        }

        event.stopPropagation();
    }

    private readonly onPointerUp = (event: MouseEvent) => {
        if (event.button !== 0) {
            return;
        }

        this.grabbedNodeId = null;
        this.di.eventSubject.dispatch(GraphEventType.Release);

        event.stopPropagation();
    }

    private readonly onWheelScroll = (event: WheelEvent) => {
        const trigger = this.di.options.scale.trigger;

        if ((trigger === "ctrl+wheel" || trigger === 'ctrl+shift+wheel') && !event.ctrlKey) {
            return;
        }

        if ((trigger === 'shift+wheel' || trigger === 'ctrl+shift+wheel') && !event.shiftKey) {
            return;
        }

        const { left, top } = this.host.getBoundingClientRect();
        const centerX = event.clientX - left;
        const centerY = event.clientY - top;

        this.di.eventSubject.dispatch(
            GraphEventType.ScaleViewport,
            { deltaY: event.deltaY, centerX, centerY },
        );

        event.preventDefault();
    }

    private readonly onNodePointerDown = (event: PointerEvent) => {
        if (event.button !== 0) {
            return;
        }

        const nodeId = this.nodeIdsMap.get(event.currentTarget as HTMLElement)!;

        this.grabbedNodeId = nodeId;
        this.di.eventSubject.dispatch(GraphEventType.GrabNode, {
            nodeId,
        });

        event.stopPropagation();
    };

    constructor(
        private readonly canvasWrapper: HTMLElement,
        private readonly di: DiContainer,
    ) {
        this.host = this.createHost();
        this.host.addEventListener("pointerdown", this.onPointerDown);
        this.host.addEventListener("pointerup", this.onPointerUp);
        this.host.addEventListener("pointermove", this.onPointerMove);
        this.host.addEventListener("wheel", this.onWheelScroll);

        this.canvas = this.createCanvas();
        this.nodesContainer = this.createNodesContainer();
        this.connectionsContainer = this.createConnectionsContainer();

        const context = this.canvas.getContext("2d");

        if (context === null) {
            throw new Error("unable to get canvas context");
        }

        this.canvasCtx = context;

        this.host.appendChild(this.canvas);
        this.host.appendChild(this.connectionsContainer);
        this.host.appendChild(this.nodesContainer);
        this.canvasWrapper.appendChild(this.host);

        this.hostResizeObserver = this.createHostResizeObserver();
        this.hostResizeObserver.observe(this.host);

        this.nodesResizeObserver = this.createNodesResizeObserver();
    }

    clear(): void {
        Array.from(this.connectionsMap.keys()).forEach((connectionId) => {
            this.detachConnection(connectionId);
        });

        Array.from(this.nodeIdsMap.values()).forEach((nodeId) => {
            this.detachNode(nodeId);
        });
    }

    destroy(): void {
        this.host.removeEventListener("pointerdown", this.onPointerDown);
        this.host.removeEventListener("pointerup", this.onPointerUp);
        this.host.removeEventListener("pointermove", this.onPointerMove);
        this.host.removeEventListener("wheel", this.onWheelScroll);
        this.hostResizeObserver.disconnect();
        this.nodesResizeObserver.disconnect();
        this.host.removeChild(this.canvas);
        this.host.removeChild(this.connectionsContainer);
        this.host.removeChild(this.nodesContainer);
        this.canvasWrapper.removeChild(this.host);
    }

    setCursor(type: 'grab' | 'default'): void {
        this.host.style.cursor = type;
    }

    applyTransform(): void {
        this.canvasCtx.clearRect(0, 0, this.canvasCtx.canvas.width, this.canvasCtx.canvas.height);

        this.canvasCtx.save();

        this.di.options.background.drawingFn(
            this.canvasCtx,
            this.di.publicViewportTransformer,
        );

        this.canvasCtx.restore();

        const [xv, yv] = this.di.viewportTransformer.getViewportCoords(0, 0);
        const sv = this.di.viewportTransformer.getViewportScale();

        this.nodesContainer.style.transform = `matrix(${sv}, 0, 0, ${sv}, ${xv}, ${yv})`;
        this.connectionsContainer.style.transform = `matrix(${sv}, 0, 0, ${sv}, ${xv}, ${yv})`;
    }

    attachNode(nodeId: string): void {
        const node = this.di.graphStore.getNode(nodeId);

        node.element.style.position = "absolute";
        node.element.style.visibility = "hidden";

        this.nodesContainer.appendChild(node.element);
        this.nodeIdsMap.set(node.element, nodeId);
        this.updateNodeCoords(node);
        this.nodesResizeObserver.observe(node.element)

        node.element.style.visibility = "visible";
        node.element.addEventListener('pointerdown', this.onNodePointerDown);
    }

    detachNode(nodeId: string): void {
        const node = this.di.graphStore.getNode(nodeId);

        this.nodesResizeObserver.unobserve(node.element);
        this.nodesContainer.removeChild(node.element);

        node.element.removeEventListener('pointerdown', this.onNodePointerDown);

        this.nodeIdsMap.delete(node.element);
    }

    attachConnection(connectionId: string): void {
        const connection = this.di.graphStore.getConnection(connectionId);
        const element = connection.svgController.createSvg();

        element.style.transformOrigin = "50% 50%";
        element.style.position = "absolute";

        this.connectionsMap.set(connectionId, element);

        this.updateConnectionCoords(connectionId);

        this.connectionsContainer.appendChild(element);
    }

    detachConnection(connectionId: string): void {
        const element = this.connectionsMap.get(connectionId);
        this.connectionsMap.delete(connectionId);
        this.connectionsContainer.removeChild(element!);
    }

    moveNodeOnTop(nodeId: string): void {
        const node = this.di.graphStore.getNode(nodeId);
        this.nodesContainer.appendChild(node.element);
    }

    updateNodePosition(nodeId: string): void {
        const node = this.di.graphStore.getNode(nodeId);
        const connections = this.di.graphStore.getAllAdjacentToNodeConnections(nodeId);

        this.updateNodeCoords(node);

        connections.forEach(connection => {
            this.updateConnectionCoords(connection);
        });
    }

    private createHost(): HTMLDivElement {
        const host = document.createElement('div');

        host.style.width = "100%";
        host.style.height = "100%";
        host.style.position = "relative";
        host.style.overflow = "hidden";
        host.style.cursor = "default";

        return host;
    }

    private createCanvas(): HTMLCanvasElement {
        const canvas = document.createElement('canvas');

        canvas.style.position = "absolute";
        canvas.style.inset = "0";

        return canvas;
    }

    private createNodesContainer(): HTMLDivElement {
        const nodesContainer = document.createElement('div');

        nodesContainer.style.position = "absolute";
        nodesContainer.style.top = "0";
        nodesContainer.style.left = "0";
        nodesContainer.style.width = "0";
        nodesContainer.style.height = "0";

        return nodesContainer;
    }

    private createConnectionsContainer(): HTMLDivElement {
        const edgesContainer = document.createElement('div');

        edgesContainer.style.position = "absolute";
        edgesContainer.style.pointerEvents = "none";
        edgesContainer.style.top = "0";
        edgesContainer.style.left = "0";
        edgesContainer.style.width = "0";
        edgesContainer.style.height = "0";

        return edgesContainer;
    }

    private createHostResizeObserver(): ResizeObserver {
        return new ResizeObserver(() => {
            this.updateCanvasDimensions();
            this.applyTransform();
        });
    }

    private createNodesResizeObserver(): ResizeObserver {
        return new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                const nodeId = this.nodeIdsMap.get(entry.target as HTMLElement);
                const node = this.di.graphStore.getNode(nodeId!);

                this.updateNodeCoords(node);
            })
        });
    }

    private updateCanvasDimensions(): void {
        const { width, height } = this.host.getBoundingClientRect();

        this.canvas.width = width;
        this.canvas.height = height;
    }

    private updateNodeCoords(node: NodePayload): void {
        const { width, height } = node.element.getBoundingClientRect();
        const sa = this.di.viewportTransformer.getAbsoluteScale();

        node.element.style.left = `${node.x - sa * width / 2}px`;
        node.element.style.top = `${node.y - sa * height / 2}px`;
    }

    private updateConnectionCoords(connectionId: string): void {
        const payload = this.di.graphStore.getConnection(connectionId);
        const portFrom = this.di.graphStore.getPort(payload.from);
        const portTo = this.di.graphStore.getPort(payload.to);

        const rectFrom = portFrom.getBoundingClientRect();
        const rectTo = portTo.getBoundingClientRect();
        const rect = this.host.getBoundingClientRect();

        const [xaFrom, yaFrom] = this.di.viewportTransformer.getAbsoluteCoords(rectFrom.left - rect.left, rectFrom.top - rect.top);
        const [xaTo, yaTo] = this.di.viewportTransformer.getAbsoluteCoords(rectTo.left - rect.left, rectTo.top - rect.top);
        const top = Math.min(yaFrom, yaTo);
        const left = Math.min(xaFrom, xaTo);
        const width = Math.abs(xaTo - xaFrom);
        const height = Math.abs(yaTo - yaFrom);

        const element = this.connectionsMap.get(connectionId)!;

        const horDir = rectFrom.left <= rectTo.left;
        const vertDir = rectFrom.top <= rectTo.top;

        element.style.transform = `scale(${horDir ? 1 : -1}, ${vertDir ? 1 : -1})`;
        element.style.top = `${top}px`;
        element.style.left = `${left}px`;
        element.style.width = `${width}px`;
        element.style.height = `${height}px`;

        const connection = this.di.graphStore.getConnection(connectionId);
        connection.svgController.updateSvg(element, width, height);
    }
}
