import { TransformLayoutAlgorithm } from "@/layout-algorithm";
import { LayoutConfig } from "./layout-config";
import { Canvas } from "@/canvas";
import {
  ManualLayoutApplicationStrategyConfigurator,
  TopologyChangeLayoutApplicationStrategyConfigurator,
} from "@/configurators";

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
