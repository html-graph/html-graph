import { Canvas, CanvasBuilder } from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const canvas: Canvas = new CanvasBuilder()
  .setDefaults({
    edges: {
      shape: {
        type: "horizontal",
        hasTargetArrow: true,
      },
    },
  })
  .enableUserTransformableViewport({
    transformPreprocessor: {
      type: "scale-limit",
      minContentScale: 0.3,
    },
  })
  .enableVirtualScroll({
    nodeContainingRadius: {
      horizontal: 25,
      vertical: 25,
    },
  })
  .build();

const canvasElement: HTMLElement = document.getElementById("canvas")!;

canvas.attach(canvasElement);

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
