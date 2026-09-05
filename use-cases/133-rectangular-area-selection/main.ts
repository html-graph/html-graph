import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  CanvasBuilder,
  Identifier,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const selectedNodeIds = new Set<Identifier>();

const intersects = (nodeRect: DOMRect, selectionRect: DOMRect): boolean => {
  const isNodeRightOfSelection = nodeRect.right < selectionRect.left;
  const isNodeLeftOfSelection = nodeRect.left > selectionRect.right;
  const isNodeBottomOfSelection = nodeRect.bottom < selectionRect.top;
  const isNodeTopOfSelection = nodeRect.top > selectionRect.bottom;

  return !(
    isNodeRightOfSelection ||
    isNodeLeftOfSelection ||
    isNodeTopOfSelection ||
    isNodeBottomOfSelection
  );
};

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);
const canvas: Canvas = builder
  .enableUserTransformableViewport()
  .enableUserDraggableNodes()
  .enableRectangularSelection({
    onSelectionFinished: (selectionRect: DOMRect): void => {
      selectedNodeIds.clear();

      canvas.graph.getAllNodeIds().forEach((nodeId) => {
        const { element } = canvas.graph.getNode(nodeId);
        const nodeRect = element.getBoundingClientRect();

        if (intersects(nodeRect, selectionRect)) {
          selectedNodeIds.add(nodeId);
        }
      });
    },
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
  .addEdge(addEdgeRequest);
