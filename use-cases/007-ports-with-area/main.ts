import { HtmlGraphBuilder, Point } from "@html-graph/html-graph";

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

const text1 = document.createElement("div");
text1.classList.add("text");
node1.appendChild(text1);

const node2 = document.createElement("div");
node2.classList.add("node");

const text2 = document.createElement("div");
text2.classList.add("text");
node2.appendChild(text2);

const port1 = document.createElement("div");
port1.classList.add("port");
port1.innerText = "Port 1";
port1.style.right = "0";

const port2 = document.createElement("div");
port2.classList.add("port");
port2.innerText = "Port 2";
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
    ports: [
      {
        id: "port-1",
        element: port1,
        centerFn: (w, h): Point => ({ x: w, y: h / 2 }),
      },
    ],
  })
  .addNode({
    id: "node-2",
    element: node2,
    x: 600,
    y: 500,
    ports: [
      {
        id: "port-2",
        element: port2,
        centerFn: (_w, h): Point => ({ x: 0, y: h / 2 }),
      },
    ],
  })
  .addEdge({ from: "port-1", to: "port-2" });
