import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  HtmlGraphBuilder,
} from "@html-graph/html-graph";

export function createNode(params: {
  portId: unknown;
  x: number;
  y: number;
}): AddNodeRequest {
  const node = document.createElement("div");
  node.classList.add("node");
  node.innerText = `Node ${params.portId}`;

  return {
    element: node,
    x: params.x,
    y: params.y,
    ports: [{ id: params.portId, element: node }],
  };
}

const builder: HtmlGraphBuilder = new HtmlGraphBuilder();

builder
  .setOptions({
    edges: {
      priority: 0,
    },
    nodes: {
      priority: 1,
    },
  })
  .setUserTransformableViewport();

const canvas: Canvas = builder.build();
const canvasElement = document.getElementById("canvas")!;
canvas.attach(canvasElement);
canvas.patchViewportMatrix({ scale: 4, x: -1000, y: -1000 });

let angle = 0;
const total = 25;
const portIds: string[] = [];

for (let i = 0; i < total; i++) {
  const node = document.createElement("div");
  node.classList.add("node");

  const port = document.createElement("div");
  port.classList.add("port");
  node.appendChild(port);

  const newPortId = `${i}`;

  const addNodeRequest: AddNodeRequest = createNode({
    portId: newPortId,
    x: Math.cos(angle) * (600 + Math.floor(angle / (2 * Math.PI))) + 400,
    y: Math.sin(angle) * (600 + Math.floor(angle / (2 * Math.PI))) + 400,
  });

  canvas.addNode(addNodeRequest);

  portIds.forEach((prevPortId) => {
    const addEdgeRequest: AddEdgeRequest = {
      from: prevPortId,
      to: newPortId,
    };

    canvas.addEdge(addEdgeRequest);
  });

  angle += (2 * Math.PI) / total;
  portIds.push(newPortId);
}
