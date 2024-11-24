import { CanvasBuilder } from "../../lib/main";

const canvasElement = document.getElementById("canvas")!;

const canvas = new CanvasBuilder()
  .options({
    background: { type: "dots" },
  })
  .draggable()
  .transformable()
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

let i = 0;

canvas
  .attach(canvasElement)
  .addNode({ id: "node-1", element: node1, x: 200, y: 300 })
  .markPort({ nodeId: "node-1", element: port1, id: "port-1" })
  .addNode({ id: "node-2", element: node2, x: 600, y: 500 })
  .markPort({ nodeId: "node-2", element: port2, id: "port-2" })
  .addConnection({ id: "con-1", from: "port-1", to: "port-2" });

setInterval(() => {
  port2.style.top = i % 2 ? "0" : "100%";
  canvas.updatePortConnections("port-2");

  i++;
}, 1000);
