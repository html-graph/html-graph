import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  CanvasBuilder,
  CanvasDefaults,
} from "@html-graph/html-graph";

export function createNode(params: {
  name: string;
  x: number;
  y: number;
  frontPortId: string;
  backPortId: string;
  portDirection: number;
}): AddNodeRequest {
  const node = document.createElement("div");
  node.classList.add("node");

  const frontPort = document.createElement("div");
  frontPort.classList.add("node-port");
  node.appendChild(frontPort);

  const text = document.createElement("div");
  text.innerText = params.name;
  node.appendChild(text);

  const backPort = document.createElement("div");
  backPort.classList.add("node-port");
  node.appendChild(backPort);

  return {
    element: node,
    x: params.x,
    y: params.y,
    ports: [
      {
        id: params.frontPortId,
        element: frontPort,
        direction: params.portDirection,
      },
      {
        id: params.backPortId,
        element: backPort,
        direction: params.portDirection,
      },
    ],
  };
}

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);

const defaults: CanvasDefaults = {
  edges: {
    shape: {
      hasTargetArrow: true,
    },
  },
};

builder.setDefaults(defaults);

const canvas: Canvas = builder.build();

const addNode1Request: AddNodeRequest = createNode({
  name: "Node 1",
  x: 200,
  y: 400,
  frontPortId: "node-1-in",
  backPortId: "node-1-out",
  portDirection: Math.PI / 4,
});

const addNode2Request: AddNodeRequest = createNode({
  name: "Node 2",
  x: 500,
  y: 500,
  frontPortId: "node-2-in",
  backPortId: "node-2-out",
  portDirection: -Math.PI / 5,
});

const addEdgeRequest: AddEdgeRequest = {
  from: "node-1-out",
  to: "node-2-in",
};

canvas
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addEdge(addEdgeRequest);
