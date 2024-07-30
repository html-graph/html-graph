import { DiContainer } from "@/di-container/di-container";
import { GraphEventType } from "@/models/graph-event";
import { NodeDto } from "@/models/node-dto";

export class HtmlView {
    private readonly canvas: HTMLElement;

    public readonly svg: SVGSVGElement;

    private eventSubject = this.di.eventSubject;

    constructor(
        private readonly di: DiContainer
    ) {
        this.canvas = this.createCanvas();

        this.svg = this.createSvg();

        this.canvas.appendChild(this.svg);

        this.canvas.addEventListener("mousedown", (event: MouseEvent) => {
            if (event.button === 0) {
                this.eventSubject.dispatch(
                    GraphEventType.GrabCanvas,
                    { mouseX: event.offsetX, mouseY: event.offsetY },
                );
            }
        });

        this.canvas.addEventListener("mousemove", (event: MouseEvent) => {
            if (event.button === 0) {
                this.eventSubject.dispatch(GraphEventType.MoveGrab, { 
                    mouseX: event.clientX, mouseY: event.clientY
                });
            }
        });

        this.canvas.addEventListener("mouseup", (event: MouseEvent) => {
            if (event.button === 0) {
                this.eventSubject.dispatch(GraphEventType.ReleaseGrab)
            }
        });
    }

    setGrabCursor(): void {
        this.canvas.style.cursor = "grab";
    }

    setDefaultCursor(): void {
        this.canvas.style.cursor = "default";
    }

    moveNodeOnTop(nodeId: string): void {
        const node = this.di.graphStore.getNode(nodeId);

        if (node) {
            this.canvas.appendChild(node.el);
        }
    }

    appendNode(req: NodeDto): void {
        this.preprocessNode(req);
        this.di.htmlView.canvas.appendChild(req.el);
        this.postprocessNode(req);
    }

    appendLine(id: string, x1: number, y1: number, x2: number, y2: number): void {
        const line = document.createElementNS("http://www.w3.org/2000/svg","line");

        line.setAttribute("id", `${id}`);
        line.setAttribute("x1", `${x1}`);
        line.setAttribute("y1", `${y1}`);
        line.setAttribute("x2", `${x2}`);
        line.setAttribute("y2", `${y2}`);
        line.setAttribute("stroke", "black")

        this.di.htmlView.svg.append(line);
    }

    updateLines(nodeId: string, x: number, y: number): void {
        const node = this.di.graphStore.getNode(nodeId);

        if (node) {
            node.el.style.left = `${x}px`;
            node.el.style.top = `${y}px`;
            node.x = x + node.el.clientWidth / 2;
            node.y = y + node.el.clientHeight / 2;

            this.di.graphStore.getAdjacentEdges(node.id).forEach(data => {
                const from = this.di.graphStore.getNode(data.from);
                const to = this.di.graphStore.getNode(data.to);

                if (from && to) {
                    const line = this.svg.getElementById(data.id);

                    line.setAttribute("x1", `${from.x}`);
                    line.setAttribute("y1", `${from.y}`);
                    line.setAttribute("x2", `${to.x}`);
                    line.setAttribute("y2", `${to.y}`);
                }
            });
        }
    }

    getHost(): HTMLElement {
        return this.canvas;
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

    private preprocessNode(req: NodeDto): void {
        req.el.id = req.id;
        req.el.style.position = "absolute";
        req.el.style.visibility = "hidden";
        req.el.style.cursor = "grab";
        req.el.style.userSelect = "none";
        req.el.style.zIndex = "0";
    }

    private postprocessNode(req: NodeDto): void {
        req.el.style.left = `${req.x - req.el.clientWidth / 2}px`;
        req.el.style.top = `${req.y - req.el.clientHeight / 2}px`;
        req.el.style.visibility = "visible";

        req.el.addEventListener('mousedown', (event: MouseEvent) => {
            if (event.button === 0) {
                event.stopPropagation();
                const target = event.target as HTMLElement;

                this.di.eventSubject.dispatch(
                    GraphEventType.GrabNode,
                    { mouseX: event.offsetX, mouseY: event.offsetY, nodeId: target.id }
                );
            }
        });
    }
}
