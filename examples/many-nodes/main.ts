import {
  CanvasCore,
  DraggableNodesCanvas,
  TransformableCanvas,
} from "../../lib/main";

const canvasElement = document.getElementById("canvas")!;

const canvas = new DraggableNodesCanvas(
  new TransformableCanvas(
    new CanvasCore({
      background: { type: "dots" },
      layers: {
        mode: "connections-on-top",
      },
    }),
  ),
);

let offset = 0;
const total = 1000;
let prevPortId: string | null = null;

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
