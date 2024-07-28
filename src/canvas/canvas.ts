import { ElementFactory } from "@/element-factory/element-factory";
import { AddNodeRequest } from "@/models/add-node-request";
import { ConnectNodesRequest } from "@/models/connect-nodes-request";
import { EdgeMetadata } from "@/models/edge-metadata";
import { NodeId } from "@/models/node-id";
import { NodeMetadata } from "@/models/node-metadata";

export class Canvas {
    private addNodeQueue: AddNodeRequest[] = [];

    private connectNodesQueue: ConnectNodesRequest[] = [];

    private readonly canvas: HTMLElement;

    private readonly svg: SVGSVGElement;

    private nodesMetadata: Map<NodeId, NodeMetadata> = new Map<NodeId, NodeMetadata>();

    private edgesMetadata: Map<string, EdgeMetadata> = new Map<string, EdgeMetadata>();

    private grabbedNodeId: NodeId | null = null;

    private mouseDownCoords: { x: number, y: number } | null = null;

    onGrab = (event: MouseEvent) => {
        this.canvas.style.cursor = "grab";

        this.mouseDownCoords = {
            x: event.offsetX,
            y: event.offsetY,
        };
    };

    onMove = (event: MouseEvent) => {
        if (this.grabbedNodeId !== null && this.mouseDownCoords !== null) {
            const metaData = this.nodesMetadata.get(this.grabbedNodeId);

            if (metaData) {
                metaData.el.style.left = `${event.clientX - this.mouseDownCoords.x}px`;
                metaData.el.style.top = `${event.clientY - this.mouseDownCoords.y}px`;
                metaData.x = event.clientX - this.mouseDownCoords.x + metaData.el.clientWidth / 2;
                metaData.y = event.clientY - this.mouseDownCoords.y + metaData.el.clientHeight / 2;
                this.updateEdges();
            }
        }
    };

    onRelease = () => {
        this.canvas.style.cursor = "default";

        this.mouseDownCoords = null;
        this.grabbedNodeId = null;
    };

    constructor(
        private readonly canvasWrapper: HTMLElement
    ) {
        this.canvas = ElementFactory.createCanvas(this.onGrab, this.onMove, this.onRelease);
        this.canvasWrapper.appendChild(this.canvas);

        this.svg = ElementFactory.createSvg();
        this.canvas.appendChild(this.svg);
    }

    addNode(request: AddNodeRequest): Canvas {
        this.addNodeQueue.push(request);

        return this;
    }

    connectNodes(request: ConnectNodesRequest): Canvas {
        this.connectNodesQueue.push(request);

        return this;
    }

    flush(): Canvas {
        this.flushAddNodeQueue();
        this.flushConnectNodesQueue();

        return this;
    }

    private flushAddNodeQueue(): void {
        this.addNodeQueue.forEach(request => {

            request.el.style.position = "absolute";
            request.el.style.visibility = "hidden";
            request.el.style.cursor = "grab";
            request.el.style.userSelect = "none";
            request.el.style.zIndex = "0";

            this.nodesMetadata.set(request.id, { x: request.x, y: request.y, el: request.el });
            this.canvas.appendChild(request.el);

            request.el.style.left = `${request.x - request.el.clientWidth / 2}px`;
            request.el.style.top = `${request.y - request.el.clientHeight / 2}px`;
            request.el.style.visibility = "visible";
            request.el.addEventListener('mousedown', (event: MouseEvent) => {
                if (event.button === 0) {
                    event.stopPropagation();

                    this.mouseDownCoords = {
                        x: event.offsetX,
                        y: event.offsetY,
                    };

                    this.grabbedNodeId = request.id;
                }
            });
        });

        this.addNodeQueue = [];
    }

    private flushConnectNodesQueue(): void {
        this.connectNodesQueue.forEach(request => {
            const fromMetadata = this.nodesMetadata.get(request.from);
            const toMetadata = this.nodesMetadata.get(request.to);
            const id = `${request.from}:${request.to}`;

            this.edgesMetadata.set(
                id,
                { nodeFrom: request.from, nodeTo: request.to }
            );

            if (fromMetadata && toMetadata) {
                const line = ElementFactory.createSvgLine(id, fromMetadata.x, fromMetadata.y, toMetadata.x, toMetadata.y);

                this.svg.append(line);
            }
        });

        this.connectNodesQueue = [];
    }

    private updateEdges(): void {
        this.edgesMetadata.forEach(data => {
            const fromMetadata = this.nodesMetadata.get(data.nodeFrom);
            const toMetadata = this.nodesMetadata.get(data.nodeTo);
            const id = `${data.nodeFrom}:${data.nodeTo}`;
            const line = this.svg.getElementById(id);

            if (fromMetadata && toMetadata) {
                line.setAttribute("x1", `${fromMetadata.x}`);
                line.setAttribute("y1", `${fromMetadata.y}`);
                line.setAttribute("x2", `${toMetadata.x}`);
                line.setAttribute("y2", `${toMetadata.y}`);
            }
        });
    }
}
