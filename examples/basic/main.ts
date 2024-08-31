import { GraphFlowCanvas } from "../../lib/main";

const canvasElement = document.getElementById("canvas")!;

const canvas = new GraphFlowCanvas(canvasElement, {
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
  .addNode({
    element: node1,
    x: 200,
    y: 400,
    ports: { "port-1-1": port11, "port-1-2": port12 },
  })
  .addNode({
    element: node2,
    x: 600,
    y: 500,
    ports: {
      "port-2-1": port21,
      "port-2-2": port22,
    },
  })
  .addNode({
    element: node3,
    x: 200,
    y: 800,
    ports: {
      "port-3-1": port31,
      "port-3-2": port32,
    },
  })
  .addNode({
    element: node4,
    x: 1000,
    y: 600,
    ports: {
      "port-4-1": port41,
      "port-4-2": port42,
    },
  })
  .addConnection({ from: "port-1-2", to: "port-2-1" })
  .addConnection({ from: "port-3-2", to: "port-2-1" })
  .addConnection({ from: "port-2-2", to: "port-4-1" });
