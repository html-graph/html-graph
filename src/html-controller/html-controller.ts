export class HtmlController {
    private readonly host: HTMLElement;

    private readonly svg: SVGSVGElement;

    private readonly canvas: HTMLCanvasElement;

    private readonly canvasCtx: CanvasRenderingContext2D;

    private readonly hostResizeObserver: ResizeObserver;

    private readonly minScaleShift = -5;

    private readonly maxScaleShift = 3;

    private scaleShift = 0;

    private scaleBase = 1.2

    private get scale(): number {
        return Math.pow(this.scaleBase, -this.scaleShift);
    }

    private viewportShiftX = 0;

    private viewportShiftY = 0;

    private hostWidth = 0;

    private hostHeight = 0;

    private halfHostWidth = 0;

    private halfHostHeight = 0;

    /**
     *   1 0 -dx  s 0 0  1 0 dx
     *   0 1 -dy  0 s 0  0 1 dy
     *   0 0 1    0 0 1  0 0 1
     *
     *   s 0 -dx  1 0 dx
     *   0 s -dy  0 1 dy
     *   0 0 1    0 0 1
     *
     *   s 0 (s - 1) * dx
     *   0 s (s - 1) * dy
     *   0 0 1
     *
     *   x2 = s * x1 + (s-1) * dx
     *   y2 = s * y1 + (s-1) * dy
     *
     *   x1 = (x2 - (s-1) * dx) / s
     *   y1 = (y2 - (s-1) * dy) / s
     *
     */

    private getCanvasX(x1: number): number {
        return (x1 + this.viewportShiftX) * this.scale + this.halfHostWidth;
    }

    private getCanvasY(y1: number): number {
        return (y1 + this.viewportShiftY) * this.scale + this.halfHostHeight;
    }

    private getViewportX(x2: number): number {
        return (x2- this.halfHostWidth) / this.scale - this.viewportShiftX ;
    }

    private getViewportY(y2: number): number {
        return (y2 - this.halfHostHeight) / this.scale - this.viewportShiftY;
    }

    private readonly onMouseDown = (event: MouseEvent) => {
        if (event.button !== 0) {
            return;
        }

        this.setCursor('grab');
    }

    private readonly onMouseMove = (event: MouseEvent) => {
        if (event.buttons !== 1) {
            return
        }

        this.viewportShiftX += event.movementX / this.scale;
        this.viewportShiftY += event.movementY / this.scale;
        this.drawBackground();
    }

    private readonly onMouseUp = (event: MouseEvent) => {
        if (event.button !== 0) {
            return;
        }

        this.setCursor('default');
    }

    private readonly onMouseWheelScroll = (event: WheelEvent) => {
        if (!event.ctrlKey) {
            return;
        }

        event.preventDefault();

        const prevScaleShift = this.scaleShift;
        const unlimitedScaleShift = this.scaleShift + (event.deltaY > 0 ? 1 : -1);
        const scaleShift = Math.min(Math.max(this.minScaleShift, unlimitedScaleShift), this.maxScaleShift);

        if (scaleShift !== prevScaleShift) {
            // this.scaleShift = scaleShift;
            const { left, top } = this.host.getBoundingClientRect();

            const viewX = this.getViewportX(event.clientX - left);
            const viewY = this.getViewportY(event.clientY - top);

            this.drawBackground();
        }
    }

    constructor(
        private readonly canvasWrapper: HTMLElement,
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
    }

    private setCursor(type: 'grab' | 'default'): void {
        this.canvas.style.cursor = type;
    }

    private drawBackground(): void {
        this.canvasCtx.clearRect(0, 0, this.canvasCtx.canvas.width, this.canvasCtx.canvas.height);
        this.draw();
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

        this.hostWidth = width;
        this.hostHeight = height;
        this.halfHostWidth = width / 2;
        this.halfHostHeight = height / 2;
        this.canvas.width = width;
        this.canvas.height = height;
    }

    private draw(): void {
        this.canvasCtx.beginPath();
        this.canvasCtx.arc(this.getCanvasX(0), this.getCanvasY(0), 10 * this.scale, 0, 2 * Math.PI);
        this.canvasCtx.closePath();
        this.canvasCtx.fillStyle = "black";
        this.canvasCtx.fill();

        this.canvasCtx.fillStyle = "#c9c9c9";

        this.canvasCtx.beginPath();
        this.canvasCtx.arc(this.getCanvasX(100), this.getCanvasY(0) , 10 * this.scale, 0, 2 * Math.PI);
        this.canvasCtx.closePath();
        this.canvasCtx.fill();

        this.canvasCtx.beginPath();
        this.canvasCtx.arc(this.getCanvasX(-100), this.getCanvasY(0) , 10 * this.scale, 0, 2 * Math.PI);
        this.canvasCtx.closePath();
        this.canvasCtx.fill();

        this.canvasCtx.beginPath();
        this.canvasCtx.arc(this.getCanvasX(0), this.getCanvasY(100) , 10 * this.scale, 0, 2 * Math.PI);
        this.canvasCtx.closePath();
        this.canvasCtx.fill();

        this.canvasCtx.beginPath();
        this.canvasCtx.arc(this.getCanvasX(0), this.getCanvasY(-100) , 10 * this.scale, 0, 2 * Math.PI);
        this.canvasCtx.closePath();
        this.canvasCtx.fill();
    }
}
