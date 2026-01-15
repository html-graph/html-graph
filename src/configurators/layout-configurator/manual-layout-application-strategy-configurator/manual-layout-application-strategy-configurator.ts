import { Canvas } from "@/canvas";
import { EventHandler } from "@/event-subject";
import { LayoutAlgorithm } from "@/layouts";

export class ManualLayoutApplicationStrategyConfigurator {
  private constructor(
    private readonly canvas: Canvas,
    private readonly layoutAlgorithm: LayoutAlgorithm,
    private readonly trigger: EventHandler<void>,
  ) {
    this.trigger.subscribe(() => {
      this.applyLayout();
    });
  }

  public static configure(
    canvas: Canvas,
    layoutAlgorithm: LayoutAlgorithm,
    trigger: EventHandler<void>,
  ): void {
    new ManualLayoutApplicationStrategyConfigurator(
      canvas,
      layoutAlgorithm,
      trigger,
    );
  }

  private applyLayout(): void {
    const coords = this.layoutAlgorithm.calculateCoordinates({
      graph: this.canvas.graph,
      viewport: this.canvas.viewport,
    });

    coords.forEach((point, nodeId) => {
      this.canvas.updateNode(nodeId, point);
    });
  }
}
