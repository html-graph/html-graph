import { LayoutParams } from "./layout-params";
import { Canvas } from "@/canvas";
import { ManualLayoutApplicationStrategyConfigurator } from "./manual-layout-application-strategy-configurator";
import { TopologyChangeAsyncLayoutApplicationStrategyConfigurator } from "./topology-change-async-layout-application-strategy-configurator";
import { LayoutApplier } from "./layout-applier";

export class LayoutConfigurator {
  public static configure(canvas: Canvas, params: LayoutParams): void {
    const strategy = params.applyOn;

    const applier = new LayoutApplier(canvas, params.algorithm, {
      staticNodeResolver: params.staticNodeResolver,
      onBeforeApplied: params.onBeforeApplied,
      onAfterApplied: params.onAfterApplied,
    });

    switch (strategy.type) {
      case "trigger": {
        ManualLayoutApplicationStrategyConfigurator.configure(
          applier,
          strategy.trigger,
        );
        break;
      }

      case "topologyChangeSchedule": {
        TopologyChangeAsyncLayoutApplicationStrategyConfigurator.configure(
          canvas.graph,
          applier,
          strategy.schedule,
        );
        break;
      }
    }
  }
}
