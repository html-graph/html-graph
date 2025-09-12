import { Canvas, CanvasBuilder } from "@html-graph/html-graph";
import graphData from "./graph.json";
import { ForceDirectedLayoutAlgorithm } from "./force-directed-layout-algorithm";

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);
const canvas: Canvas = builder
  .setDefaults({
    nodes: {
      priority: 1,
    },
    edges: {
      shape: {
        type: "direct",
        sourceOffset: 50,
        targetOffset: 50,
        hasTargetArrow: true,
      },
      priority: 0,
    },
  })
  .enableUserTransformableViewport()
  .enableUserDraggableNodes({
    moveEdgesOnTop: false,
  })
  .enableBackground()
  .enableLayout({
    algorithm: new ForceDirectedLayoutAlgorithm({
      boundingWidth: 1000,
      boundingHeight: 1000,
      iterations: 100,
      equilibriumEdgeLength: 500,
    }),
    applyOn: "topologyChange",
  })
  .build();

graphData.nodes.forEach((nodeId) => {
  const element = document.createElement("div");
  element.classList.add("node");
  element.innerText = `${nodeId}`;

  canvas.addNode({
    id: nodeId,
    element,
    ports: [
      {
        id: nodeId,
        element,
      },
    ],
  });
});

graphData.edges.forEach((edge) => {
  canvas.addEdge({ from: edge.from, to: edge.to });
});
