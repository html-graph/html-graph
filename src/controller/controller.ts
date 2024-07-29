import { ElementFactory } from "@/element-factory/element-factory";
import { GraphStore } from "@/graph-store/graph-store";
import { NodeDto } from "@/models/node-dto";
import { EdgeDto } from "@/models/edge-dto";

export class Controller {
    private store = new GraphStore();

    private addNodeQueue: NodeDto[] = [];

    private connectNodesQueue: EdgeDto[] = [];

    private readonly canvas: HTMLElement;

    private readonly svg: SVGSVGElement;

    private grabbedNodeId: string | null = null;

    private mouseDownCoords: { x: number, y: number } | null = null;

    private onGrab = (event: MouseEvent) => {
        this.canvas.style.cursor = "grab";

        this.mouseDownCoords = {
            x: event.offsetX,
            y: event.offsetY,
        };
    };

    private onMove = (event: MouseEvent) => {
        if (this.grabbedNodeId !== null && this.mouseDownCoords !== null) {
            const node = this.store.getNode(this.grabbedNodeId);

            if (node) {
                node.el.style.left = `${event.clientX - this.mouseDownCoords.x}px`;
                node.el.style.top = `${event.clientY - this.mouseDownCoords.y}px`;
                node.x = event.clientX - this.mouseDownCoords.x + node.el.clientWidth / 2;
                node.y = event.clientY - this.mouseDownCoords.y + node.el.clientHeight / 2;

                this.store.getAdjacentEdges(node.id).forEach(data => {
                    const from = this.store.getNode(data.from);
                    const to = this.store.getNode(data.to);
                    const line = this.svg.getElementById(data.id);

                    if (from && to) {
                        line.setAttribute("x1", `${from.x}`);
                        line.setAttribute("y1", `${from.y}`);
                        line.setAttribute("x2", `${to.x}`);
                        line.setAttribute("y2", `${to.y}`);
                    }
                });
            }
        }
    };

    private onRelease = () => {
        this.canvas.style.cursor = "default";

        this.mouseDownCoords = null;
        this.grabbedNodeId = null;
    };

    constructor(
        private readonly canvasWrapper: HTMLElement
    ) {
        this.canvas = ElementFactory.createCanvas(this.onGrab, this.onMove, this.onRelease);
        this.svg = ElementFactory.createSvg();

        this.canvas.appendChild(this.svg);
        this.canvasWrapper.appendChild(this.canvas);
    }

    addNode(req: NodeDto): void {
        this.addNodeQueue.push(req);
    }

    connectNodes(req: EdgeDto): void {
        this.connectNodesQueue.push(req);
    }

    flush(): void {
        this.flushAddNodeQueue();
        this.flushConnectNodesQueue();
    }

    private flushAddNodeQueue(): void {
        this.addNodeQueue.forEach(req => {
            req.el.id = req.id;
            req.el.style.position = "absolute";
            req.el.style.visibility = "hidden";
            req.el.style.cursor = "grab";
            req.el.style.userSelect = "none";
            req.el.style.zIndex = "0";

            this.store.addNode(req);
            this.canvas.appendChild(req.el);

            req.el.style.left = `${req.x - req.el.clientWidth / 2}px`;
            req.el.style.top = `${req.y - req.el.clientHeight / 2}px`;
            req.el.style.visibility = "visible";
            req.el.addEventListener('mousedown', (event: MouseEvent) => {
                if (event.button === 0) {
                    event.stopPropagation();

                    this.mouseDownCoords = {
                        x: event.offsetX,
                        y: event.offsetY,
                    };

                    this.grabbedNodeId = req.id;

                    this.canvas.appendChild(event.target as HTMLElement);
                }
            });
        });

        this.addNodeQueue = [];
    }

    private flushConnectNodesQueue(): void {
        this.connectNodesQueue.forEach(request => {
            const from = this.store.getNode(request.from);
            const to = this.store.getNode(request.to);

            this.store.addEdge(request);

            if (from && to) {
                const line = ElementFactory.createSvgLine(request.id, from.x, from.y, to.x, to.y);

                this.svg.append(line);
            }
        });

        this.connectNodesQueue = [];
    }
}
