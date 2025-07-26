import {
  Canvas,
  CanvasBuilder,
  CanvasDefaults,
  ViewportTransformConfig,
  VirtualScrollConfig,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const canvasElement: HTMLElement = document.getElementById("canvas")!;

const defaults: CanvasDefaults = {
  edges: {
    shape: {
      type: "horizontal",
      hasTargetArrow: true,
    },
  },
};

const transformConfig: ViewportTransformConfig = {
  transformPreprocessor: {
    type: "scale-limit",
    minContentScale: 0.3,
  },
};

const virtualScrollConfig: VirtualScrollConfig = {
  nodeContainingRadius: {
    horizontal: 25,
    vertical: 25,
  },
  events: {
    onBeforeNodeAttached: (nodeId) => {
      console.log(`node ${nodeId} entered viewport`);
    },
    onAfterNodeDetached: (nodeId) => {
      console.log(`node ${nodeId} left viewport`);
    },
  },
};

const canvas: Canvas = new CanvasBuilder(canvasElement)
  .setDefaults(defaults)
  .enableUserTransformableViewport(transformConfig)
  .enableVirtualScroll(virtualScrollConfig)
  .build();

let cnt = 0;

let prevPortId: unknown | null = null;

for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10000; j++) {
    const frontPortId = `node-${cnt}-in`;
    const backPortId = `node-${cnt}-out`;

    canvas.addNode(
      createInOutNode({
        name: `Node ${cnt}`,
        x: j * 300,
        y: i * 300,
        frontPortId,
        backPortId,
      }),
    );

    if (prevPortId !== null) {
      canvas.addEdge({ from: prevPortId, to: frontPortId });
    }

    prevPortId = backPortId;
    cnt++;
  }
}
