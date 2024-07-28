import { AddNodeRequest } from "./models/add-node-request";
import { ConnectNodesRequest } from "./models/connect-nodes-request";
import { NodeId } from "./models/node-id";
import { NodeMetadata } from "./models/node-metadata";

export class GraphFlow {
    private addNodeQueue: AddNodeRequest[] = [];

    private connectNodesQueue: ConnectNodesRequest[] = [];

    private readonly canvas: HTMLElement;

    private readonly svg: SVGSVGElement;

    private nodesMetadata: Map<NodeId, NodeMetadata> = new Map<NodeId, NodeMetadata>();

    constructor(
        private readonly canvasWrapper: HTMLElement
    ) {
        this.canvas = document.createElement('div');
        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";
        this.canvas.style.position = "relative";

        this.canvasWrapper.appendChild(this.canvas);

        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svg.style.width = "100%";
        this.svg.style.height = "100%";
        this.svg.style.position = "relative";

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
            request.el.style.left = `${request.x}px`;
            request.el.style.top = `${request.y}px`;
            request.el.style.position = "absolute";

            this.canvas.appendChild(request.el);
            this.nodesMetadata.set(request.id, { x: request.x, y: request.y });
        });

        this.addNodeQueue = [];
    }

    private flushCreateNodesQueue(): void {
        this.connectNodesQueue.forEach(request => {
            const fromMetadata = this.nodesMetadata.get(request.nodeFrom);
            const toMetadata = this.nodesMetadata.get(request.nodeTo);

            console.log(request);
            console.log(this.nodesMetadata.get(request.nodeFrom));

            const line = document.createElementNS("http://www.w3.org/2000/svg","line");

            line.setAttribute("x1", `${fromMetadata?.x}`);
            line.setAttribute("y1", `${fromMetadata?.y}`);
            line.setAttribute("x2", `${toMetadata?.x}`);
            line.setAttribute("y2", `${toMetadata?.y}`);
            line.setAttribute("stroke", "black")

            this.svg.append(line);
        });

        this.connectNodesQueue = [];
    }
}
