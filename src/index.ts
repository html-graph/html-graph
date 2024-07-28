import { AddNodeRequest } from "./models/add-node-request";
import { ConnectNodesRequest } from "./models/connect-nodes-request";
import { EdgeMetadata } from "./models/edge-metadata";
import { NodeId } from "./models/node-id";
import { NodeMetadata } from "./models/node-metadata";

export class GraphFlow {
    private addNodeQueue: AddNodeRequest[] = [];

    private connectNodesQueue: ConnectNodesRequest[] = [];

    private readonly canvas: HTMLElement;

    private readonly svg: SVGSVGElement;

    private nodesMetadata: Map<NodeId, NodeMetadata> = new Map<NodeId, NodeMetadata>();

    private edgesMetadata: Map<string, EdgeMetadata> = new Map<string, EdgeMetadata>();

    private grabbedNodeId: NodeId | null = null;

    private mouseDownX: number | null = null;

    private mouseDownY: number | null = null;

    constructor(
        private readonly canvasWrapper: HTMLElement
    ) {
        this.canvas = document.createElement('div');
        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";
        this.canvas.style.position = "relative";

        this.canvas.addEventListener("mouseup", () => {
            this.mouseDownX = null;
            this.mouseDownY = null;
            this.grabbedNodeId = null;
        });

        this.canvas.addEventListener("mousemove", (event: MouseEvent) => {
            if (this.grabbedNodeId !== null && this.mouseDownX !== null && this.mouseDownY !== null) {
                const metaData = this.nodesMetadata.get(this.grabbedNodeId);

                if (metaData) {
                    metaData.wrapperEl.style.left = `${event.clientX - this.mouseDownX}px`;
                    metaData.wrapperEl.style.top = `${event.clientY - this.mouseDownY}px`;
                    metaData.x = event.clientX - this.mouseDownX + metaData.wrapperEl.clientWidth / 2;
                    metaData.y = event.clientY - this.mouseDownY + metaData.wrapperEl.clientHeight / 2;
                    this.updateEdges();
                }
            }
        });

        this.canvasWrapper.appendChild(this.canvas);

        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svg.style.width = "100%";
        this.svg.style.height = "100%";
        this.svg.style.position = "absolute";

        this.canvas.appendChild(this.svg);
    }

    addNode(request: AddNodeRequest): void {
        this.addNodeQueue.push(request);
    }

    connectNodes(request: ConnectNodesRequest): void {
        this.connectNodesQueue.push(request);
    }

    flush(): void {
        this.flushAddNodeQueue();
        this.flushCreateNodesQueue();
    }

    private flushAddNodeQueue(): void {
        this.addNodeQueue.forEach(request => {
            const wrapper = document.createElement('div');
            wrapper.appendChild(request.el);

            wrapper.style.left = `${request.x}px`;
            wrapper.style.top = `${request.y}px`;
            wrapper.style.position = "absolute";
            wrapper.style.visibility = "hidden";
            wrapper.style.cursor = "grab";
            wrapper.style.userSelect = "none";

            this.nodesMetadata.set(request.id, { x: request.x, y: request.y, wrapperEl: wrapper });
            this.canvas.appendChild(wrapper);

            wrapper.style.left = `${request.x - wrapper.clientWidth / 2}px`;
            wrapper.style.top = `${request.y - wrapper.clientHeight / 2}px`;
            wrapper.style.visibility = "visible";
            wrapper.addEventListener('mousedown', (event: MouseEvent) => {
                this.mouseDownX = event.offsetX;
                this.mouseDownY = event.offsetY;
                this.grabbedNodeId = request.id;
            });
        });

        this.addNodeQueue = [];
    }

    private flushCreateNodesQueue(): void {
        this.connectNodesQueue.forEach(request => {
            const fromMetadata = this.nodesMetadata.get(request.nodeFrom);
            const toMetadata = this.nodesMetadata.get(request.nodeTo);
            const id = `${request.nodeFrom}:${request.nodeTo}`;

            this.edgesMetadata.set(
                id,
                { nodeFrom: request.nodeFrom, nodeTo: request.nodeTo }
            );

            const line = document.createElementNS("http://www.w3.org/2000/svg","line");

            line.setAttribute("id", `${id}`);
            line.setAttribute("x1", `${fromMetadata?.x}`);
            line.setAttribute("y1", `${fromMetadata?.y}`);
            line.setAttribute("x2", `${toMetadata?.x}`);
            line.setAttribute("y2", `${toMetadata?.y}`);
            line.setAttribute("stroke", "black")

            this.svg.append(line);

        });

        this.connectNodesQueue = [];
    }

    private updateEdges(): void {
        this.edgesMetadata.forEach(data => {
            const fromMetadata = this.nodesMetadata.get(data.nodeFrom);
            const toMetadata = this.nodesMetadata.get(data.nodeTo);
            const id = `${data.nodeFrom}:${data.nodeTo}`;
            const line = this.svg.getElementById(id);

            line.setAttribute("x1", `${fromMetadata?.x}`);
            line.setAttribute("y1", `${fromMetadata?.y}`);
            line.setAttribute("x2", `${toMetadata?.x}`);
            line.setAttribute("y2", `${toMetadata?.y}`);
        });
    }
}
