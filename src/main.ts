import "./main.css";
import { Canvas } from "../lib/main";

const canvasElement = document.createElement('div');
document.body.prepend(canvasElement);

const canvas = new Canvas(canvasElement, { 
    scale: { enabled: true },
    shift: { enabled: true },
    nodes: { draggable: true }
});

function createNodeElement(name: string): [HTMLElement, HTMLElement, HTMLElement] {
    const node =  document.createElement('div');
    const text =  document.createElement('div');

    node.classList.add("node");
    node.appendChild(text);

    text.innerText = name;

    const frontPort = document.createElement('div');
    node.prepend(frontPort);

    const backPort = document.createElement('div');
    node.appendChild(backPort);

    return [node, frontPort, backPort];
}

const node1 = createNodeElement("Node 1");
const node2 = createNodeElement("Node 2");
const node3 = createNodeElement("Node 3");
const node4 = createNodeElement("Node 4");

canvas
    .addNode({ id: "node-1", element: node1[0], x: 200, y: 400 })
    .markPort({ id: "port-1-1", element: node1[1], nodeId: "node-1" })
    .markPort({ id: "port-1-2", element: node1[2], nodeId: "node-1" })
    .addNode({ id: "node-2", element: node2[0], x: 600, y: 500 })
    .markPort({ id: "port-2-1", element: node2[1], nodeId: "node-2" })
    .markPort({ id: "port-2-2", element: node2[2], nodeId: "node-2" })
    .addNode({ id: "node-3", element: node3[0], x: 200, y: 800 })
    .markPort({ id: "port-3-1", element: node3[1], nodeId: "node-3" })
    .markPort({ id: "port-3-2", element: node3[2], nodeId: "node-3" })
    .addNode({ id: "node-4", element: node4[0], x: 1000, y: 600 })
    .markPort({ id: "port-4-1", element: node4[1], nodeId: "node-4" })
    .markPort({ id: "port-4-2", element: node4[2], nodeId: "node-4" })
    .connectPorts({ id: "con-1", from: "port-1-2", to: "port-2-1" })
    .connectPorts({ id: "con-2", from: "port-3-2", to: "port-2-1" })
    .connectPorts({ id: "con-3", from: "port-2-2", to: "port-4-1" });
