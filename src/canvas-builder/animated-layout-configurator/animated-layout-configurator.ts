import { Identifier } from "@/identifier";
import { AnimatedLayoutConfig } from "./animated-layout-config";
import { Canvas } from "@/canvas";

export class AnimatedLayoutConfigurator {
  private constructor(
    private readonly canvas: Canvas,
    private readonly config: AnimatedLayoutConfig,
    private readonly staticNodes: ReadonlySet<Identifier>,
  ) {
    let previousTimestamp: number;

    const step = (timestamp: number): void => {
      if (previousTimestamp === undefined) {
        previousTimestamp = timestamp;
      } else {
        const dt = (timestamp - previousTimestamp) / 1000;
        previousTimestamp = timestamp;
        const dtLimited = dt > 0.1 ? 0 : dt;

        const nextCoords = this.config.algorithm.calculateNextCoordinates(
          canvas.graph,
          dtLimited,
          this.staticNodes,
        );

        nextCoords.forEach((coords, nodeId) => {
          this.canvas.updateNode(nodeId, { x: coords.x, y: coords.y });
        });
      }

      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }

  public static configure(
    canvas: Canvas,
    config: AnimatedLayoutConfig,
    staticNodes: ReadonlySet<Identifier>,
  ): void {
    new AnimatedLayoutConfigurator(canvas, config, staticNodes);
  }
}
