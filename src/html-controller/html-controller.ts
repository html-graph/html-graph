interface TransformState {
    s: number,
    dx: number,
    dy: number,
}

export class HtmlController {
    private readonly host: HTMLElement;

    private readonly svg: SVGSVGElement;

    private readonly canvas: HTMLCanvasElement;

    private readonly canvasCtx: CanvasRenderingContext2D;

    private readonly hostResizeObserver: ResizeObserver;

    private readonly scaleVelocity = 1.2;

    private t: TransformState = {
      s: 1,
      dx: 0,
      dy: 0,
    };

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

        this.t = this.createTransformShift(-event.movementX, -event.movementY);

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

        const deltaScale = event.deltaY < 0 ? (1 / this.scaleVelocity) : this.scaleVelocity;

        const { left, top } = this.host.getBoundingClientRect();
        const cx = event.clientX - left;
        const cy = event.clientY - top;

        this.t = this.createTransformScale(
            deltaScale,
            cx,
            cy,
        );

        this.drawBackground();
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

    private createTransformShift(dx: number, dy: number): TransformState {
        return {
            s: this.t.s,
            dx: dx * this.t.s + this.t.dx,
            dy: dy * this.t.s + this.t.dy,
        }
    }

    private createTransformScale(s: number, cx: number, cy: number): TransformState {
        const res = {
            s: this.t.s * s,
            dx: this.t.s * (1 - s) * cx + this.t.dx,
            dy: this.t.s * (1 - s) * cy + this.t.dy,
        };

        return res;
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

        this.canvas.width = width;
        this.canvas.height = height;
    }

    private draw(): void {
        this.drawPoint(0, 0, "black");
        this.drawPoint(100, 0, "#c9c9c9");
        this.drawPoint(-100, 0, "#c9c9c9");
        this.drawPoint(0, 100, "#c9c9c9");
        this.drawPoint(0, -100, "#c9c9c9");
    }

    private getCanvasCoords([x0, y0]: [number, number]): [number, number] {
        return [
           (x0 - this.t.dx) / this.t.s,
           (y0 - this.t.dy) / this.t.s,
        ];
    }

    private getCanvasScale(): number {
        return 1 / this.t.s;
    }

    private drawPoint(x: number, y: number, color: string): void {
        const canvasScale = this.getCanvasScale();
        const r = 10 *  canvasScale;
        const pi2 = 2 * Math.PI;

        const [x1, y1] = this.getCanvasCoords([x, y]);

        this.canvasCtx.beginPath();
        this.canvasCtx.arc(x1, y1, r, 0, pi2);
        this.canvasCtx.closePath();

        this.canvasCtx.fillStyle = color;
        this.canvasCtx.fill();
    }
}
