import { Canvas } from "@/canvas";
import { LayoutAlgorithm } from "@/layouts";
import { LayoutApplierParams } from "./layout-applier-params";

export class LayoutApplier {
  public constructor(
    private readonly canvas: Canvas,
    private readonly layoutAlgorithm: LayoutAlgorithm,
    private readonly params: LayoutApplierParams,
  ) {}

  public apply(): void {
    const coords = this.layoutAlgorithm.calculateCoordinates({
      graph: this.canvas.graph,
      viewport: this.canvas.viewport,
    });

    coords.forEach((point, nodeId) => {
      if (!this.params.staticNodeResolver(nodeId)) {
        this.canvas.updateNode(nodeId, point);
      }
    });
  }
}
