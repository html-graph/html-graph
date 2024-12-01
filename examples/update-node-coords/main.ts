import { CanvasBuilder } from "../../lib/main";

const canvas = new CanvasBuilder()
  .options({
    background: { type: "dots" },
    connections: {
      type: "bezier",
      hasTargetArrow: true,
    },
  })
  .draggableNodes()
  .transformableCanvas()
  .build();

const node1 = document.createElement("div");
node1.classList.add("node");
node1.innerText = "1";

const node2 = document.createElement("div");
node2.classList.add("node");
node2.innerText = "2";

const port1 = document.createElement("div");
port1.classList.add("port");
port1.style.right = "0";

const port2 = document.createElement("div");
port2.classList.add("port");
port2.style.left = "0";

node1.appendChild(port1);
node2.appendChild(port2);

const canvasElement = document.getElementById("canvas")!;

canvas
  .attach(canvasElement)
  .addNode({
    id: "node-1",
    element: node1,
    x: 200,
    y: 300,
    ports: { "port-1": port1 },
  })
  .addNode({
    id: "node-2",
    element: node2,
    x: 600,
    y: 500,
    ports: { "port-2": port2 },
  })
  .addConnection({ from: "port-1", to: "port-2" });

let i = 0;

setInterval(() => {
  if (i % 2) {
    canvas.updateNodeCoords("node-1", 200, 300);
  } else {
    canvas.updateNodeCoords("node-1", 900, 300);
  }

  i++;
}, 1000);
