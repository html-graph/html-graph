import { TransformLayoutAlgorithm } from "@/layout-algorithm";
import { LayoutConfig } from "./layout-config";
import { TopologyChangeLayoutApplicationStrategyConfigurator } from "./topology-change-layout-application-strategy-configurator";
import { ManualLayoutApplicationStrategyConfigurator } from "./manual-layout-application-strategy-configurator";
import { Canvas } from "@/canvas";

export class LayoutConfigurator {
  public static configure(canvas: Canvas, config: LayoutConfig): void {
    const algorithm = config.transform
      ? new TransformLayoutAlgorithm({
          baseAlgorithm: config.algorithm,
          matrix: config.transform,
        })
      : config.algorithm;

    const strategy = config.applicationStrategy;

    switch (strategy.type) {
      case "topologyChange":
        TopologyChangeLayoutApplicationStrategyConfigurator.configure(
          canvas,
          algorithm,
        );
        break;
      case "manual": {
        ManualLayoutApplicationStrategyConfigurator.configure(
          canvas,
          algorithm,
          strategy.trigger,
        );
        break;
      }
    }
  }
}
