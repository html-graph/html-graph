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

        this.t = this.createTransformShiftInverse(event.movementX, event.movementY);

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

        const deltaScale = event.deltaY < 0 ? this.scaleVelocity : (1 / this.scaleVelocity);

        const { left, top } = this.host.getBoundingClientRect();
        const cx = event.clientX - left;
        const cy = event.clientY - top;

        this.t = this.createTransformScaleInverse(deltaScale, cx, cy);

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

    /**
     * dx2 - traslate x
     * dy2 - traslate y
     *
     * direct transform
     *  s1  0   dx1     1   0   dx2
     *  0   s1  dy1     0   1   dy2
     *  0   0   1       0   0   1
     *
     * reverse transform
     *  s1  0   dx1     1   0   -dx2
     *  0   s1  dy1     0   1   -dy2
     *  0   0   1       0   0   1
     *
     * [s2, dx2, dy2] = [s1, -dx2 * s + dx1, -dy2 * s + dy1]
     */
    private createTransformShiftInverse(dx: number, dy: number): TransformState {
        return {
            s: this.t.s,
            dx: -this.t.s * dx + this.t.dx,
            dy: -this.t.s * dy + this.t.dy,
        }
    }

    /**
     * s2 - scale
     * cx - scale pivot x
     * cy - scale pivot y
     *
     * direct transform
     *  s1  0   dx1     s2  0   (1 - s2) * cx
     *  0   s1  dy1     0   s2  (1 - s2) * cy
     *  0   0   1       0   0   1
     *
     * reverse transform
     *  s1  0   dx1     1/s2  0     (1 - 1/s2) * cx
     *  0   s1  dy1     0     1/s2  (1 - 1/s2) * cy
     *  0   0   1       0     0     1
     *
     * [s2, dx2, dy2] = [s1/s2, s1 * (1 - 1/s2) * cx + dx1, s1 * (1 - 1/s2) * cy + dy1]
     */
    private createTransformScaleInverse(s: number, cx: number, cy: number): TransformState {
        const res = {
            s: this.t.s / s,
            dx: this.t.s * (1 - 1 / s) * cx + this.t.dx,
            dy: this.t.s * (1 - 1 / s) * cy + this.t.dy,
        };

        return res;
    }

    private setCursor(type: 'grab' | 'default'): void {
        this.canvas.style.cursor = type;
    }

    private drawBackground(): void {
        this.canvasCtx.clearRect(0, 0, this.canvasCtx.canvas.width, this.canvasCtx.canvas.height);
        this.canvasCtx.save();
        this.drawPoint(0, 0, "black");
        this.drawPoint(100, 0, "#c9c9c9");
        this.drawPoint(-100, 0, "#c9c9c9");
        this.drawPoint(0, 100, "#c9c9c9");
        this.drawPoint(0, -100, "#c9c9c9");
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

    private getCanvasCoordsInverse([x0, y0]: [number, number]): [number, number] {
        return [
           (x0 - this.t.dx) / this.t.s,
           (y0 - this.t.dy) / this.t.s,
        ];
    }

    private getCanvasScaleInverse(): number {
        return 1 / this.t.s;
    }

    private drawPoint(x: number, y: number, color: string): void {
        const canvasScale = this.getCanvasScaleInverse();
        const r = 10 *  canvasScale;
        const pi2 = 2 * Math.PI;

        const [x1, y1] = this.getCanvasCoordsInverse([x, y]);

        this.canvasCtx.beginPath();
        this.canvasCtx.arc(x1, y1, r, 0, pi2);
        this.canvasCtx.closePath();

        this.canvasCtx.fillStyle = color;
        this.canvasCtx.fill();
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
