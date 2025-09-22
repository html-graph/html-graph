import { Identifier } from "@/identifier";
import { AnimatedLayoutParams } from "./animated-layout-params";
import { Canvas } from "@/canvas";
import { AnimationSeries } from "@/animation-series";

export class AnimatedLayoutConfigurator {
  private readonly step = (dtSec: number): void => {
    const nextCoords = this.params.algorithm.calculateNextCoordinates(
      this.canvas.graph,
      dtSec,
    );

    nextCoords.forEach((coords, nodeId) => {
      if (!this.staticNodes.has(nodeId)) {
        this.canvas.updateNode(nodeId, { x: coords.x, y: coords.y });
      }
    });
  };

  private constructor(
    private readonly canvas: Canvas,
    private readonly params: AnimatedLayoutParams,
    private readonly staticNodes: ReadonlySet<Identifier>,
    private readonly win: Window,
  ) {
    new AnimationSeries(this.win, this.step);
  }

  public static configure(
    canvas: Canvas,
    params: AnimatedLayoutParams,
    staticNodes: Set<Identifier>,
    win: Window,
  ): void {
    new AnimatedLayoutConfigurator(canvas, params, staticNodes, win);
  }
}
