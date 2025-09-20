import { Identifier } from "@/identifier";
import { AnimatedLayoutConfig } from "./animated-layout-config";
import { Canvas } from "@/canvas";

export class AnimatedLayoutConfigurator {
  private previousTimestamp: number | undefined = undefined;

  private constructor(
    private readonly canvas: Canvas,
    private readonly config: AnimatedLayoutConfig,
    private readonly staticNodes: Set<Identifier>,
  ) {
    canvas.graph.onBeforeNodeRemoved.subscribe((nodeId) => {
      this.staticNodes.delete(nodeId);
    });

    canvas.graph.onBeforeClear.subscribe(() => {
      this.staticNodes.clear();
    });

    const step = (timestamp: number): void => {
      if (this.previousTimestamp === undefined) {
        this.previousTimestamp = timestamp;
      } else {
        const dt = (timestamp - this.previousTimestamp) / 1000;
        this.previousTimestamp = timestamp;
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
    staticNodes: Set<Identifier>,
  ): void {
    new AnimatedLayoutConfigurator(canvas, config, staticNodes);
  }
}
