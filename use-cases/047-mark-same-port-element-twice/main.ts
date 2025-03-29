import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  CanvasDefaults,
  CanvasBuilder,
} from "@html-graph/html-graph";

export function createNode(params: {
  name: string;
  x: number;
  y: number;
  frontPortId: string;
  backPortId: string;
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
      { id: `${params.frontPortId}-direct`, element: frontPort, direction: 0 },
      { id: `${params.backPortId}-direct`, element: backPort, direction: 0 },
      {
        id: `${params.frontPortId}-reverse`,
        element: frontPort,
        direction: Math.PI,
      },
      {
        id: `${params.backPortId}-reverse`,
        element: backPort,
        direction: Math.PI,
      },
    ],
  };
}

const builder: CanvasBuilder = new CanvasBuilder();

const coreOptions: CanvasDefaults = {
  edges: {
    shape: {
      hasTargetArrow: true,
    },
  },
};

builder.setDefaults(coreOptions);

const canvas: Canvas = builder.build();
const canvasElement: HTMLElement = document.getElementById("canvas")!;

const addNode1Request: AddNodeRequest = createNode({
  name: "Node 1",
  x: 700,
  y: 500,
  frontPortId: "node-1-in",
  backPortId: "node-1-out",
});

const addNode2Request: AddNodeRequest = createNode({
  name: "Node 2",
  x: 200,
  y: 300,
  frontPortId: "node-2-in",
  backPortId: "node-2-out",
});

const addNode3Request: AddNodeRequest = createNode({
  name: "Node 3",
  x: 200,
  y: 700,
  frontPortId: "node-3-in",
  backPortId: "node-3-out",
});

const addEdge1Request: AddEdgeRequest = {
  from: "node-2-out-direct",
  to: "node-1-in-direct",
};

const addEdge2Request: AddEdgeRequest = {
  from: "node-1-in-reverse",
  to: "node-3-out-reverse",
};

canvas
  .attach(canvasElement)
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addNode(addNode3Request)
  .addEdge(addEdge1Request)
  .addEdge(addEdge2Request);
