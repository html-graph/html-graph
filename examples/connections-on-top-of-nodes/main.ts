import { CanvasBuilder } from "../../lib/main";

const canvas = new CanvasBuilder()
  .options({
    background: { type: "dots" },
    layers: {
      mode: "connections-on-top",
    },
  })
  .draggableNodes()
  .transformableCanvas()
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
  .addNode({ id: "node-1", element: node1, x: 200, y: 300 })
  .markPort({ nodeId: "node-1", element: port1, id: "port-1" })
  .addNode({ id: "node-2", element: node2, x: 600, y: 500 })
  .markPort({ nodeId: "node-2", element: port2, id: "port-2" })
  .addConnection({ id: "con-1", from: "port-1", to: "port-2" });
