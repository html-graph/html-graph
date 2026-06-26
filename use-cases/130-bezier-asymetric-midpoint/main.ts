import {
  BezierEdgeShape,
  Canvas,
  CanvasBuilder,
  MidpointEdgeShape,
} from "@html-graph/html-graph";
import { createMidpoint } from "../shared/create-midpoint";

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const canvas: Canvas = new CanvasBuilder(canvasElement)
  .setDefaults({
    edges: {
      priority: 0,
      shape: () => {
        const baseShape = new BezierEdgeShape();

        const midpoint = createMidpoint();

        return new MidpointEdgeShape(baseShape, midpoint);
      },
    },
    nodes: {
      priority: 1,
    },
  })
  .enableUserTransformableViewport()
  .enableUserDraggableNodes({ moveEdgesOnTop: false })
  .enableBackground()
  .build();

const node1Element = document.createElement("div");
node1Element.classList.add("node");

const node2Element = document.createElement("div");
node2Element.classList.add("node");

canvas
  .addNode({
    id: "node-1",
    element: node1Element,
    x: 200,
    y: 400,
    ports: [{ id: "port-1", element: node1Element }],
  })
  .addNode({
    id: "node-2",
    element: node2Element,
    x: 500,
    y: 500,
    ports: [{ id: "port-2", element: node2Element, direction: Math.PI / 2 }],
  })
  .addEdge({
    from: "port-1",
    to: "port-2",
  });
