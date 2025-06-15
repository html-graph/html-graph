import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  CanvasBuilder,
  PatchMatrixRequest,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);
const canvas: Canvas = builder.build();

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
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addEdge(addEdgeRequest);

class ViewportStore {
  private readonly scaleVelocity = 1.2;

  public constructor(
    private readonly element: HTMLElement,
    private readonly canvas: Canvas,
  ) {
    this.element.addEventListener("wheel", (event) => {
      const { left, top } = this.element.getBoundingClientRect();
      const centerX = event.clientX - left;
      const centerY = event.clientY - top;

      const velocity =
        event.deltaY > 0 ? this.scaleVelocity : 1 / this.scaleVelocity;
      this.scaleViewport(velocity, centerX, centerY);
    });
  }

  private scaleViewport(s2: number, cx: number, cy: number): void {
    const matrixViewport = this.canvas.viewport.getViewportMatrix();

    const scale = matrixViewport.scale * s2;
    const x = matrixViewport.scale * (1 - s2) * cx + matrixViewport.x;
    const y = matrixViewport.scale * (1 - s2) * cy + matrixViewport.y;

    const patchMatrixRequest: PatchMatrixRequest = {
      scale,
      x: x,
      y: y,
    };

    this.canvas.patchViewportMatrix(patchMatrixRequest);
  }
}

new ViewportStore(canvasElement, canvas);
