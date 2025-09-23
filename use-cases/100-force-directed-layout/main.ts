import { Canvas, CanvasBuilder } from "@html-graph/html-graph";
import graphData from "./graph.json";
import { sfc32 } from "../shared/sfc32";
import { cyrb128 } from "../shared/cyrb128";
import { ForceDirectedLayoutAlgorithm } from "./force-directed-layout-algorithm";

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);

const seed = cyrb128("chstytwwbbnhgj2d");
const rand = sfc32(seed[0], seed[1], seed[2], seed[3]);

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
  .enableAnimatedLayout({
    algorithm: new ForceDirectedLayoutAlgorithm({
      nodeCharge: 1e5,
      nodeMass: 1,
      edgeStiffness: 1e3,
      equilibriumEdgeLength: 300,
      xFallbackResolver: (): number => rand() * 1000,
      yFallbackResolver: (): number => rand() * 1000,
    }),
  })
  .enableAnimatedLayout()
  .enableUserDraggableNodes({
    moveEdgesOnTop: false,
  })
  .enableBackground()
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
