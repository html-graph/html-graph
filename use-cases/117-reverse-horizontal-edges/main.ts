import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  CanvasDefaults,
  CanvasBuilder,
  Identifier,
} from "@html-graph/html-graph";

export function createInOutNode(params: {
  id?: Identifier;
  name: string;
  x: number;
  y: number;
  inPortId: string;
  outPortId: string;
}): AddNodeRequest {
  const node = document.createElement("div");
  node.classList.add("node");

  const outPort = document.createElement("div");
  outPort.classList.add("node-port");
  node.appendChild(outPort);

  const text = document.createElement("div");
  text.innerText = params.name;
  node.appendChild(text);

  const inPort = document.createElement("div");
  inPort.classList.add("node-port");
  node.appendChild(inPort);

  return {
    id: params.id,
    element: node,
    x: params.x,
    y: params.y,
    ports: [
      { id: params.inPortId, element: inPort, direction: -Math.PI },
      { id: params.outPortId, element: outPort, direction: -Math.PI },
    ],
  };
}

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);

const canvasDefaults: CanvasDefaults = {
  edges: {
    shape: {
      type: "horizontal",
      hasTargetArrow: true,
    },
  },
};

const canvas: Canvas = builder
  .setDefaults(canvasDefaults)
  .enableUserTransformableViewport()
  .enableUserDraggableNodes()
  .build();

const addNode1Request: AddNodeRequest = createInOutNode({
  name: "Node 1",
  x: 500,
  y: 400,
  inPortId: "node-1-in",
  outPortId: "node-1-out",
});

const addNode2Request: AddNodeRequest = createInOutNode({
  name: "Node 2",
  x: 200,
  y: 500,
  inPortId: "node-2-in",
  outPortId: "node-2-out",
});

const addNode3Request: AddNodeRequest = createInOutNode({
  name: "Node 3",
  x: 500,
  y: 650,
  inPortId: "node-3-in",
  outPortId: "node-3-out",
});

const addEdge1Request: AddEdgeRequest = {
  from: "node-1-out",
  to: "node-2-in",
};

const addEdge2Request: AddEdgeRequest = {
  from: "node-2-out",
  to: "node-3-in",
};

canvas
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addNode(addNode3Request)
  .addEdge(addEdge1Request)
  .addEdge(addEdge2Request);
