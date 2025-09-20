import { LayoutConfig } from "./layout-config";
import { Canvas } from "@/canvas";
import {
  ManualLayoutApplicationStrategyConfigurator,
  TopologyChangeLayoutApplicationStrategyConfigurator,
} from "@/configurators";
import { EventSubject } from "@/event-subject";

export class LayoutConfigurator {
  public static configure(canvas: Canvas, config: LayoutConfig): void {
    const strategy = config.applyOn;

    if (strategy instanceof EventSubject) {
      ManualLayoutApplicationStrategyConfigurator.configure(
        canvas,
        config.algorithm,
        strategy,
      );
    }

    switch (strategy) {
      case "topologyChange":
        TopologyChangeLayoutApplicationStrategyConfigurator.configure(
          canvas,
          config.algorithm,
        );
        break;
    }
  }
}
