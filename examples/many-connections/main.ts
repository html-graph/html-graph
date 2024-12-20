import { HtmlGraphBuilder } from "@html-graph/html-graph";

const canvas = new HtmlGraphBuilder()
  .setOptions({
    background: { type: "dots" },
    layers: { mode: "connections-on-top" },
    connections: { hasTargetArrow: true },
  })
  .setUserDraggableNodes()
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
    ports: { [newPortId]: port },
  });

  portIds.forEach((prevPortId) => {
    canvas.addConnection({ from: prevPortId, to: newPortId });
  });

  angle += (2 * Math.PI) / total;
  portIds.push(newPortId);
}
