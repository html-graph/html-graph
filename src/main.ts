import "./main.css";
import { Canvas } from "../lib/main";

const canvasElement = document.createElement("div");
document.body.prepend(canvasElement);

const canvas = new Canvas(canvasElement, {
  scale: { enabled: true },
  shift: { enabled: true },
  nodes: { draggable: true },
  background: { type: "dots" },
});

function createNodeElement(
  name: string,
): [HTMLElement, HTMLElement, HTMLElement] {
  const node = document.createElement("div");
  node.classList.add("node");

  const frontPort = document.createElement("div");
  node.appendChild(frontPort);

  const text = document.createElement("div");
  text.innerText = name;
  node.appendChild(text);

  const backPort = document.createElement("div");
  node.appendChild(backPort);

  return [frontPort, node, backPort];
}

const [port11, node1, port12] = createNodeElement("Node 1");
const [port21, node2, port22] = createNodeElement("Node 2");
const [port31, node3, port32] = createNodeElement("Node 3");
const [port41, node4, port42] = createNodeElement("Node 4");

canvas
  .addNode({ id: "node-1", element: node1, x: 200, y: 400 })
  .markPort({ id: "port-1-1", element: port11, nodeId: "node-1" })
  .markPort({ id: "port-1-2", element: port12, nodeId: "node-1" })
  .addNode({ id: "node-2", element: node2, x: 600, y: 500 })
  .markPort({ id: "port-2-1", element: port21, nodeId: "node-2" })
  .markPort({ id: "port-2-2", element: port22, nodeId: "node-2" })
  .addNode({ id: "node-3", element: node3, x: 200, y: 800 })
  .markPort({ id: "port-3-1", element: port31, nodeId: "node-3" })
  .markPort({ id: "port-3-2", element: port32, nodeId: "node-3" })
  .addNode({ id: "node-4", element: node4, x: 1000, y: 600 })
  .markPort({ id: "port-4-1", element: port41, nodeId: "node-4" })
  .markPort({ id: "port-4-2", element: port42, nodeId: "node-4" })
  .connectPorts({ id: "con-1", from: "port-1-2", to: "port-2-1" })
  .connectPorts({ id: "con-2", from: "port-3-2", to: "port-2-1" })
  .connectPorts({ id: "con-3", from: "port-2-2", to: "port-4-1" });
