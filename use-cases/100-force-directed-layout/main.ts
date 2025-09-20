import { Canvas, CanvasBuilder, Identifier } from "@html-graph/html-graph";
import graphData from "./graph.json";
import { sfc32 } from "../shared/sfc32";
import { cyrb128 } from "../shared/cyrb128";
import { PhysicalSimulationIteration } from "./physical-simulation-iteration";

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);
const staticNodeIds = new Set<Identifier>();

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
  // .enableAnimatedLayout({
  //   algorithm: new RandomLayoutAlgorithm(),
  //   iterationAlgorithm: ForceDirectedLayoutIterationAlgorithm(),
  // })
  .enableUserDraggableNodes({
    moveEdgesOnTop: false,
    // TODO: add onNodeDragStarted event
    nodeDragVerifier: (nodeId) => {
      staticNodeIds.add(nodeId);

      return true;
    },
    events: {
      onNodeDragFinished: (nodeId) => {
        staticNodeIds.delete(nodeId);
      },
    },
  })
  .enableBackground()
  .build();

canvas.graph.onBeforeNodeRemoved.subscribe((nodeId) => {
  staticNodeIds.delete(nodeId);
});

canvas.graph.onBeforeClear.subscribe(() => {
  staticNodeIds.clear();
});

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

const updateCoordinates = (dt: number): void => {
  const iteration = new PhysicalSimulationIteration({
    graph: canvas.graph,
    dt,
    equilibriumEdgeLength: 300,
    nodeCharge: 1e5,
    nodeMass: 1,
    edgeStiffness: 1e3,
    staticNodeIds,
    xCoordinateResolver: (): number => rand() * 1000,
    yCoordinateResolver: (): number => rand() * 1000,
  });

  const nextCoords = iteration.calculateNextCoordinates();

  nextCoords.forEach((coords, nodeId) => {
    canvas.updateNode(nodeId, { x: coords.x, y: coords.y });
  });
};

let previousTimestamp: number;

const step = (timestamp: number): void => {
  if (previousTimestamp === undefined) {
    previousTimestamp = timestamp;
  } else {
    const dt = (timestamp - previousTimestamp) / 1000;
    previousTimestamp = timestamp;
    const dtLimited = dt > 0.1 ? 0 : dt;
    updateCoordinates(dtLimited);
  }

  requestAnimationFrame(step);
};

requestAnimationFrame(step);
