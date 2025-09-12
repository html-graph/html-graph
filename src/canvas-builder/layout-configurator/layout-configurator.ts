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
    // this might not work as expected,
    // as algorithm gets applied each time instead of once
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
