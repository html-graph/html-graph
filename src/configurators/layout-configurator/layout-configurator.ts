import { LayoutParams } from "./layout-config";
import { Canvas } from "@/canvas";
import {
  ManualLayoutApplicationStrategyConfigurator,
  TopologyChangeTimeoutLayoutApplicationStrategyConfigurator,
} from "@/configurators";

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
