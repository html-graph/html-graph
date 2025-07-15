import {
  BezierEdgeShape,
  Canvas,
  CanvasBuilder,
  MidpointEdgeShape,
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
      shape: (edgeId) => {
        const baseShape = new BezierEdgeShape({
          hasTargetArrow: true,
          smallCycleRadius: 15,
          cycleRadius: 30,
        });

        const median = createMedian();
        const midpointShape = new MidpointEdgeShape(baseShape, median);

        midpointShape.midpointElement.addEventListener("mouseup", (event) => {
          if (event.button === 0) {
            canvas.removeEdge(edgeId);
          }
        });

        return midpointShape;
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
      name: "Node 1",
      x: 200,
      y: 100,
      frontPortId: "node-1-in",
      backPortId: "node-1-out",
    }),
  )
  .addNode(
    createInOutNode({
      name: "Node 2",
      x: 500,
      y: 200,
      frontPortId: "node-2-in",
      backPortId: "node-2-out",
    }),
  )
  .addNode(
    createInOutNode({
      name: "Node 3",
      x: 200,
      y: 350,
      frontPortId: "node-3-in",
      backPortId: "node-3-out",
    }),
  )
  .addNode(
    createInOutNode({
      name: "Node 4",
      x: 400,
      y: 500,
      frontPortId: "node-4-in",
      backPortId: "node-4-out",
    }),
  )
  .addNode(
    createInOutNode({
      name: "Node 5",
      x: 600,
      y: 500,
      frontPortId: "node-5-in",
      backPortId: "node-5-out",
    }),
  )
  .addEdge({ from: "node-1-out", to: "node-2-in" })
  .addEdge({ from: "node-2-out", to: "node-3-in" })
  .addEdge({ from: "node-4-out", to: "node-4-in" })
  .addEdge({ from: "node-5-out", to: "node-5-out" });
