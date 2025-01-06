import { HtmlGraphBuilder } from "@html-graph/html-graph";

const canvas = new HtmlGraphBuilder()
  .setOptions({
    background: { type: "dots" },
    edges: { shape: { hasTargetArrow: true } },
  })
  .setUserDraggableNodes({
    grabPriorityStrategy: "freeze",
  })
  .setUserTransformableCanvas()
  .build();

let angle = 0;
const total = 25;
const portIds: string[] = [];

const canvasElement = document.getElementById("canvas")!;

canvas.attach(canvasElement);

for (let i = 0; i < total; i++) {
  const node = document.createElement("div");
  node.classList.add("node");

  const port = document.createElement("div");
  port.classList.add("port");
  node.appendChild(port);

  const newPortId = `${i}`;

  canvas.addNode({
    element: node,
    x: Math.cos(angle) * (600 + Math.floor(angle / (2 * Math.PI))) + 400,
    y: Math.sin(angle) * (600 + Math.floor(angle / (2 * Math.PI))) + 400,
    ports: [[newPortId, port]],
    priority: 0,
  });

  portIds.forEach((prevPortId) => {
    canvas.addEdge({ from: prevPortId, to: newPortId, priority: 1 });
  });

  angle += (2 * Math.PI) / total;
  portIds.push(newPortId);
}
