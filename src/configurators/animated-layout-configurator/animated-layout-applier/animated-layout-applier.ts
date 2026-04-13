import { Canvas } from "@/canvas";
import { AnimatedLayoutAlgorithm } from "@/layouts";
import { AnimatedLayoutApplierParams } from "./animated-layout-applier-params";

export class AnimatedLayoutApplier {
  public constructor(
    private readonly canvas: Canvas,
    private readonly layoutAlgorithm: AnimatedLayoutAlgorithm,
    private readonly params: AnimatedLayoutApplierParams,
  ) {}

  public apply(dt: number): void {
    const coords = this.layoutAlgorithm.calculateNextCoordinates({
      graph: this.canvas.graph,
      viewport: this.canvas.viewport,
      dt,
    });

    this.params.onBeforeApplied();

    coords.forEach((point, nodeId) => {
      if (!this.params.staticNodeResolver(nodeId)) {
        this.canvas.updateNode(nodeId, point);
      }
    });

    this.params.onAfterApplied();
  }
}
