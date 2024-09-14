import { Canvas } from "../../lib/main";

const canvasElement = document.getElementById("canvas")!;

const canvas = new Canvas(canvasElement, {
  scale: { enabled: true },
  shift: { enabled: true },
  nodes: { draggable: true },
  background: { type: "dots" },
  layers: {
    connectionsOnTop: true,
  },
});

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
