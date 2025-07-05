import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  CanvasBuilder,
  CanvasDefaults,
} from "@html-graph/html-graph";
export function createNode(params: {
  id: unknown;
  name: string;
  x: number;
  y: number;
}): AddNodeRequest {
  const node = document.createElement("div");
  node.classList.add("node");

  node.innerText = params.name;

  return {
    element: node,
    x: params.x,
    y: params.y,
    ports: [{ id: params.id, element: node }],
  };
}

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);

const canvasDefaults: CanvasDefaults = {
  nodes: {
    priority: 1,
  },
  edges: {
    shape: {
      type: "direct",
      sourceOffset: 50,
      targetOffset: 50,
      hasTargetArrow: true,
      hasSourceArrow: true,
    },
    priority: 0,
  },
};

const canvas: Canvas = builder
  .setDefaults(canvasDefaults)
  .enableUserDraggableNodes({ moveOnTop: false })
  .enableUserTransformableViewport()
  .enableBackground()
  .build();

const addNode1Request: AddNodeRequest = createNode({
  id: "node-1",
  name: "1",
  x: 200,
  y: 400,
});

const addNode2Request: AddNodeRequest = createNode({
  id: "node-2",
  name: "2",
  x: 500,
  y: 500,
});

const addNode3Request: AddNodeRequest = createNode({
  id: "node-3",
  name: "3",
  x: 800,
  y: 300,
});

const addNode4Request: AddNodeRequest = createNode({
  id: "node-4",
  name: "4",
  x: 800,
  y: 700,
});

const addEdge1Request: AddEdgeRequest = {
  from: "node-1",
  to: "node-2",
};

const addEdge2Request: AddEdgeRequest = {
  from: "node-2",
  to: "node-3",
};

const addEdge3Request: AddEdgeRequest = {
  from: "node-2",
  to: "node-4",
};

canvas
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addNode(addNode3Request)
  .addNode(addNode4Request)
  .addEdge(addEdge1Request)
  .addEdge(addEdge2Request)
  .addEdge(addEdge3Request);
