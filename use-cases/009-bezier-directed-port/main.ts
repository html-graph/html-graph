import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  HtmlGraphBuilder,
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

const builder: HtmlGraphBuilder = new HtmlGraphBuilder();
builder.setOptions({
  edges: {
    shape: {
      hasTargetArrow: true,
    },
  },
});
const canvas: Canvas = builder.build();
const canvasElement: HTMLElement = document.getElementById("canvas")!;

const addNode1Request: AddNodeRequest = createNode({
  name: "Node 1",
  x: 200,
  y: 400,
  frontPortId: "port-1-in",
  backPortId: "port-1-out",
  portDirection: Math.PI / 4,
});

const addNode2Request: AddNodeRequest = createNode({
  name: "Node 2",
  x: 500,
  y: 500,
  frontPortId: "port-2-in",
  backPortId: "port-2-out",
  portDirection: -Math.PI / 5,
});

const addEdgeRequest: AddEdgeRequest = {
  from: "port-1-out",
  to: "port-2-in",
};

canvas
  .attach(canvasElement)
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addEdge(addEdgeRequest);
