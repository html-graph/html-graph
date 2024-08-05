export class HtmlController {
    private readonly host: HTMLElement;

    private readonly svg: SVGSVGElement;

    private readonly canvas: HTMLCanvasElement;

    private readonly canvasCtx: CanvasRenderingContext2D;

    private readonly hostResizeObserver: ResizeObserver;

    constructor(
        private readonly canvasWrapper: HTMLElement,
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

    destroy(): void {
        this.hostResizeObserver.unobserve(this.host);
        this.host.removeChild(this.svg);
        this.host.removeChild(this.canvas);
    }

    private drawBackground(): void {
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const { width, height } = this.host.getBoundingClientRect();
        const resWidth = 2 * width;
        const resHeight = 2 * height;

        const centerX = resWidth / 2;
        const centerY = resHeight / 2;

        const horN = Math.ceil(Math.floor(resWidth / 100) / 2);
        const vertN = Math.ceil(Math.floor(resHeight / 100) / 2);

        const intX = horN * 100;
        const intY = vertN * 100;

        const iFrom = centerX - intX;
        const iTo = centerX + intX;

        const jFrom = centerY - intY;
        const jTo = centerY + intY;

        this.canvasCtx.strokeStyle = "black";
        this.canvasCtx.lineWidth = 1;

        for (let i = iFrom; i <= iTo; i+= 100) {
            for (let j = jFrom; j <= jTo; j+= 100) {
                this.canvasCtx.beginPath();
                this.canvasCtx.moveTo(i, 0);
                this.canvasCtx.lineTo(i, resHeight);
                this.canvasCtx.stroke();

                this.canvasCtx.beginPath();
                this.canvasCtx.moveTo(0, j);
                this.canvasCtx.lineTo(resWidth, j);
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
        return new ResizeObserver(() => {
            this.updateCanvasResolution();
            this.drawBackground();
        });
    }

    private updateCanvasResolution(): void {
        const { width, height } = this.host.getBoundingClientRect();

        const resWidth = 2 * width;
        const resHeight = 2 * height;

        this.canvas.width = resWidth;
        this.canvas.height = resHeight;
    }
}
