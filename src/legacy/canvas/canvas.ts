import { Controller } from "@/controller/controller";
import { NodeDto } from "@/models/node-dto";
import { EdgeDto } from "@/models/edge-dto";

export class Canvas {
    private controller: Controller;

    constructor(canvasWrapper: HTMLElement) {
        this.controller = new Controller(canvasWrapper);
    }

    addNode(req: NodeDto): Canvas {
        this.controller.addNode(req);

        return this;
    }

    connectNodes(req: EdgeDto): Canvas {
        this.controller.connectNodes(req);

        return this;
    }

    flush(): Canvas {
        this.controller.flush();

        return this;
    }
}
