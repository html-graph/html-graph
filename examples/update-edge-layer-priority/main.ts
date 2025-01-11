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
  .setUserDraggableNodes()
  .setUserTransformableCanvas()
  .build();

const node1 = document.createElement("div");
node1.classList.add("node");
node1.innerText = "1";

const node2 = document.createElement("div");
node2.classList.add("node");
node2.innerText = "2";

const node3 = document.createElement("div");
node3.classList.add("node");
node3.innerText = "3";

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
    element: node1,
    x: 200,
    y: 300,
    priority: 1,
    ports: [["port-1", port1]],
  })
  .addNode({
    element: node2,
    x: 600,
    y: 500,
    priority: 1,
    ports: [["port-2", port2]],
  })
  .addNode({
    element: node3,
    x: 400,
    y: 400,
    priority: 1,
  })
  .addEdge({ id: "con-1", from: "port-1", to: "port-2" });

let i = 0;

setInterval(() => {
  if (i % 2) {
    canvas.updateEdge("con-1", { priority: 2 });
  } else {
    canvas.updateEdge("con-1", { priority: 0 });
  }

  i++;
}, 1000);
