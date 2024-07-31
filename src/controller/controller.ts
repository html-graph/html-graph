import { NodeDto } from "@/models/node-dto";
import { EdgeDto } from "@/models/edge-dto";
import { DiContainer } from "@/di-container/di-container";

export class Controller {
    private readonly di: DiContainer;

    constructor(canvasWrapper: HTMLElement) {
        this.di = new DiContainer(canvasWrapper);
    }

    addNode(req: NodeDto): void {
        this.di.commandsQueue.addNode(req);
    }

    connectNodes(req: EdgeDto): void {
        this.di.commandsQueue.connectNodes(req);
    }

    flush(): void {
        this.di.commandsQueue.flush();
    }
}
