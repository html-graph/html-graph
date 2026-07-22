import {
  CanvasBuilder,
  MidpointEdgeShape,
  OrthogonalEdgeShape,
} from "@html-graph/html-graph";
import { createMidpoint } from "../shared/create-midpoint";

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const canvas = new CanvasBuilder(canvasElement)
  .setDefaults({
    nodes: { priority: 0 },
    edges: {
      priority: 1,
      shape: () => {
        const baseShape = new OrthogonalEdgeShape();

        const midpoint = createMidpoint();

        return new MidpointEdgeShape(baseShape, midpoint);
      },
    },
  })
  .enableUserTransformableViewport()
  .enableUserDraggableNodes({ moveOnTop: false })
  .enableBackground()
  .build();

const angles = [0, Math.PI / 2, Math.PI, -Math.PI / 2];

let i = 0;
for (const sourceDir of angles) {
  let j = 0;

  for (const targetDir of angles) {
    const sourceNode = document.createElement("div");
    sourceNode.classList.add("node");

    const targetNode = document.createElement("div");
    targetNode.classList.add("node");

    const sourceId = `node-${i}-${j}-in`;
    const targetId = `node-${i}-${j}-out`;

    canvas
      .addNode({
        element: sourceNode,
        x: (j + 1) * 300,
        y: (i + 1) * 300,
        ports: [
          {
            id: sourceId,
            element: sourceNode,
            direction: sourceDir,
          },
        ],
      })
      .addNode({
        element: targetNode,
        x: (j + 1) * 300 + 100,
        y: (i + 1) * 300 + 100,
        ports: [
          {
            id: targetId,
            element: targetNode,
            direction: targetDir,
          },
        ],
      })
      .addEdge({
        from: sourceId,
        to: targetId,
      });
    j++;
  }

  i++;
}

canvas.focus({ contentPadding: 300 });
