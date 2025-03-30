import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  CanvasBuilder,
  PatchMatrixRequest,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const builder: CanvasBuilder = new CanvasBuilder();
const canvas: Canvas = builder.build();
const canvasElement: HTMLElement = document.getElementById("canvas")!;

const addNode1Request: AddNodeRequest = createInOutNode({
  name: "Node 1",
  x: 200,
  y: 400,
  frontPortId: "node-1-in",
  backPortId: "node-1-out",
});

const addNode2Request: AddNodeRequest = createInOutNode({
  name: "Node 2",
  x: 500,
  y: 500,
  frontPortId: "node-2-in",
  backPortId: "node-2-out",
});

const addEdgeRequest: AddEdgeRequest = {
  from: "node-1-out",
  to: "node-2-in",
};

canvas
  .attach(canvasElement)
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addEdge(addEdgeRequest);

class ViewportStore {
  private isGrabbed = false;

  public constructor(
    private readonly element: HTMLElement,
    private readonly canvas: Canvas,
  ) {
    this.element.addEventListener("mousedown", () => {
      this.element.style.cursor = "grab";
      this.isGrabbed = true;
    });

    this.element.addEventListener("mouseup", () => {
      this.element.style.removeProperty("cursor");
      this.isGrabbed = false;
    });

    this.element.addEventListener("mousemove", (event) => {
      if (this.isGrabbed) {
        const matrixViewport = this.canvas.viewport.getViewportMatrix();

        const patchMatrixRequest: PatchMatrixRequest = {
          x: matrixViewport.scale * -event.movementX + matrixViewport.x,
          y: matrixViewport.scale * -event.movementY + matrixViewport.y,
        };

        this.canvas.patchViewportMatrix(patchMatrixRequest);
      }
    });
  }
}

new ViewportStore(canvasElement, canvas);
