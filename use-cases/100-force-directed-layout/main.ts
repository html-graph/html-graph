import { Canvas, CanvasBuilder, EventSubject } from "@html-graph/html-graph";
import graphData from "./graph.json";
import { ForceDirectedLayoutAlgorithm } from "./force-directed-layout-algorithm";

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);
const trigger = new EventSubject<void>();

const layoutAlgorithm = new ForceDirectedLayoutAlgorithm({
  boundingWidth: 1000,
  boundingHeight: 1000,
  iterations: 1,
  timeDelta: 0.1,
  equilibriumEdgeLength: 300,
  nodeCharge: 5000,
  edgeStiffness: 0.5,
});

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
    algorithm: layoutAlgorithm,
    applyOn: trigger,
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

let prev: number;

const step = (timestamp: number): void => {
  if (prev === undefined) {
    prev = timestamp;
  } else {
    const dt = timestamp - prev;
    prev = timestamp;
    layoutAlgorithm.setTimeDelta(dt / 100);
  }

  trigger.emit();
  requestAnimationFrame(step);
};

requestAnimationFrame(step);
