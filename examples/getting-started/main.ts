import { GraphFlowCanvas } from "../../lib/main";

const canvasElement = document.getElementById("canvas")!;

const canvas = new GraphFlowCanvas(canvasElement);

const node1 = document.createElement("div");
node1.classList.add("node");
node1.innerText = "1";

const node2 = document.createElement("div");
node2.classList.add("node");
node2.innerText = "2";

const port1 = document.createElement("div");
port1.classList.add("port");
port1.style.marginLeft = "auto";

const port2 = document.createElement("div");
port2.classList.add("port");
port2.style.marginRight = "auto";

node1.appendChild(port1);
node2.appendChild(port2);

canvas
  .addNode({ id: "node-1", element: node1, x: 200, y: 500 })
  .markPort({ id: "port-1", element: port1, nodeId: "node-1" })
  .addNode({ id: "node-2", element: node2, x: 600, y: 600 })
  .markPort({ id: "port-2", element: port2, nodeId: "node-2" })
  .addConnection({ from: "port-1", to: "port-2" });
