import { DiContainer } from "../di-container/di-container";
import { GraphEventType } from "../models/graph-event";

export class HtmlView {
    private readonly canvas: HTMLElement;

    private readonly svg: SVGSVGElement;

    private readonly nodeIdToElMapping = new Map<string, HTMLElement>();

    private readonly edgeIdToElMapping = new Map<string, SVGLineElement>();

    private readonly onNodeClick = (event: MouseEvent) => {
        if (event.button !== 0) {
            return;
        }

        const target = event.target as HTMLElement;

        const { top, left } = this.canvas.getBoundingClientRect();

        this.di.eventSubject.dispatch(
            GraphEventType.GrabNode,
            {
                nodeId: target.id,
                nodeMouseX: event.offsetX - target.clientWidth / 2 + left,
                nodeMouseY: event.offsetY - target.clientHeight / 2 + top,
            }
        );
    };

    constructor(
        private readonly di: DiContainer,
        private readonly canvasWrapper: HTMLElement
    ) {
        this.canvas = this.createCanvas();
        this.svg = this.createSvg();

        this.canvas.appendChild(this.svg);
        this.canvasWrapper.appendChild(this.canvas);

        this.canvasWrapper.style.overflow = "hidden";

        this.hookMouseDown();
        this.hookMouseMove()
        this.hookMouseUp();
        this.hookMouseScroll();
    }

    setGrabCursor(): void {
        this.canvas.style.cursor = "grab";
    }

    setDefaultCursor(): void {
        this.canvas.style.cursor = "default";
    }

    moveNodeOnTop(el: HTMLElement): void {
        this.canvas.appendChild(el);
    }

    appendNode(nodeId: string, el: HTMLElement, x: number, y: number): void {
        this.nodeIdToElMapping.set(nodeId, el);

        el.id = nodeId;
        el.style.position = "absolute";
        el.style.visibility = "hidden";
        el.style.cursor = "grab";
        el.style.userSelect = "none";
        el.style.zIndex = "0";
        el.style.transform = "matrix(1, 0, 0, 1, 0, 0)";

        this.canvas.appendChild(el);

        el.style.left = `${x - el.clientWidth / 2}px`;
        el.style.top = `${y - el.clientHeight / 2}px`;
        el.style.visibility = "visible";
        el.addEventListener('mousedown', this.onNodeClick);
    }

    appendEdge(edgeId: string, x1: number, y1: number, x2: number, y2: number): void {
        const line = document.createElementNS("http://www.w3.org/2000/svg","line");

        line.setAttribute("id", `${edgeId}`);
        line.setAttribute("x1", `${x1}`);
        line.setAttribute("y1", `${y1}`);
        line.setAttribute("x2", `${x2}`);
        line.setAttribute("y2", `${y2}`);
        line.setAttribute("stroke", "black")
        line.style.transform = "matrix(1, 0, 0, 1, 0, 0)";

        this.svg.append(line);
        this.edgeIdToElMapping.set(edgeId, line);
    }

    moveNodeTo(el: HTMLElement, x: number, y: number): void {
        el.style.left = `${x - el.clientWidth / 2}px`;
        el.style.top = `${y - el.clientHeight / 2}px`;
    }

    moveEdgeTo(edgeId: string, x1: number, y1: number, x2: number, y2: number): void {
        const line = this.edgeIdToElMapping.get(edgeId);

        if (line) {
            line.setAttribute("x1", `${x1}`);
            line.setAttribute("y1", `${y1}`);
            line.setAttribute("x2", `${x2}`);
            line.setAttribute("y2", `${y2}`);
        }
    }

    updateNodeTransform(el: HTMLElement, x: number, y: number, dx: number, dy: number, scale: number): void {
        // 1 0 -x   s 0 dx   1 0 x
        // 0 1 -y   0 s dy   0 1 y
        // 0 0 1    0 0 1    0 0 1

        // a c e
        // b d f

        // a = s
        // b = 0
        // c = 0
        // d = s
        // e = x * (s - 1) + dx
        // f = y * (s - 1) + dy
        //
        // s !== 1
        // x = (e - dx) / (s - 1)
        // y = (f - dy) / (s - 1)
        //
        // s === 1
        // x = e - dx
        // y = f - dy

        el.style.transform = `matrix(${scale}, 0, 0, ${scale}, ${x * (scale - 1) + dx}, ${y * (scale - 1) + dy})`;
    }

    updateEdgeTransform(edgeId: string, dx: number, dy: number, scale: number): void {
        const line = this.edgeIdToElMapping.get(edgeId);

        if (line !== undefined) {
            line.style.transform = `matrix(${scale}, 0, 0, ${scale}, ${dx}, ${dy})`;
        }
    }

    private createCanvas(): HTMLDivElement {
        const canvas = document.createElement('div');

        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.position = "relative";
        canvas.style.overflow = "hidden";

        return canvas;
    }

    private createSvg(): SVGSVGElement {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.position = "absolute";

        return svg;
    }

    private hookMouseDown(): void {
        this.canvasWrapper.addEventListener("mousedown", (event: MouseEvent) => {
            if (event.button !== 0) {
                return;
            }

            this.di.eventSubject.dispatch(
                GraphEventType.GrabCanvas,
                { mouseX: event.clientX, mouseY: event.clientY },
            );
        });
    }


    private hookMouseMove(): void {
        this.canvasWrapper.addEventListener("mousemove", (event: MouseEvent) => {
            if (event.buttons !== 1) {
                return;
            }

            this.di.eventSubject.dispatch(GraphEventType.MoveGrab, { 
                mouseX: event.clientX, mouseY: event.clientY
            });
        });
    }

    private hookMouseUp(): void {
        this.canvasWrapper.addEventListener("mouseup", (event: MouseEvent) => {
            if (event.button !== 0) {
                return;
            }

            this.di.eventSubject.dispatch(GraphEventType.ReleaseGrab)
        });
    }

    private hookMouseScroll(): void {
        this.canvasWrapper.addEventListener("wheel", (event: WheelEvent) => {
            if (!event.ctrlKey) {
                return;
            }

            event.preventDefault();

            this.di.eventSubject.dispatch(GraphEventType.ScaleCanvas, {
                value: event.deltaY < 0 ? 1: -1,
            });
        });
    }
}
