import { GraphFlowCanvas } from "../../lib/main";

const canvasElement = document.getElementById("canvas")!;

const canvas = new GraphFlowCanvas(canvasElement, {
  scale: { enabled: true },
  shift: { enabled: true },
  nodes: { draggable: true },
  background: { type: "dots" },
});

const node1 = document.createElement("div");
node1.classList.add("node");

const text1 = document.createElement("div");
text1.classList.add("text");
text1.innerText = "1";
node1.appendChild(text1);

const node2 = document.createElement("div");
node2.classList.add("node");

const text2 = document.createElement("div");
text2.classList.add("text");
text2.innerText = "2";
node2.appendChild(text2);

const port1 = document.createElement("div");
port1.classList.add("port");
port1.style.right = "0";

const port2 = document.createElement("div");
port2.classList.add("port");
port2.style.left = "0";

node1.appendChild(port1);
node2.appendChild(port2);

canvas
  .addNode({ id: "node-1", element: node1, x: 200, y: 300 })
  .markPort({ id: "port-1", element: port1, nodeId: "node-1" })
  .addNode({ id: "node-2", element: node2, x: 600, y: 500 })
  .markPort({ id: "port-2", element: port2, nodeId: "node-2" })
  .addConnection({ from: "port-1", to: "port-2" });

let i = 0;

setInterval(() => {
  text1.innerText = i % 2 ? "1" : "111111111111";
  text2.innerText = i % 2 ? "2222222222" : "2";
  i++;
}, 1000);
