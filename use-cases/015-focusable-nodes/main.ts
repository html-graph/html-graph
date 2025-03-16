import { AddNodeRequest, Canvas, CanvasBuilder } from "@html-graph/html-graph";

export function createNode(params: {
  id: unknown;
  name: string;
  x: number;
  y: number;
}): AddNodeRequest {
  const node = document.createElement("button");
  node.classList.add("node");
  node.innerText = params.name;

  return {
    id: params.id,
    element: node,
    x: params.x,
    y: params.y,
  };
}

const builder: CanvasBuilder = new CanvasBuilder();
builder.setUserTransformableViewport();

const canvas: Canvas = builder.build();
const canvasElement: HTMLElement = document.getElementById("canvas")!;
canvas.attach(canvasElement);

const addNodeRequests: AddNodeRequest[] = [];

for (let i = 1; i <= 20; i++) {
  addNodeRequests.push(
    createNode({
      id: `node-${i}`,
      name: `Node ${i}`,
      x: 500 + 300 * i,
      y: 500,
    }),
  );
}

addNodeRequests.forEach((request) => {
  canvas.addNode(request);

  request.element.addEventListener("focus", () => {
    const node = canvas.graph.getNode(request.id)!;
    const rect = canvasElement.getBoundingClientRect();
    const sv = canvas.viewport.getViewportMatrix().scale;

    const targetX = node.x - (sv * rect.width) / 2;
    const targetY = node.y - (sv * rect.height) / 2;

    canvas.patchViewportMatrix({ x: targetX, y: targetY });
  });
});
