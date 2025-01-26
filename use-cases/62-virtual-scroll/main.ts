import { HtmlGraphBuilder } from "@html-graph/html-graph";
import { createBasicNode } from "../shared/create-basic-node";

const canvas = new HtmlGraphBuilder()
  .setOptions({
    edges: {
      shape: {
        type: "horizontal",
        hasTargetArrow: true,
      },
    },
  })
  .setUserTransformableCanvas({
    transformPreprocessor: {
      type: "scale-limit",
      maxContentScale: 2,
      minContentScale: 0.5,
    },
  })
  .build();

const canvasElement = document.getElementById("canvas")!;

canvas.attach(canvasElement);

let id = 0;
let prevPortId: string | null = null;

for (let i = 0; i < 20; i++) {
  for (let j = 0; j < 20; j++) {
    const frontPortId = `${id}-in`;
    const backPortId = `${id}-out`;

    canvas.addNode(
      createBasicNode({
        name: `Node ${id}`,
        x: 300 * j,
        y: 300 * i,
        frontPortId,
        backPortId,
      }),
    );

    if (prevPortId !== null) {
      canvas.addEdge({ from: prevPortId, to: frontPortId });
    }

    prevPortId = backPortId;

    id++;
  }
}
