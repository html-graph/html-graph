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
        });

        this.addNodeQueue = [];
    }

    private flushConnectNodesQueue(): void {
        this.connectNodesQueue.forEach(req => {
            this.di.graphStore.addEdge(req);
        });

        this.connectNodesQueue = [];
    }
}
