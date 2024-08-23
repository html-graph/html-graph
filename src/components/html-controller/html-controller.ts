import { GraphEventType } from "@/models/events/graph-event-type";
import { DiContainer } from "../di-container/di-container";
import { NodePayload } from "@/models/html/node-payload";
import { ConnectionDrawingFn } from "@/models/connection/connection-drawing-fn";

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

    private readonly onMouseDown = (event: MouseEvent) => {
        if (event.button === 0) {
            this.di.eventSubject.dispatch(GraphEventType.GrabViewport);

            event.stopPropagation();
        }
    }

    private readonly onMouseMove = (event: MouseEvent) => {
        if (event.buttons === 1) {
            this.di.eventSubject.dispatch(
                GraphEventType.DragViewport,
                { dx: event.movementX, dy: event.movementY },
            );

            event.stopPropagation();
        }
    }

    private readonly onMouseUp = (event: MouseEvent) => {
        if (event.button === 0) {
            this.di.eventSubject.dispatch(GraphEventType.ReleaseViewport);

            event.stopPropagation();
        }
    }

    private readonly onMouseWheelScroll = (event: WheelEvent) => {
        if (event.ctrlKey) {
            const { left, top } = this.host.getBoundingClientRect();
            const centerX = event.clientX - left;
            const centerY = event.clientY - top;

            this.di.eventSubject.dispatch(
                GraphEventType.ScaleViewport,
                { deltaY: event.deltaY, centerX, centerY },
            );

            event.preventDefault();
        }
    }

    constructor(
        private readonly canvasWrapper: HTMLElement,
        private readonly di: DiContainer,
    ) {
        this.host = this.createHost();
        this.host.addEventListener("mousedown", this.onMouseDown);
        this.host.addEventListener("mouseup", this.onMouseUp);
        this.host.addEventListener("mousemove", this.onMouseMove);
        this.host.addEventListener("wheel", this.onMouseWheelScroll);

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

    destroy(): void {
        this.host.removeEventListener("mousedown", this.onMouseDown);
        this.host.removeEventListener("mouseup", this.onMouseUp);
        this.host.removeEventListener("mousemove", this.onMouseMove);
        this.host.removeEventListener("wheel", this.onMouseWheelScroll);
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

        const [xv, yv] = this.di.viewportTransformer.getViewportCoordsFor(0, 0);
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
    }

    detachNode(nodeId: string): void {
        const node = this.di.graphStore.getNode(nodeId);

        this.nodesResizeObserver.unobserve(node.element);
        this.nodesContainer.removeChild(node.element);
        this.nodeIdsMap.delete(node.element);
    }

    attachConnection(connectionId: string, element: SVGSVGElement): void {
        this.connectionsMap.set(connectionId, element);

        this.updateConnectionCoords(connectionId);

        this.connectionsContainer.appendChild(element);
    }

    detachConnection(connectionId: string): void {
        const element = this.connectionsMap.get(connectionId);
        this.connectionsMap.delete(connectionId);
        this.connectionsContainer.removeChild(element!);
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

        node.element.style.left = `${node.x - width / 2}px`;
        node.element.style.top = `${node.y - height / 2}px`;
    }

    private updateConnectionCoords(connectionId: string): void {
        const payload = this.di.graphStore.getConnection(connectionId);
        const portFrom = this.di.graphStore.getPort(payload.from);
        const portTo = this.di.graphStore.getPort(payload.to);

        const rectFrom = portFrom.getBoundingClientRect();
        const rectTo = portTo.getBoundingClientRect();

        const top = Math.min(rectFrom.top, rectTo.top);
        const left = Math.min(rectFrom.left, rectTo.left);
        const width = Math.abs(rectFrom.left - rectTo.left);
        const height = Math.abs(rectFrom.top - rectTo.top);

        const element = this.connectionsMap.get(connectionId)!;

        element.style.transformOrigin = "50% 50%";

        const hor = left === rectFrom.left;
        const vert = top === rectFrom.top;

        element.style.transform = `scale(${hor ? 1 : -1}, ${vert ? 1 : -1})`;

        element.style.position = "absolute";
        element.style.top = `${top}px`;
        element.style.left = `${left}px`;
        element.style.width = `${width}px`;
        element.style.height = `${height}px`;
    }

    private createConnectionSvg(): SVGSVGElement {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        return svg;
    }
}
