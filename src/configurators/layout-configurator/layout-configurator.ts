import { LayoutParams } from "./layout-params";
import { Canvas } from "@/canvas";
import { ManualLayoutApplicationStrategyConfigurator } from "../manual-layout-application-strategy-configurator";
import { TopologyChangeTimeoutLayoutApplicationStrategyConfigurator } from "../topology-change-timeout-layout-application-strategy-configurator";

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
      case "topologyChangeTimeout": {
        TopologyChangeTimeoutLayoutApplicationStrategyConfigurator.configure(
          canvas,
          params.algorithm,
        );
        break;
      }
    }
  }
}
