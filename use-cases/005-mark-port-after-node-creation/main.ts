import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  CanvasBuilder,
  Identifier,
  MarkPortRequest,
} from "@html-graph/html-graph";

export function createNode(params: {
  id: Identifier;
  name: string;
  x: number;
  y: number;
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
    id: params.id,
    element: node,
    x: params.x,
    y: params.y,
  };
}

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);
builder.enableNodeResizeReactiveEdges();

const canvas: Canvas = builder.build();

const addNode1Request: AddNodeRequest = createNode({
  id: "node-1",
  name: "Node 1",
  x: 200,
  y: 400,
});

const addNode2Request: AddNodeRequest = createNode({
  id: "node-2",
  name: "Node 2",
  x: 500,
  y: 500,
});

const addEdgeRequest: AddEdgeRequest = {
  from: "node-1-out",
  to: "node-2-in",
};

canvas.addNode(addNode1Request).addNode(addNode2Request);

const markPort1InRequest: MarkPortRequest = {
  id: "node-1-in",
  nodeId: "node-1",
  element: addNode1Request.element.children[0] as HTMLElement,
};

const markPort1OutRequest: MarkPortRequest = {
  id: "node-1-out",
  nodeId: "node-1",
  element: addNode1Request.element.children[2] as HTMLElement,
};

const markPort2InRequest: MarkPortRequest = {
  id: "node-2-in",
  nodeId: "node-2",
  element: addNode2Request.element.children[0] as HTMLElement,
};

const markPort2OutRequest: MarkPortRequest = {
  id: "node-2-out",
  nodeId: "node-2",
  element: addNode2Request.element.children[2] as HTMLElement,
};

const markPortsBtn = document.getElementById("mark-ports")!;

markPortsBtn.addEventListener(
  "click",
  () => {
    canvas
      .markPort(markPort1InRequest)
      .markPort(markPort1OutRequest)
      .markPort(markPort2InRequest)
      .markPort(markPort2OutRequest);
  },
  { passive: true },
);

const addEdgeBtn = document.getElementById("create-edge")!;

addEdgeBtn.addEventListener(
  "click",
  () => {
    canvas.addEdge(addEdgeRequest);
  },
  { passive: true },
);
