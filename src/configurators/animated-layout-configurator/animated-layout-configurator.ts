import { Identifier } from "@/identifier";
import { Canvas } from "@/canvas";
import { AnimationSeries } from "@/animation-series";
import { AnimatedLayoutAlgorithm } from "@/animated-layout-algorithm";

export class AnimatedLayoutConfigurator {
  private readonly step = (dtSec: number): void => {
    const nextCoords = this.algorithm.calculateNextCoordinates(
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
    private readonly algorithm: AnimatedLayoutAlgorithm,
    private readonly staticNodes: ReadonlySet<Identifier>,
    private readonly win: Window,
  ) {
    new AnimationSeries(this.win, this.step);
  }

  public static configure(
    canvas: Canvas,
    params: AnimatedLayoutAlgorithm,
    staticNodes: Set<Identifier>,
    win: Window,
  ): void {
    new AnimatedLayoutConfigurator(canvas, params, staticNodes, win);
  }
}
