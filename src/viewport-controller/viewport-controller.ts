import { PatchMatrixRequest } from "./patch-matrix-request";
import { GraphStore } from "@/graph-store";
import { TransformState, ViewportStore } from "@/viewport-store";
import { ViewportControllerParams } from "./viewport-controller-params";
import { FocusConfig } from "./focus-config";
import { Identifier } from "@/identifier";
import { Point } from "@/point";
import { createFocusParams, FocusParams } from "./create-focus-params";

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

  public focus(config?: FocusConfig | undefined): void {
    const params = createFocusParams(config ?? {}, this.params);

    this.navigate(params);
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
      const contentBoxCenter: Point = {
        x: (minX + maxX) / 2,
        y: (minY + maxY) / 2,
      };

      const halfContentBoxWidth = (maxX - minX) / 2 + params.contentOffset;
      const halfContentBoxHeight = (maxY - minY) / 2 + params.contentOffset;

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

      const focusContentMatrix: TransformState = {
        scale: Math.max(adjustedScale, params.minContentScale),
        x: x + dx,
        y: y + dy,
      };

      this.viewportStore.patchContentMatrix(focusContentMatrix);
    }
  }
}
