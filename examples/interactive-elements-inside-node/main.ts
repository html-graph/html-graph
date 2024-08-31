import { GraphFlowCanvas } from "../../lib/main";

const canvasElement = document.getElementById("canvas")!;

const canvas = new GraphFlowCanvas(canvasElement, {
  scale: { enabled: true },
  shift: { enabled: true },
  nodes: { draggable: true },
  background: { type: "dots" },
});

let angle = 0;

const createNode = () => {
  const node = document.createElement("div");
  node.classList.add("node");

  const btn = document.createElement("button");
  btn.innerText = "Add Node";
  btn.addEventListener("click", () => {
    createNode();
  });

  node.appendChild(btn);

  canvas.addNode({
    element: node,
    x: Math.cos(angle) * (300 + 300 * Math.floor(angle / (2 * Math.PI))) + 400,
    y: Math.sin(angle) * (300 + 300 * Math.floor(angle / (2 * Math.PI))) + 400,
  });

  angle += Math.PI / 6;
};

createNode();
