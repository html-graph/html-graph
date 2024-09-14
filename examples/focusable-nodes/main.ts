import { Canvas } from "../../lib/main";

const canvasElement = document.getElementById("canvas")!;

const canvas = new Canvas(canvasElement, {
  scale: { enabled: true },
  shift: { enabled: true },
  nodes: { draggable: true },
  background: { type: "dots" },
});

function createNode(name: string) {
  const node = document.createElement("button");
  node.classList.add("node");
  node.innerText = name;

  return node;
}

const map: Map<string, [HTMLElement, number, number]> = new Map([
  ["node-1", [createNode("1"), 200, 500]],
  ["node-2", [createNode("2"), 700, 500]],
  ["node-3", [createNode("3"), 1200, 500]],
  ["node-4", [createNode("4"), 1700, 500]],
]);

map.forEach((value, key) => {
  canvas.addNode({ id: key, element: value[0], x: value[1], y: value[2] });

  value[0].addEventListener("focus", () => {
    canvas.moveToNodes([key]);
  });
});
