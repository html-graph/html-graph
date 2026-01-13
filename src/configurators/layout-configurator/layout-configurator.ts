import { LayoutParams } from "./layout-params";
import { Canvas } from "@/canvas";
import { ManualLayoutApplicationStrategyConfigurator } from "./manual-layout-application-strategy-configurator";
import { TopologyChangeAsyncLayoutApplicationStrategyConfigurator } from "./topology-change-async-layout-application-strategy-configurator";

export class LayoutConfigurator {
  public static configure(canvas: Canvas, params: LayoutParams): void {
    const strategy = params.applyOn;

    switch (strategy.type) {
      case "manual": {
        ManualLayoutApplicationStrategyConfigurator.configure(
          canvas,
          params.algorithm,
          strategy.trigger,
        );
        break;
      }

      case "topologyChangeMacrotask": {
        TopologyChangeAsyncLayoutApplicationStrategyConfigurator.configure(
          canvas,
          params.algorithm,
          (apply) => {
            setTimeout(() => {
              apply();
            });
          },
        );
        break;
      }

      case "topologyChangeMicrotask": {
        TopologyChangeAsyncLayoutApplicationStrategyConfigurator.configure(
          canvas,
          params.algorithm,
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
