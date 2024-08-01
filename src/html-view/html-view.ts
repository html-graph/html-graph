import { DiContainer } from "@/di-container/di-container";
import { GraphEventType } from "@/models/graph-event";

export class HtmlView {
    private readonly canvas: HTMLElement;

    private readonly svg: SVGSVGElement;

    constructor(
        private readonly di: DiContainer,
        private readonly canvasWrapper: HTMLElement
    ) {
        this.canvas = this.createCanvas();
        this.svg = this.createSvg();

        this.canvas.appendChild(this.svg);
        this.canvasWrapper.appendChild(this.canvas);
    }

    setGrabCursor(): void {
        this.canvas.style.cursor = "grab";
    }

    setDefaultCursor(): void {
        this.canvas.style.cursor = "default";
    }

    moveNodeOnTop(nodeId: string): void {
        const el = this.canvas.querySelector(`[id='${nodeId}']`) as HTMLElement;

        this.canvas.appendChild(el);
    }

    appendNode(id: string, el: HTMLElement, x: number, y: number): void {
        el.id = id;
        el.style.position = "absolute";
        el.style.visibility = "hidden";
        el.style.cursor = "grab";
        el.style.userSelect = "none";
        el.style.zIndex = "0";

        this.canvas.appendChild(el);

        el.style.left = `${x - el.clientWidth / 2}px`;
        el.style.top = `${y - el.clientHeight / 2}px`;
        el.style.visibility = "visible";

        el.addEventListener('mousedown', (event: MouseEvent) => {
            if (event.button !== 0) {
                return;
            }

            event.stopPropagation();
            const target = event.target as HTMLElement;

            this.di.eventSubject.dispatch(
                GraphEventType.GrabNode,
                {
                    nodeId: target.id,
                    nodeMouseX: event.offsetX + el.clientWidth / 2,
                    nodeMouseY: event.offsetY + el.clientHeight / 2,
                }
            );
        });
    }

    appendLine(id: string, x1: number, y1: number, x2: number, y2: number): void {
        const line = document.createElementNS("http://www.w3.org/2000/svg","line");

        line.setAttribute("id", `${id}`);
        line.setAttribute("x1", `${x1}`);
        line.setAttribute("y1", `${y1}`);
        line.setAttribute("x2", `${x2}`);
        line.setAttribute("y2", `${y2}`);
        line.setAttribute("stroke", "black")

        this.svg.append(line);
    }

    moveNodeTo(nodeId: string, x: number, y: number): void {
        const el = this.canvas.querySelector(`[id='${nodeId}']`) as HTMLElement;

        el.style.left = `${x + el.clientWidth / 2}px`;
        el.style.top = `${y + el.clientHeight / 2}px`;
    }

    moveEdgeTo(edgeId: string, x1: number, y1: number, x2: number, y2: number): void {
        const line = this.svg.getElementById(edgeId);

        line.setAttribute("x1", `${x1}`);
        line.setAttribute("y1", `${y1}`);
        line.setAttribute("x2", `${x2}`);
        line.setAttribute("y2", `${y2}`);
    }

    private createCanvas(): HTMLDivElement {
        const canvas = document.createElement('div');

        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.position = "relative";
        canvas.style.overflow = "hidden";

        canvas.addEventListener("mousedown", (event: MouseEvent) => {
            if (event.button !== 0) {
                return;
            }

            this.di.eventSubject.dispatch(
                GraphEventType.GrabCanvas,
                { mouseX: event.clientX, mouseY: event.clientY },
            );
        });

        canvas.addEventListener("mousemove", (event: MouseEvent) => {
            if (event.buttons !== 1) {
                return;
            }

            this.di.eventSubject.dispatch(GraphEventType.MoveGrab, { 
                mouseX: event.clientX, mouseY: event.clientY
            });
        });

        canvas.addEventListener("mouseup", (event: MouseEvent) => {
            if (event.button !== 0) {
                return;
            }

            this.di.eventSubject.dispatch(GraphEventType.ReleaseGrab)
        });

        return canvas;
    }

    private createSvg(): SVGSVGElement {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.position = "absolute";

        return svg;
    }
}
