import {
  BezierConnectionController,
  HtmlGraphBuilder,
} from "@html-graph/html-graph";

const canvas = new HtmlGraphBuilder()
  .setOptions({
    background: { type: "dots" },
    connections: { hasTargetArrow: true },
  })
  .setDraggableNodes()
  .setTransformableCanvas()
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
  .addNode({ element: node1, x: 200, y: 300, ports: { "port-1": port1 } })
  .addNode({ element: node2, x: 600, y: 500, ports: { "port-2": port2 } })
  .addConnection({ id: "con-1", from: "port-1", to: "port-2" });

let i = 0;

const redController = new BezierConnectionController(
  "red",
  2,
  90,
  15,
  4,
  true,
  false,
);

const greenController = new BezierConnectionController(
  "green",
  2,
  90,
  15,
  4,
  false,
  true,
);

setInterval(() => {
  if (i % 2) {
    canvas.updateConnectionController("con-1", redController);
  } else {
    canvas.updateConnectionController("con-1", greenController);
  }

  i++;
}, 1000);
