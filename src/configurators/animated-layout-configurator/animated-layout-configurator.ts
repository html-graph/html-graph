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
        const nextCoords = this.params.algorithm.calculateNextCoordinates(
          this.canvas.graph,
          dt,
          this.staticNodes,
        );

        nextCoords.forEach((coords, nodeId) => {
          if (!this.staticNodes.has(nodeId)) {
            this.canvas.updateNode(nodeId, { x: coords.x, y: coords.y });
          }
        });
      }
    }

    requestAnimationFrame(this.step);
  };

  private constructor(
    private readonly canvas: Canvas,
    private readonly params: AnimatedLayoutParams,
    private readonly staticNodes: ReadonlySet<Identifier>,
  ) {
    requestAnimationFrame(this.step);
  }

  public static configure(
    canvas: Canvas,
    params: AnimatedLayoutParams,
    staticNodes: Set<Identifier>,
  ): void {
    new AnimatedLayoutConfigurator(canvas, params, staticNodes);
  }
}
