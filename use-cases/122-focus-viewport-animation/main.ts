import { Canvas, CanvasBuilder } from "@html-graph/html-graph";

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);

const canvas: Canvas = builder
  .setDefaults({
    nodes: {
      priority: 1,
    },
    edges: {
      shape: {
        type: "direct",
        sourceOffset: 50,
        targetOffset: 50,
        hasTargetArrow: true,
      },
      priority: 0,
    },
    focus: {
      animationDuration: 200,
    },
  })
  .enableUserTransformableViewport()
  .enableBackground()
  .build();

const element = document.createElement("div");
element.classList.add("node");
element.innerText = `Node 1`;

canvas.addNode({
  id: "node-1",
  element,
  x: 0,
  y: 0,
  ports: [
    {
      id: "node-1",
      element,
    },
  ],
});

document.querySelector("[data-animate]")!.addEventListener("click", () => {
  canvas.focus(["node-1"]);
});
