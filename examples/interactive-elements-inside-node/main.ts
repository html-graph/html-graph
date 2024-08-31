import { GraphFlowCanvas } from "../../lib/main";

const canvasElement = document.getElementById("canvas")!;

const canvas = new GraphFlowCanvas(canvasElement, {
  scale: { enabled: true },
  shift: { enabled: true },
  nodes: { draggable: true },
  background: { type: "dots" },
});

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
    x: Math.random() * 300 + 100,
    y: Math.random() * 300 + 100,
  });
};

createNode();
