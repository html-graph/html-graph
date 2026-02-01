import { Canvas, CanvasBuilder } from "@html-graph/html-graph";
import graphData from "./graph.json";
import { createInOutNode } from "../shared/create-in-out-node";

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);

const canvas: Canvas = builder
  .setDefaults({
    nodes: {
      priority: 1,
    },
    edges: {
      shape: {
        hasTargetArrow: true,
      },
      priority: 0,
    },
  })
  .enableUserTransformableViewport()
  .enableLayout({
    algorithm: {
      type: "hierarchical",
      transform: { a: 1, b: 0, c: -1000, d: 0, e: 1, f: -500 },
    },
  })
  .enableBackground()
  .build();

const { width, height } = canvas.viewport.getDimensions();

canvas.patchContentMatrix({
  x: width / 2,
  y: height / 2,
  scale: 0.3,
});

graphData.nodes.forEach((nodeId) => {
  const createNodeRequest = createInOutNode({
    name: `${nodeId}`,
    frontPortId: `${nodeId}-in`,
    backPortId: `${nodeId}-out`,
  });

  canvas.addNode(createNodeRequest);
});

graphData.edges.forEach((edge) => {
  canvas.addEdge({ from: `${edge.from}-out`, to: `${edge.to}-in` });
});
