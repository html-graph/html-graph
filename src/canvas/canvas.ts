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

    private mouseDownX: number | null = null;

    private mouseDownY: number | null = null;

    onMove = () => {
        this.mouseDownX = null;
        this.mouseDownY = null;
        this.grabbedNodeId = null;
    };

    onRelease = (event: MouseEvent) => {
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
    };

    constructor(
        private readonly canvasWrapper: HTMLElement
    ) {
        this.canvas = ElementFactory.createCanvas(this.onMove, this.onRelease);
        this.canvasWrapper.appendChild(this.canvas);

        this.svg = ElementFactory.createSvg();
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
            const wrapper = ElementFactory.createNodeWrapper(request.el);

            this.nodesMetadata.set(request.id, { x: request.x, y: request.y, wrapperEl: wrapper });
            this.canvas.appendChild(wrapper);

            wrapper.style.left = `${request.x - wrapper.clientWidth / 2}px`;
            wrapper.style.top = `${request.y - wrapper.clientHeight / 2}px`;
            wrapper.style.visibility = "visible";
            wrapper.addEventListener('mousedown', (event: MouseEvent) => {
                if (event.button === 0) {
                    this.mouseDownX = event.offsetX;
                    this.mouseDownY = event.offsetY;
                    this.grabbedNodeId = request.id;
                }
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
