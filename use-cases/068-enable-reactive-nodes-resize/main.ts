import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  HtmlGraphBuilder,
} from "@html-graph/html-graph";

export function createInOutNode(params: {
  name: string;
  x: number;
  y: number;
  frontPortId: string;
  backPortId: string;
  priority?: number;
}): AddNodeRequest {
  const node = document.createElement("div");
  node.classList.add("node");

  const frontPort = document.createElement("div");
  frontPort.classList.add("node-port");
  node.appendChild(frontPort);

  const textarea = document.createElement("textarea");
  textarea.value = params.name;
  node.appendChild(textarea);

  const backPort = document.createElement("div");
  backPort.classList.add("node-port");
  node.appendChild(backPort);

  return {
    element: node,
    x: params.x,
    y: params.y,
    ports: [
      { id: params.frontPortId, element: frontPort },
      { id: params.backPortId, element: backPort },
    ],
    priority: params.priority,
  };
}

const builder: HtmlGraphBuilder = new HtmlGraphBuilder();

builder.setResizeReactiveNodes();

const canvas: Canvas = builder.build();
const canvasElement: HTMLElement = document.getElementById("canvas")!;

const addNode1Request: AddNodeRequest = createInOutNode({
  name: "Node 1",
  x: 400,
  y: 400,
  frontPortId: "node-1-in",
  backPortId: "node-1-out",
});

const addNode2Request: AddNodeRequest = createInOutNode({
  name: "Node 2",
  x: 800,
  y: 500,
  frontPortId: "node-2-in",
  backPortId: "node-2-out",
});

const addEdgeRequest: AddEdgeRequest = {
  from: "node-1-out",
  to: "node-2-in",
};

canvas
  .attach(canvasElement)
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addEdge(addEdgeRequest);
