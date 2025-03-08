import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  CanvasBuilder,
  CoreOptions,
  EventSubject,
  RenderingBox,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const builder: CanvasBuilder = new CanvasBuilder();

const options: CoreOptions = {
  edges: {
    shape: {
      type: "horizontal",
      hasTargetArrow: true,
    },
  },
};

const virtualScrollTrigger = new EventSubject<RenderingBox>();

const canvas: Canvas = builder
  .setOptions(options)
  .setUserTransformableViewport()
  .setVirtualScroll(virtualScrollTrigger)
  .build();

const canvasElement: HTMLElement = document.getElementById("canvas")!;

canvas.attach(canvasElement);

let nodeId = 0;
let sourcePortId: string | null = null;

for (let i = 0; i < 5; i++) {
  for (let j = 0; j < 400; j++) {
    const frontPortId = `node-${nodeId}-in`;
    const backPortId = `node-${nodeId}-out`;

    const addNodeRequest: AddNodeRequest = createInOutNode({
      name: `Node ${nodeId}`,
      x: 300 * j,
      y: 300 * i,
      frontPortId,
      backPortId,
    });

    canvas.addNode(addNodeRequest);

    if (sourcePortId !== null) {
      const addEdgeRequest: AddEdgeRequest = {
        from: sourcePortId,
        to: frontPortId,
      };

      canvas.addEdge(addEdgeRequest);
    }

    sourcePortId = backPortId;
    nodeId++;
  }
}

const viewportBox: RenderingBox = { x: 0, y: 0, width: 1000, height: 1000 };

virtualScrollTrigger.emit(viewportBox);
