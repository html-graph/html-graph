import {
  BezierEdgeShape,
  Canvas,
  CanvasBuilder,
  MedianEdgeShape,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);
const canvas: Canvas = builder
  .setDefaults({
    edges: {
      shape: (edgeId) => {
        const baseShape = new BezierEdgeShape({ hasTargetArrow: true });

        const median = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle",
        );

        median.setAttribute("cx", "0");
        median.setAttribute("cy", "0");
        median.setAttribute("r", "7");
        median.setAttribute("fill", "white");
        median.setAttribute("stroke", "red");
        median.style.setProperty("pointer-events", "auto");
        median.style.setProperty("cursor", "pointer");

        const medianShape = new MedianEdgeShape(baseShape, median);

        let cancel = false;

        medianShape.median.addEventListener("mousedown", () => {
          cancel = false;
        });

        medianShape.median.addEventListener("mousemove", () => {
          cancel = true;
        });

        medianShape.median.addEventListener("mouseup", (event) => {
          if (!cancel && event.button === 0) {
            canvas.removeEdge(edgeId);
          }
        });

        return medianShape;
      },
    },
  })
  .enableUserTransformableViewport()
  .enableUserDraggableNodes()
  .enableBackground()
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
