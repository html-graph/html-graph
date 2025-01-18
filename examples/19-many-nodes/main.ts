import { HtmlGraphBuilder } from "@html-graph/html-graph";

const canvas = new HtmlGraphBuilder()
  .setOptions({
    background: {
      type: "dots",
    },
    edges: {
      shape: {
        hasTargetArrow: true,
      },
    },
  })
  .setUserDraggableNodes({
    grabPriorityStrategy: "freeze",
  })
  .setUserTransformableCanvas()
  .build();

let offset = 0;
const total = 1000;
let prevPortId: string | null = null;

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
    x: offset,
    y: 300 + Math.random() * 200,
    ports: [[newPortId, port]],
    priority: 0,
  });

  if (prevPortId) {
    canvas.addEdge({ from: prevPortId, to: newPortId, priority: 1 });
  }

  offset += 300;

  prevPortId = newPortId;
}
