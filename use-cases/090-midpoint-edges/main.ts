import {
  BezierEdgeShape,
  Canvas,
  CanvasBuilder,
  MidpointEdgeShape,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";
import { createMidpoint } from "../shared/create-midpoint";

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

        const midpoint = createMidpoint();
        const midpointShape = new MidpointEdgeShape(baseShape, midpoint);

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
      frontPort: { id: "node-1-in" },
      backPort: { id: "node-1-out" },
    }),
  )
  .addNode(
    createInOutNode({
      name: "Node 2",
      x: 500,
      y: 200,
      frontPort: { id: "node-2-in" },
      backPort: { id: "node-2-out" },
    }),
  )
  .addNode(
    createInOutNode({
      name: "Node 3",
      x: 200,
      y: 350,
      frontPort: { id: "node-3-in" },
      backPort: { id: "node-3-out" },
    }),
  )
  .addNode(
    createInOutNode({
      name: "Node 4",
      x: 400,
      y: 500,
      frontPort: { id: "node-4-in" },
      backPort: { id: "node-4-out" },
    }),
  )
  .addNode(
    createInOutNode({
      name: "Node 5",
      x: 600,
      y: 500,
      frontPort: { id: "node-5-in" },
      backPort: { id: "node-5-out" },
    }),
  )
  .addEdge({ from: "node-1-out", to: "node-2-in" })
  .addEdge({ from: "node-2-out", to: "node-3-in" })
  .addEdge({ from: "node-4-out", to: "node-4-in" })
  .addEdge({ from: "node-5-out", to: "node-5-out" });
