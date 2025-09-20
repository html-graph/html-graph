import { LayoutParams } from "./layout-config";
import { Canvas } from "@/canvas";
import {
  ManualLayoutApplicationStrategyConfigurator,
  TopologyChangeLayoutApplicationStrategyConfigurator,
} from "@/configurators";
import { EventSubject } from "@/event-subject";

export class LayoutConfigurator {
  public static configure(canvas: Canvas, params: LayoutParams): void {
    const strategy = params.applyOn;

    if (strategy instanceof EventSubject) {
      ManualLayoutApplicationStrategyConfigurator.configure(
        canvas,
        params.algorithm,
        strategy,
      );
    }

    switch (strategy) {
      case "topologyChange":
        TopologyChangeLayoutApplicationStrategyConfigurator.configure(
          canvas,
          params.algorithm,
        );
        break;
    }
  }
}
