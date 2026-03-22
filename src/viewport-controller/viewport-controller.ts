import { PatchMatrixRequest } from "./patch-matrix-request";
import { GraphStore } from "@/graph-store";
import { TransformState, ViewportStore } from "@/viewport-store";
import { ViewportControllerParams } from "./viewport-controller-params";
import { FocusConfig } from "./focus-config";
import { Identifier } from "@/identifier";
import { createFocusParams, FocusParams } from "./create-focus-params";
import { Point } from "@/point";
import { CenterConfig } from "./center-config";
import { applyMatrixMove, applyMatrixScale } from "@/transformations";

export class ViewportController {
  public constructor(
    private readonly graphStore: GraphStore,
    private readonly viewportStore: ViewportStore,
    private readonly params: ViewportControllerParams,
    private readonly win: Window,
  ) {}

  public patchViewportMatrix(request: PatchMatrixRequest): void {
    this.viewportStore.patchViewportMatrix(request);
  }

  public patchContentMatrix(request: PatchMatrixRequest): void {
    this.viewportStore.patchContentMatrix(request);
  }

  public center(target: Point, config?: CenterConfig | undefined): void {
    const { width, height } = this.viewportStore.getDimensions();
    const viewportCenter: Point = { x: width / 2, y: height / 2 };

    const viewportMatrix = this.viewportStore.getViewportMatrix();
    const viewportTarget = this.viewportStore.createViewportCoords(target);

    const dx = viewportTarget.x - viewportCenter.x;
    const dy = viewportTarget.y - viewportCenter.y;

    let nextViewportMatrix = applyMatrixMove(viewportMatrix, dx, dy);

    const contentScale = config?.contentScale;

    if (contentScale !== undefined) {
      const viewportScale = 1 / contentScale;

      nextViewportMatrix = applyMatrixScale(
        nextViewportMatrix,
        viewportScale / viewportMatrix.scale,
        viewportCenter.x,
        viewportCenter.y,
      );
    }

    const duration = config?.animationDuration ?? 0;

    if (duration > 0) {
      this.animateNavigation(viewportMatrix, nextViewportMatrix, duration);
    } else {
      this.viewportStore.patchViewportMatrix(nextViewportMatrix);
    }
  }

  public focus(config?: FocusConfig | undefined): void {
    const params = createFocusParams(config ?? {}, this.params);

    this.params.focus.schedule(() => {
      this.navigate(params);
    });
  }

  public destroy(): void {
    this.viewportStore.destroy();
  }

  private navigate(params: FocusParams): void {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    let nodesCount = 0;

    const focusNodes = new Set<Identifier>();

    for (const nodeId of params.nodes) {
      focusNodes.add(nodeId);
    }

    this.graphStore.getAllNodeIds().forEach((nodeId) => {
      const { payload } = this.graphStore.getNode(nodeId);

      if (
        payload.x !== null &&
        payload.y !== null &&
        (focusNodes.size === 0 || focusNodes.has(nodeId))
      ) {
        minX = Math.min(payload.x, minX);
        maxX = Math.max(payload.x, maxX);
        minY = Math.min(payload.y, minY);
        maxY = Math.max(payload.y, maxY);
        nodesCount++;
      }
    });

    if (nodesCount > 0) {
      minX -= params.contentOffset;
      minY -= params.contentOffset;
      maxX += params.contentOffset;
      maxY += params.contentOffset;

      const contentBoxCenter: Point = {
        x: (minX + maxX) / 2,
        y: (minY + maxY) / 2,
      };

      const { scale } = this.viewportStore.getContentMatrix();

      const viewportBoxHeight = (maxY - minY) * scale;
      const viewportBoxWidth = (maxX - minX) * scale;

      const { width, height } = this.viewportStore.getDimensions();

      const ratio = Math.max(
        viewportBoxWidth / width,
        viewportBoxHeight / height,
      );

      const fitContentScale = ratio > 1 ? scale / ratio : scale;
      const thresholdScale = Math.max(fitContentScale, params.minContentScale);

      this.center(contentBoxCenter, { contentScale: thresholdScale });
    }
  }

  private animateNavigation(
    previousViewportMatrix: TransformState,
    nextViewportMatrix: TransformState,
    duration: number,
  ): void {
    let start: number | undefined = undefined;

    const deltaMatrix: TransformState = {
      scale: nextViewportMatrix.scale - previousViewportMatrix.scale,
      x: nextViewportMatrix.x - previousViewportMatrix.x,
      y: nextViewportMatrix.y - previousViewportMatrix.y,
    };

    const step = (timestamp: number): void => {
      if (start === undefined) {
        start = timestamp;
      }

      const progress = Math.min((timestamp - start) / duration, 1);

      if (progress <= 1) {
        this.viewportStore.patchViewportMatrix({
          scale: previousViewportMatrix.scale + progress * deltaMatrix.scale,
          x: previousViewportMatrix.x + progress * deltaMatrix.x,
          y: previousViewportMatrix.y + progress * deltaMatrix.y,
        });
      }

      if (progress < 1) {
        this.win.requestAnimationFrame(step);
      }
    };

    this.win.requestAnimationFrame(step);
  }
}
