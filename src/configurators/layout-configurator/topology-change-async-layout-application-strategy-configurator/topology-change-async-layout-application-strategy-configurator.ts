import { Canvas } from "@/canvas";
import { LayoutAlgorithm } from "@/layouts";

export class TopologyChangeAsyncLayoutApplicationStrategyConfigurator {
  private applyScheduled = false;

  private apply = (): void => {
    this.applyScheduled = false;

    const coords = this.layoutAlgorithm.calculateCoordinates(
      this.canvas.graph,
      this.canvas.viewport,
    );

    coords.forEach((point, nodeId) => {
      this.canvas.updateNode(nodeId, point);
    });
  };

  private constructor(
    private readonly canvas: Canvas,
    private readonly layoutAlgorithm: LayoutAlgorithm,
    private readonly defererFn: (apply: () => void) => void,
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
    defererFn: (apply: () => void) => void,
  ): void {
    new TopologyChangeAsyncLayoutApplicationStrategyConfigurator(
      canvas,
      layoutAlgorithm,
      defererFn,
    );
  }

  private scheduleApply(): void {
    if (this.applyScheduled) {
      return;
    }

    this.applyScheduled = true;

    this.defererFn(this.apply);
  }
}
