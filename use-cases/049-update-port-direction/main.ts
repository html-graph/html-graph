import { HtmlGraphBuilder } from "@html-graph/html-graph";

const canvas = new HtmlGraphBuilder()
  .setOptions({
    edges: {
      shape: {
        hasTargetArrow: true,
      },
    },
  })
  .setUserDraggableNodes()
  .setUserTransformableCanvas()
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
    ports: [{ id: "port-1", element: port1 }],
  })
  .addNode({
    id: "node-2",
    element: node2,
    x: 600,
    y: 500,
    ports: [{ id: "port-2", element: port2 }],
  })
  .addEdge({ from: "port-1", to: "port-2" });

let i = 1;

setInterval(() => {
  canvas.updatePort("port-2", { direction: (Math.PI * i) / 12 });

  i++;
}, 1000);
