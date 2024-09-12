import { Canvas } from "../../lib/main";

const canvasElement = document.getElementById("canvas")!;

const canvas = new Canvas(canvasElement, {
  scale: { enabled: true },
  shift: { enabled: true },
  nodes: { draggable: true },
  background: { type: "dots" },
  connections: { type: "line", hasSourceArrow: true },
});

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
port2.style.right = "0";

node1.appendChild(port1);
node2.appendChild(port2);

const ang1 = Math.PI / 4;
const ang2 = (Math.PI / 4) * 5;

canvas
  .addNode({ id: "node-1", element: node1, x: 600, y: 400 })
  .markPort({
    nodeId: "node-1",
    element: port1,
    id: "port-1",
    dir: ang1,
  })
  .addNode({ id: "node-2", element: node2, x: 400, y: 600 })
  .markPort({
    nodeId: "node-2",
    element: port2,
    id: "port-2",
    dir: ang2,
  })
  .addConnection({ id: "con-1", from: "port-1", to: "port-2" });
