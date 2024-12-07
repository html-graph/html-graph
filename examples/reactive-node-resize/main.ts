import { CanvasBuilder } from "@html-graph/html-graph";

const canvas = new CanvasBuilder()
  .setOptions({
    background: { type: "dots" },
    connections: { hasTargetArrow: true },
  })
  .setDraggableNodes()
  .setTransformableCanvas()
  .build();

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

const canvasElement = document.getElementById("canvas")!;

canvas
  .attach(canvasElement)
  .addNode({ element: node1, x: 200, y: 300, ports: { "port-1": port1 } })
  .addNode({ element: node2, x: 600, y: 500, ports: { "port-2": port2 } })
  .addConnection({ from: "port-1", to: "port-2" });

let i = 0;

setInterval(() => {
  text1.innerText = i % 2 ? "1" : "111111111111";
  text2.innerText = i % 2 ? "222222222222" : "2";
  i++;
}, 1000);
