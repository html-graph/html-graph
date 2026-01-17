import { Canvas } from "@/canvas";
import { AnimationSeries } from "./animation-series";
import { AnimatedLayoutApplier } from "../shared";
import { AnimatedLayoutParams } from "./animated-layout-params";

export class AnimatedLayoutConfigurator {
  private readonly applier: AnimatedLayoutApplier;

  private readonly step = (dt: number): void => {
    this.applier.apply(dt);
  };

  private constructor(
    canvas: Canvas,
    params: AnimatedLayoutParams,
    private readonly win: Window,
  ) {
    this.applier = new AnimatedLayoutApplier(canvas, params.algorithm, {
      staticNodeResolver: params.staticNodeResolver,
    });

    new AnimationSeries(this.win, this.step);
  }

  public static configure(
    canvas: Canvas,
    params: AnimatedLayoutParams,
    win: Window,
  ): void {
    new AnimatedLayoutConfigurator(canvas, params, win);
  }
}
