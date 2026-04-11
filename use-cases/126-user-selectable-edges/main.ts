import {
  BezierEdgeShape,
  Canvas,
  CanvasBuilder,
  InteractiveEdgeShape,
  StructuredEdgeShape,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);
const canvas: Canvas = builder
  .setDefaults({
    nodes: {
      priority: 1,
    },
    edges: {
      shape: () => {
        const baseShape = new BezierEdgeShape();

        return new InteractiveEdgeShape(baseShape, { distance: 20 });
      },
      priority: 0,
    },
  })
  .enableBackground()
  .enableUserTransformableViewport()
  .enableUserSelectableEdges({
    onEdgeSelected: (selectedEdgeId) => {
      canvas.graph.getAllEdgeIds().forEach((edgeId) => {
        const { shape } = canvas.graph.getEdge(edgeId);
        const width = edgeId === selectedEdgeId ? 2 : 1;

        (shape as StructuredEdgeShape).line.setAttribute(
          "stroke-width",
          `${width}`,
        );
      });
    },
  })
  .enableUserSelectableCanvas({
    onCanvasSelected: () => {
      canvas.graph.getAllEdgeIds().forEach((edgeId) => {
        const { shape } = canvas.graph.getEdge(edgeId);

        (shape as StructuredEdgeShape).line.setAttribute("stroke-width", "1");
      });
    },
  })
  .enableUserDraggableNodes({
    moveEdgesOnTop: false,
  })
  .build();

canvas
  .addNode(
    createInOutNode({
      name: "Node 1",
      x: 200,
      y: 400,
      frontPort: { id: "node-1-in" },
      backPort: { id: "node-1-out" },
    }),
  )
  .addNode(
    createInOutNode({
      name: "Node 2",
      x: 500,
      y: 500,
      frontPort: { id: "node-2-in" },
      backPort: { id: "node-2-out" },
    }),
  )
  .addNode(
    createInOutNode({
      name: "Node 3",
      x: 800,
      y: 600,
      frontPort: { id: "node-3-in" },
      backPort: { id: "node-3-out" },
    }),
  )
  .addEdge({
    from: "node-1-out",
    to: "node-2-in",
  })
  .addEdge({
    from: "node-2-out",
    to: "node-3-in",
  });
