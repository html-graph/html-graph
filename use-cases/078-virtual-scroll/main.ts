import { Canvas, CanvasBuilder } from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const canvas: Canvas = new CanvasBuilder()
  .setOptions({
    edges: {
      shape: {
        type: "horizontal",
        hasTargetArrow: true,
      },
    },
  })
  .setUserTransformableViewport({
    transformPreprocessor: {
      type: "scale-limit",
      minContentScale: 0.3,
    },
  })
  .setVirtualScroll({
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

for (let i = 0; i < 100; i++) {
  for (let j = 0; j < 100; j++) {
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
