import {
  Canvas,
  CanvasBuilder,
  EventSubject,
  Point,
} from "@html-graph/html-graph";
import graphData from "./graph.json";
import { ForceDirectedLayoutAlgorithm } from "./force-directed-layout-algorithm";
import { sfc32 } from "../shared/sfc32";
import { cyrb128 } from "../shared/cyrb128";

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);
const trigger = new EventSubject<void>();

const seed = cyrb128("chstytwwbbnhgj2d");
const rand = sfc32(seed[0], seed[1], seed[2], seed[3]);

const forceDirectedLayoutAlgorithm = new ForceDirectedLayoutAlgorithm({
  iterations: 1,
  equilibriumEdgeLength: 300,
  nodeCharge: 1e5,
  edgeStiffness: 1e3,
  timeDelta: 0.1,
  initialCoordinatesResolver: (node): Point => {
    return {
      x: node.x ?? rand() * 1000,
      y: node.y ?? rand() * 1000,
    };
  },
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
    // TODO: add onNodeDragStarted event
    nodeDragVerifier: (nodeId) => {
      forceDirectedLayoutAlgorithm.setStaticNode(nodeId);

      return true;
    },
    events: {
      onNodeDragFinished: (nodeId) => {
        forceDirectedLayoutAlgorithm.unsetStaticNode(nodeId);
      },
    },
  })
  .enableBackground()
  .enableLayout({
    algorithm: forceDirectedLayoutAlgorithm,
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

let previousTimestamp: number;

const step = (timestamp: number): void => {
  if (previousTimestamp === undefined) {
    previousTimestamp = timestamp;
    forceDirectedLayoutAlgorithm.setTimeDelta(1e-4);
  } else {
    const dt = (timestamp - previousTimestamp) / 1000;
    previousTimestamp = timestamp;
    const dtLimited = dt > 0.1 ? 0 : dt;
    forceDirectedLayoutAlgorithm.setTimeDelta(dtLimited);
  }

  trigger.emit();
  requestAnimationFrame(step);
};

requestAnimationFrame(step);
