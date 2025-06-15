import { AddNodeRequest, Canvas, CanvasBuilder } from "@html-graph/html-graph";

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

const canvasElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);

builder
  .setDefaults({
    edges: {
      priority: 0,
      shape: {
        type: "bezier",
        curvature: 200,
      },
    },
    nodes: {
      priority: 1,
    },
  })
  .enableUserDraggableNodes({
    moveOnTop: false,
  })
  .enableUserTransformableViewport();

const canvas: Canvas = builder.build();

let offset = 300;
const total = 1000;
let prevPortId: string | null = null;

for (let i = 0; i < total; i++) {
  const node = document.createElement("div");
  node.classList.add("node");

  const port = document.createElement("div");
  port.classList.add("port");
  node.appendChild(port);

  const newPortId = `${i}`;

  const addNodeRequest: AddNodeRequest = createNode({
    portId: newPortId,
    x: offset,
    y: 300,
  });

  canvas.addNode(addNodeRequest);

  if (prevPortId) {
    canvas.addEdge({ from: prevPortId, to: newPortId });
  }

  offset += 300;

  prevPortId = newPortId;
}
