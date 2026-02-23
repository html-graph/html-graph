import { PatchMatrixRequest } from "./patch-matrix-request";
import { GraphStore } from "@/graph-store";
import { ViewportStore } from "@/viewport-store";
import { ViewportControllerParams } from "./viewport-controller-params";
import { FocusConfig } from "./focus-config";
import { Identifier } from "@/identifier";
import { createFocusParams, FocusParams } from "./create-focus-params";
import { Point } from "@/point";
import { CenterConfig } from "./center-config";
import { move, scale } from "@/transformations";

export class ViewportController {
  public constructor(
    private readonly graphStore: GraphStore,
    private readonly viewportStore: ViewportStore,
    private readonly params: ViewportControllerParams,
  ) {}

  public patchViewportMatrix(request: PatchMatrixRequest): void {
    this.viewportStore.patchViewportMatrix(request);
  }

  public patchContentMatrix(request: PatchMatrixRequest): void {
    this.viewportStore.patchContentMatrix(request);
  }

  public center(target: Point, config?: CenterConfig | undefined): void {
    const { width, height } = this.viewportStore.getDimensions();

    const contentCenter = this.viewportStore.createContentCoords({
      x: width / 2,
      y: height / 2,
    });

    const viewportMatrix = this.viewportStore.getViewportMatrix();

    const dx = contentCenter.x - target.x;
    const dy = contentCenter.y - target.y;

    const viewportScale =
      config?.contentScale !== undefined
        ? 1 / config.contentScale
        : viewportMatrix.scale;

    const nextViewportMatrix = scale(
      move(viewportMatrix, dx, dy),
      viewportScale,
      dx,
      dy,
    );

    this.viewportStore.patchViewportMatrix(nextViewportMatrix);
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

      const halfContentBoxWidth = (maxX - minX) / 2;
      const halfContentBoxHeight = (maxY - minY) / 2;

      const viewportBoxCenter =
        this.viewportStore.createViewportCoords(contentBoxCenter);

      const { width, height } = this.viewportStore.getDimensions();

      const halfWidth = width / 2;
      const halfHeight = height / 2;

      const dx = halfWidth - viewportBoxCenter.x;
      const dy = halfHeight - viewportBoxCenter.y;

      const ratio = Math.max(
        halfContentBoxWidth / halfWidth,
        halfContentBoxHeight / halfHeight,
      );

      const { scale, x, y } = this.viewportStore.getContentMatrix();
      const adjustedScale = ratio > 1 ? scale / ratio : scale;
      const thresholdScale = Math.max(adjustedScale, params.minContentScale);

      const focusContentMatrix: PatchMatrixRequest = {
        scale: thresholdScale,
        x: x + dx,
        y: y + dy,
      };

      this.viewportStore.patchContentMatrix(focusContentMatrix);
    }
  }
}
