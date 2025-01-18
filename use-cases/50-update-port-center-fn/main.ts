import { CenterFn, HtmlGraphBuilder } from "@html-graph/html-graph";

const canvas = new HtmlGraphBuilder()
  .setOptions({
    background: {
      type: "dots",
    },
    edges: {
      shape: {
        hasTargetArrow: true,
      },
      priority: 1,
    },
    nodes: {
      priority: 0,
    },
  })
  .setUserDraggableNodes({
    grabPriorityStrategy: "freeze",
  })
  .setUserTransformableCanvas()
  .build();

const node1 = document.createElement("div");
node1.classList.add("node");

const node2 = document.createElement("div");
node2.classList.add("node");

const port1 = document.createElement("div");
port1.classList.add("port");

const port2 = document.createElement("div");
port2.classList.add("port");

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

const topLeftCenterFn: CenterFn = () => ({ x: 0, y: 0 });
const bottomRightCenterFn: CenterFn = (w, h) => ({ x: w, y: h });

let i = 0;

setInterval(() => {
  if (i % 2) {
    canvas.updatePort("port-2", { centerFn: topLeftCenterFn });
  } else {
    canvas.updatePort("port-2", { centerFn: bottomRightCenterFn });
  }

  i++;
}, 1000);
