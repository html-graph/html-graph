import { TransformLayoutAlgorithm } from "@/layout-algorithm";
import { LayoutConfig } from "./layout-config";
import { Canvas } from "@/canvas";
import {
  ManualLayoutApplicationStrategyConfigurator,
  TopologyChangeLayoutApplicationStrategyConfigurator,
} from "@/configurators";
import { EventSubject } from "@/event-subject";

export class LayoutConfigurator {
  public static configure(canvas: Canvas, config: LayoutConfig): void {
    const algorithm = config.transform
      ? new TransformLayoutAlgorithm({
          baseAlgorithm: config.algorithm,
          matrix: config.transform,
        })
      : config.algorithm;

    const strategy = config.applyOn;

    if (strategy instanceof EventSubject) {
      ManualLayoutApplicationStrategyConfigurator.configure(
        canvas,
        algorithm,
        strategy,
      );
    }

    switch (strategy) {
      case "topologyChange":
        TopologyChangeLayoutApplicationStrategyConfigurator.configure(
          canvas,
          algorithm,
        );
        break;
    }
  }
}
