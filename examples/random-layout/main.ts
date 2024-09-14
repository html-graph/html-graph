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

let offset = 0;
const total = 1000;
let prevPortId: string | null = null;

for (let i = 0; i < total; i++) {
  const node = document.createElement("div");
  node.classList.add("node");

  const port = document.createElement("div");
  port.classList.add("port");
  node.appendChild(port);

  const newPortId = `${i}`;

  canvas.addNode({
    element: node,
    x: offset,
    y: 300 + Math.random() * 200,
    ports: { [newPortId]: port },
  });

  if (prevPortId) {
    canvas.addConnection({ from: prevPortId, to: newPortId });
  }

  offset += 300;

  prevPortId = newPortId;
}
