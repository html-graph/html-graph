import { LayoutParams } from "./layout-params";
import { Canvas } from "@/canvas";
import { ManualLayoutApplicationStrategyConfigurator } from "./manual-layout-application-strategy-configurator";
import { TopologyChangeAsyncLayoutApplicationStrategyConfigurator } from "./topology-change-async-layout-application-strategy-configurator";
import { LayoutApplier } from "../shared";

export class LayoutConfigurator {
  public static configure(canvas: Canvas, params: LayoutParams): void {
    const strategy = params.applyOn;

    const applier = new LayoutApplier(canvas, params.algorithm, {
      staticNodeResolver: params.staticNodeResolver,
      onBeforeApplied: params.onBeforeApplied,
      onAfterApplied: params.onAfterApplied,
    });

    switch (strategy.type) {
      case "manual": {
        ManualLayoutApplicationStrategyConfigurator.configure(
          applier,
          strategy.trigger,
        );
        break;
      }

      case "topologyChangeMacrotask": {
        TopologyChangeAsyncLayoutApplicationStrategyConfigurator.configure(
          canvas.graph,
          applier,
          (apply) => {
            setTimeout(() => {
              apply();
            });
          },
        );
        break;
      }

      default: {
        TopologyChangeAsyncLayoutApplicationStrategyConfigurator.configure(
          canvas.graph,
          applier,
          (apply) => {
            queueMicrotask(() => {
              apply();
            });
          },
        );
        break;
      }
    }
  }
}
