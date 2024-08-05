import { DiContainer } from "@/di-container/di-container";
import { GraphEventType } from "@/event-subject/models/graph-event-type";

export class HtmlController {
    private readonly host: HTMLElement;

    private readonly svg: SVGSVGElement;

    private readonly canvas: HTMLCanvasElement;

    private readonly canvasCtx: CanvasRenderingContext2D;

    private readonly hostResizeObserver: ResizeObserver;

    constructor(
        private readonly canvasWrapper: HTMLElement,
        private readonly di: DiContainer
    ) {
        this.host = this.createHost();
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

    redraw(): void {
        this.draw();
    }

    destroy(): void {
        this.hostResizeObserver.unobserve(this.host);
        this.host.removeChild(this.svg);
        this.host.removeChild(this.canvas);
    }

    private draw(): void {
        this.canvasCtx.moveTo(0, 0);
        this.canvasCtx.lineTo(200, 100);
        this.canvasCtx.lineWidth = 10;
        this.canvasCtx.stroke();

        const { width, height } = this.host.getBoundingClientRect();

        const centerX = width / 2;
        const centerY = height / 2;

        const horN = Math.ceil(Math.floor(height / 20) / 2);
        const vertN = Math.ceil(Math.floor(width / 20) / 2);

        const iFrom = centerX - horN;
        const iTo = centerX + horN;

        const jFrom = centerY - vertN;
        const jTo = centerY + vertN;

        this.canvasCtx.strokeStyle = "black";
        this.canvasCtx.lineWidth = 10;

        for (let i = iFrom; i <= iTo; i+= 20) {
            for (let j = jFrom; j <= jTo; j+= 20) {
                this.canvasCtx.beginPath();
                this.canvasCtx.moveTo(i, 0);
                this.canvasCtx.lineTo(i, width);
                this.canvasCtx.stroke();

                this.canvasCtx.beginPath();
                this.canvasCtx.moveTo(0, j);
                this.canvasCtx.lineTo(width, j);
                this.canvasCtx.stroke();
            }
        }
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

        return canvas;
    }

    private createHostResizeObserver(): ResizeObserver {
        return new ResizeObserver((entries) => {
            const rect = entries[0].contentRect;

            this.di.eventSubject.dispatch(GraphEventType.HostElementResize, {
                newWidth: rect.width,
                newHeight: rect.height,
            });

            this.canvas.style.width = `${rect.width}px`;
            this.canvas.style.height = `${rect.height}px`;
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
        });
    }
}
