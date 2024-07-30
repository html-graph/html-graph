import { DiContainer } from "@/di-container/di-container";
import { EdgeDto } from "@/models/edge-dto";
import { NodeDto } from "@/models/node-dto";

export class CommandsQueue {
    private addNodeQueue: NodeDto[] = [];

    private connectNodesQueue: EdgeDto[] = [];

    constructor(
        private readonly di: DiContainer
    ) { }

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
            this.di.graphStore.addNode(req);
            this.di.htmlView.appendNode(req);
        });

        this.addNodeQueue = [];
    }

    private flushConnectNodesQueue(): void {
        this.connectNodesQueue.forEach(req => {
            const from = this.di.graphStore.getNode(req.from);
            const to = this.di.graphStore.getNode(req.to);

            this.di.graphStore.addEdge(req);

            if (from && to) {
                this.di.htmlView.appendLine(req.id, from.x, from.y, to.x, to.y);
            }
        });

        this.connectNodesQueue = [];
    }
}
