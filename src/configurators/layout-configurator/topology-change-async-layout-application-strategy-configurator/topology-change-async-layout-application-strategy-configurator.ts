import { LayoutApplier } from "../../shared";
import { Graph } from "@/graph";

export class TopologyChangeAsyncLayoutApplicationStrategyConfigurator {
  private applyScheduled = false;

  private apply = (): void => {
    this.applyScheduled = false;

    this.applier.apply();
  };

  private constructor(
    private readonly graph: Graph,
    private readonly applier: LayoutApplier,
    private readonly defererFn: (apply: () => void) => void,
  ) {
    this.graph.onAfterNodeAdded.subscribe(() => {
      this.scheduleApply();
    });

    this.graph.onBeforeNodeRemoved.subscribe(() => {
      this.scheduleApply();
    });

    this.graph.onAfterEdgeAdded.subscribe(() => {
      this.scheduleApply();
    });

    this.graph.onBeforeEdgeRemoved.subscribe(() => {
      this.scheduleApply();
    });
  }

  public static configure(
    graph: Graph,
    applier: LayoutApplier,
    defererFn: (apply: () => void) => void,
  ): void {
    new TopologyChangeAsyncLayoutApplicationStrategyConfigurator(
      graph,
      applier,
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
