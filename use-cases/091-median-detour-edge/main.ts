import {
  Canvas,
  CanvasBuilder,
  MedianEdgeShape,
  StraightEdgeShape,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const createMedian = (): SVGElement => {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

  group.style.setProperty("pointer-events", "auto");
  group.style.setProperty("cursor", "pointer");
  group.classList.add("remove-button");

  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle",
  );

  circle.setAttribute("cx", "0");
  circle.setAttribute("cy", "0");
  circle.setAttribute("r", "7");
  circle.setAttribute("fill", "var(--remove-background)");
  circle.setAttribute("stroke", "var(--remove-color)");

  const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path1.setAttribute("d", "M -3 -3 L 3 3");
  path1.setAttribute("stroke", "var(--remove-color)");

  const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path2.setAttribute("d", "M 3 -3 L -3 3");
  path2.setAttribute("stroke", "var(--remove-color)");

  group.appendChild(circle);
  group.appendChild(path1);
  group.appendChild(path2);

  return group;
};

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);
const canvas: Canvas = builder
  .setDefaults({
    edges: {
      shape: () => {
        const baseShape = new StraightEdgeShape({
          hasTargetArrow: true,
          detourDirection: Math.PI / 12,
        });

        const median = createMedian();
        const medianShape = new MedianEdgeShape(baseShape, median);

        return medianShape;
      },
    },
  })
  .enableUserTransformableViewport()
  .enableUserDraggableNodes()
  .enableBackground()
  .enableUserConnectablePorts()
  .build();

canvas
  .addNode(
    createInOutNode({
      name: "Node 4",
      x: 400,
      y: 500,
      frontPortId: "node-4-in",
      backPortId: "node-4-out",
    }),
  )
  .addEdge({ from: "node-4-out", to: "node-4-in" });
