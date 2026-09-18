import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  CanvasBuilder,
  InteractiveEdgeShape,
  OrthogonalEdgeShape,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const canvasElement: HTMLElement = document.getElementById("canvas")!;

const canvas: Canvas = new CanvasBuilder(canvasElement)
  .setDefaults({
    nodes: {
      priority: 1,
    },
    edges: {
      shape: () => {
        const baseShape = new OrthogonalEdgeShape({
          hasTargetArrow: true,
          // interactiveWidth: 10,
          // midpointElement: ...,
        });

        // baseShape.enableMidpoint();
        // baseShape.enableInteraction();
        // baseShape.enableEdit();

        return new InteractiveEdgeShape(baseShape, {
          distance: 10,
        });
      },
      priority: 0,
    },
  })
  .enableUserSelectableEdges({
    onEdgeSelected: (selectedEdgeId) => {
      canvas.graph.getAllEdgeIds().forEach((edgeId) => {
        const { shape } = canvas.graph.getEdge(edgeId);
        const width = edgeId === selectedEdgeId ? 2 : 1;

        (shape as OrthogonalEdgeShape).line.setAttribute(
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

        (shape as OrthogonalEdgeShape).line.setAttribute("stroke-width", "1");

        // shape.disableEdit();
      });
    },
  })
  .enableUserTransformableViewport()
  .enableUserDraggableNodes({
    moveEdgesOnTop: false,
  })
  .enableBackground()
  .build();

const addNode1Request: AddNodeRequest = createInOutNode({
  name: "Node 1",
  x: 200,
  y: 400,
  frontPort: { id: "node-1-in" },
  backPort: { id: "node-1-out" },
});

const addNode2Request: AddNodeRequest = createInOutNode({
  name: "Node 2",
  x: 500,
  y: 500,
  frontPort: { id: "node-2-in" },
  backPort: { id: "node-2-out" },
});

const addEdgeRequest: AddEdgeRequest = {
  from: "node-1-out",
  to: "node-2-in",
};

canvas
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addEdge(addEdgeRequest)
  .focus();
