function getOriginalX(x1: number, xc: number, s: number, dx: number): number {
    return (x1 + xc * (s - 1) - dx) / s;
}

function getOriginalY(y1: number, yc: number, s: number, dy: number): number {
    return (y1 + yc * (s - 1) - dy) / s;
}

function getCanvasX(x0: number, s: number, dx: number): number {
    return x0 * s + dx;
}

function getCanvasY(x0: number, s: number, dy: number): number {
    return x0 * s + dy;
}

interface Transform {
    scale: number,
    cx: number,
    cy: number,
    dx: number,
    dy: number,
}

function getNextTransform(v0: Transform, v1: Transform): Transform {
    return {
        scale: v0.scale * v1.scale,
        cx: 0,
        cy: 0,
        dx: v0.scale * v1.dx + v0.dx,
        dy: v0.scale * v1.dy + v0.dy,
    }
}

export class HtmlController {
    private readonly host: HTMLElement;

    private readonly svg: SVGSVGElement;

    private readonly canvas: HTMLCanvasElement;

    private readonly canvasCtx: CanvasRenderingContext2D;

    private readonly hostResizeObserver: ResizeObserver;

    private s = 1;

    private dx = 0;

    private dy = 0;

    private cx = 0;

    private cy = 0;

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

        const t = getNextTransform({
            scale: this.s,
            cx: this.cx,
            cy: this.cy,
            dx: this.dx,
            dy: this.dy,
        }, {
            scale: 1,
            cx: 0,
            cy: 0,
            dx: event.movementX,
            dy: event.movementY,
        });

        this.s = t.scale;
        this.dx = t.dx;
        this.dy = t.dy;
        this.cx = t.cx;
        this.cy = t.cy;

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
        // const prevScaleShift = this.scaleShift;

        const deltaScale = (event.deltaY > 0 ? 1/1.2 : 1.2);

        const { left, top } = this.host.getBoundingClientRect();

        const cx = event.clientX - left;
        const cy = event.clientY - top;

        const t = getNextTransform({
            scale: this.s,
            cx: this.cx,
            cy: this.cy,
            dx: this.dx,
            dy: this.dy,
        }, {
            scale: deltaScale,
            cx: cx,
            cy: cy,
            dx: 0,
            dy: 0,
        });

        this.s = t.scale;
        this.dx = t.dx;
        this.dy = t.dy;
        this.cx = t.cx;
        this.cy = this.cy;

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
        const r = 10 * this.s;
        const pi2 = 2 * Math.PI;

        this.canvasCtx.beginPath();
        this.canvasCtx.arc(
            getCanvasX(0, this.s, this.dx),
            getCanvasY(0, this.s, this.dy),
            r,
            0,
            pi2
        );
        this.canvasCtx.closePath();
        this.canvasCtx.fillStyle = "black";
        this.canvasCtx.fill();

        this.canvasCtx.fillStyle = "#c9c9c9";

        this.canvasCtx.beginPath();
        this.canvasCtx.arc(
            getCanvasX(100, this.s, this.dx),
            getCanvasY(0, this.s, this.dy),
            r,
            0,
            pi2
        );
        this.canvasCtx.closePath();
        this.canvasCtx.fill();

        this.canvasCtx.beginPath();
        this.canvasCtx.arc(
            getCanvasX(-100, this.s, this.dx),
            getCanvasY(0, this.s, this.dy),
            r,
            0,
            pi2
        );
        this.canvasCtx.closePath();
        this.canvasCtx.fill();

        this.canvasCtx.beginPath();
        this.canvasCtx.arc(
            getCanvasX(0, this.s, this.dx),
            getCanvasY(100, this.s, this.dy),
            r,
            0,
            pi2
        );
        this.canvasCtx.closePath();
        this.canvasCtx.fill();

        this.canvasCtx.beginPath();
        this.canvasCtx.arc(
            getCanvasX(0, this.s, this.dx),
            getCanvasY(-100, this.s, this.dy),
            r,
            0,
            pi2
        );
        this.canvasCtx.closePath();
        this.canvasCtx.fill();
    }
}
