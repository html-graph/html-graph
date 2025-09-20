import { Identifier } from "@/identifier";
import { AnimatedLayoutParams } from "./animated-layout-params";
import { Canvas } from "@/canvas";

export class AnimatedLayoutConfigurator {
  private previousTimeStamp: number | undefined = undefined;

  private readonly step = (timeStamp: number): void => {
    if (this.previousTimeStamp === undefined) {
      this.previousTimeStamp = timeStamp;
    } else {
      const dt = (timeStamp - this.previousTimeStamp) / 1000;
      this.previousTimeStamp = timeStamp;

      if (dt < 0.1) {
        const nextCoords = this.config.algorithm.calculateNextCoordinates(
          this.canvas.graph,
          dt,
          this.staticNodes,
        );

        nextCoords.forEach((coords, nodeId) => {
          this.canvas.updateNode(nodeId, { x: coords.x, y: coords.y });
        });
      }
    }

    requestAnimationFrame(this.step);
  };

  private constructor(
    private readonly canvas: Canvas,
    private readonly config: AnimatedLayoutParams,
    private readonly staticNodes: ReadonlySet<Identifier>,
  ) {
    requestAnimationFrame(this.step);
  }

  public static configure(
    canvas: Canvas,
    config: AnimatedLayoutParams,
    staticNodes: Set<Identifier>,
  ): void {
    new AnimatedLayoutConfigurator(canvas, config, staticNodes);
  }
}
