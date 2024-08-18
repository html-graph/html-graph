import { GraphEventType } from "@/models/events/graph-event-type";
import { DiContainer } from "../di-container/di-container";

export class HtmlController {
    private readonly host: HTMLElement;

    private readonly nodesContainer: HTMLElement;

    private readonly svg: SVGSVGElement;

    private readonly canvas: HTMLCanvasElement;

    private readonly canvasCtx: CanvasRenderingContext2D;

    private readonly hostResizeObserver: ResizeObserver;

    private readonly nodes = new Map<string, HTMLElement>();

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

        this.svg = this.createSvg();
        this.canvas = this.createCanvas();
        this.nodesContainer = this.createNodesContainer();

        const context = this.canvas.getContext("2d");

        if (context === null) {
            throw new Error("unable to get canvas context");
        }

        this.canvasCtx = context;

        this.host.appendChild(this.canvas);
        this.host.appendChild(this.svg);
        this.host.appendChild(this.nodesContainer);
        this.canvasWrapper.appendChild(this.host);

        this.hostResizeObserver = this.createHostResizeObserver();
        this.hostResizeObserver.observe(this.host);
    }

    destroy(): void {
        this.host.removeEventListener("mousedown", this.onMouseDown);
        this.host.removeEventListener("mouseup", this.onMouseUp);
        this.host.removeEventListener("wheel", this.onMouseWheelScroll);
        this.hostResizeObserver.unobserve(this.host);
        this.host.removeChild(this.canvas);
        this.host.removeChild(this.svg);
        this.host.removeChild(this.nodesContainer);
        this.canvasWrapper.removeChild(this.host);
    }

    setCursor(type: 'grab' | 'default'): void {
        this.host.style.cursor = type;
    }

    applyTransform(): void {
        this.applyBackgroundTransform();
        this.applyNodesTransform();
    }

    addNode(id: string, html: HTMLElement, x: number, y: number): void {
        html.id = id;
        html.style.position = "absolute";
        html.style.visibility = "hidden";

        this.nodesContainer.appendChild(html);

        const { width, height } = html.getBoundingClientRect();

        html.style.left = `${x - width / 2}px`;
        html.style.top = `${y - height / 2}px`;
        html.style.visibility = "visible"

        this.nodes.set(id, html);
    }

    removeNode(id: string): void {
        const node = this.nodes.get(id);

        if (node !== undefined) {
            this.nodesContainer.removeChild(node);
            this.nodes.delete(id);
        }
    }

    private applyBackgroundTransform(): void {
        this.canvasCtx.clearRect(0, 0, this.canvasCtx.canvas.width, this.canvasCtx.canvas.height);
        this.canvasCtx.save();
        this.di.options.background.drawingFn(
            this.canvasCtx,
            this.di.publicViewportTransformer,
        );
        this.canvasCtx.restore();
    }

    private applyNodesTransform(): void {
        const scale = 1;
        const dx = 0;
        const dy = 0;

        this.nodes.forEach((value) => {
            value.style.transform = `matrix(${scale}, 0, 0, ${scale}, ${dx}, ${dy})`;
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

    private createSvg(): SVGSVGElement {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        svg.style.width = "100%";
        svg.style.height = "100%";

        return svg;
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
        nodesContainer.style.inset = "0";

        return nodesContainer;
    }

    private createHostResizeObserver(): ResizeObserver {
        return new ResizeObserver(() => {
            this.updateCanvasDimensions();
            this.applyBackgroundTransform();
        });
    }

    private updateCanvasDimensions(): void {
        const { width, height } = this.host.getBoundingClientRect();

        this.canvas.width = width;
        this.canvas.height = height;
    }
}
