import { DiContainer } from "@/di-container/di-container";
import { GraphEventType } from "@/models/graph-event-type";

export class HtmlController {
    private readonly host: HTMLElement;

    private readonly svg: SVGSVGElement;

    private readonly canvas: HTMLCanvasElement;

    private readonly canvasCtx: CanvasRenderingContext2D;

    private readonly hostResizeObserver: ResizeObserver;

    private readonly onMouseDown = (event: MouseEvent) => {
        if (event.button === 0) {
            this.di.eventSubject.dispatch(GraphEventType.CanvasGrab);
        }
    }

    private readonly onMouseMove = (event: MouseEvent) => {
        if (event.buttons === 1) {
            this.di.eventSubject.dispatch(
                GraphEventType.CanvasDrag,
                { dx: event.movementX, dy: event.movementY },
            );
        }
    }

    private readonly onMouseUp = (event: MouseEvent) => {
        if (event.button === 0) {
            this.di.eventSubject.dispatch(GraphEventType.CanvasRelease);
        }
    }

    private readonly onMouseWheelScroll = (event: WheelEvent) => {
        if (event.ctrlKey) {
            const { left, top } = this.host.getBoundingClientRect();
            const centerX = event.clientX - left;
            const centerY = event.clientY - top;

            this.di.eventSubject.dispatch(
                GraphEventType.CanvasScale,
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

        const context = this.canvas.getContext("2d");

        if (context === null) {
            throw new Error("unable to get canvas context");
        }

        this.canvasCtx = context;

        this.host.appendChild(this.svg);
        this.host.appendChild(this.canvas);

        this.canvasWrapper.style.overflow = "hidden";
        this.canvasWrapper.appendChild(this.host);

        this.hostResizeObserver = this.createHostResizeObserver();
        this.hostResizeObserver.observe(this.host);
    }

    destroy(): void {
        this.host.removeEventListener("mousedown", this.onMouseDown);
        this.host.removeEventListener("mouseup", this.onMouseUp);
        this.host.removeEventListener("wheel", this.onMouseWheelScroll);
        this.hostResizeObserver.unobserve(this.host);
        this.host.removeChild(this.svg);
        this.host.removeChild(this.canvas);
        this.canvasWrapper.removeChild(this.host);
    }

    setCursor(type: 'grab' | 'default'): void {
        this.canvas.style.cursor = type;
    }

    drawBackground(): void {
        this.canvasCtx.clearRect(0, 0, this.canvasCtx.canvas.width, this.canvasCtx.canvas.height);
        this.canvasCtx.save();
        this.di.options.background.drawingFn(this.canvasCtx);
        this.canvasCtx.restore();
    }

    private createHost(): HTMLDivElement {
        const host = document.createElement('div');

        host.style.width = "100%";
        host.style.height = "100%";
        host.style.position = "relative";
        host.style.overflow = "hidden";

        return host;
    }

    private createSvg(): SVGSVGElement {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.position = "absolute";

        return svg;
    }

    private createCanvas(): HTMLCanvasElement {
        const canvas = document.createElement('canvas');

        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.position = "absolute";
        canvas.style.cursor = "default";

        return canvas;
    }

    private createHostResizeObserver(): ResizeObserver {
        return new ResizeObserver(() => {
            this.updateCanvasDimensions();
            this.drawBackground();
        });
    }

    private updateCanvasDimensions(): void {
        const { width, height } = this.host.getBoundingClientRect();

        this.canvas.width = width;
        this.canvas.height = height;
    }
}
