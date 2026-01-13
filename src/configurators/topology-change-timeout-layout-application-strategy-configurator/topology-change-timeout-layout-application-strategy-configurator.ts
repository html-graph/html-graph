import { Canvas } from "@/canvas";
import { LayoutAlgorithm } from "@/layouts";

export class TopologyChangeTimeoutLayoutApplicationStrategyConfigurator {
  private applyScheduled = false;

  private constructor(
    private readonly canvas: Canvas,
    private readonly layoutAlgorithm: LayoutAlgorithm,
  ) {
    this.canvas.graph.onAfterNodeAdded.subscribe(() => {
      this.scheduleApply();
    });

    this.canvas.graph.onBeforeNodeRemoved.subscribe(() => {
      this.scheduleApply();
    });

    this.canvas.graph.onAfterEdgeAdded.subscribe(() => {
      this.scheduleApply();
    });

    this.canvas.graph.onBeforeEdgeRemoved.subscribe(() => {
      this.scheduleApply();
    });
  }

  public static configure(
    canvas: Canvas,
    layoutAlgorithm: LayoutAlgorithm,
  ): void {
    new TopologyChangeTimeoutLayoutApplicationStrategyConfigurator(
      canvas,
      layoutAlgorithm,
    );
  }

  private scheduleApply(): void {
    if (this.applyScheduled) {
      return;
    }

    this.applyScheduled = true;

    setTimeout(() => {
      this.applyScheduled = false;
      this.applyLayout();
    });
  }

  private applyLayout(): void {
    const coords = this.layoutAlgorithm.calculateCoordinates(
      this.canvas.graph,
      this.canvas.viewport,
    );

    coords.forEach((point, nodeId) => {
      this.canvas.updateNode(nodeId, point);
    });
  }
}
