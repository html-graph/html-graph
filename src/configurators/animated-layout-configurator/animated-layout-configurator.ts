import { Identifier } from "@/identifier";
import { Canvas } from "@/canvas";
import { AnimationSeries } from "./animation-series";
import { AnimatedLayoutAlgorithm } from "@/layouts";
import { AnimatedLayoutApplier } from "../shared";

export class AnimatedLayoutConfigurator {
  private readonly applier: AnimatedLayoutApplier;

  private readonly step = (dt: number): void => {
    this.applier.apply(dt);
  };

  private constructor(
    canvas: Canvas,
    algorithm: AnimatedLayoutAlgorithm,
    private readonly win: Window,
    staticNodeResolver: (nodeId: Identifier) => boolean,
  ) {
    this.applier = new AnimatedLayoutApplier(canvas, algorithm, {
      staticNodeResolver,
    });

    new AnimationSeries(this.win, this.step);
  }

  public static configure(
    canvas: Canvas,
    params: AnimatedLayoutAlgorithm,
    win: Window,
    staticNodeResolver: (nodeId: Identifier) => boolean,
  ): void {
    new AnimatedLayoutConfigurator(canvas, params, win, staticNodeResolver);
  }
}
