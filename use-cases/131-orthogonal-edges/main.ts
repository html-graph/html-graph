import { CanvasBuilder } from "@html-graph/html-graph";

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const canvas = new CanvasBuilder(canvasElement)
  .setDefaults({
    nodes: { priority: 1 },
    edges: { priority: 0, shape: { type: "orthogonal" } },
  })
  .enableUserTransformableViewport()
  .enableUserDraggableNodes({ moveEdgesOnTop: false })
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
        x: (i + 1) * 300,
        y: (j + 1) * 300,
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
        x: (i + 1) * 300 + 100,
        y: (j + 1) * 300 + 100,
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
