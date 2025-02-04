import { HtmlGraphBuilder } from "@html-graph/html-graph";

const canvas = new HtmlGraphBuilder()
  .setOptions({
    edges: {
      shape: {
        hasTargetArrow: true,
      },
    },
  })
  .setUserTransformableCanvas()
  .build();

function createNode(name: string): HTMLElement {
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

const canvasElement = document.getElementById("canvas")!;

canvas.attach(canvasElement);

map.forEach((value, key) => {
  canvas.addNode({ id: key, element: value[0], x: value[1], y: value[2] });

  value[0].addEventListener("focus", () => {
    const node = canvas.model.getNode(key)!;
    const rect = canvasElement.getBoundingClientRect();
    const sv = canvas.transformation.getViewportMatrix().scale;

    const targetX = node.x - (sv * rect.width) / 2;
    const targetY = node.y - (sv * rect.height) / 2;

    canvas.patchViewportMatrix({ dx: targetX, dy: targetY });
  });
});
