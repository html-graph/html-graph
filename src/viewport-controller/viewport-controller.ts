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
    const viewportCenter: Point = { x: width / 2, y: height / 2 };

    const viewportMatrix = this.viewportStore.getViewportMatrix();
    const viewportTarget = this.viewportStore.createViewportCoords(target);

    const dx = viewportTarget.x - viewportCenter.x;
    const dy = viewportTarget.y - viewportCenter.y;

    let nextViewportMatrix = move(viewportMatrix, dx, dy);

    const contentScale = config?.contentScale;

    if (contentScale !== undefined) {
      const viewportScale = 1 / contentScale;

      nextViewportMatrix = scale(
        nextViewportMatrix,
        viewportScale / viewportMatrix.scale,
        viewportCenter.x,
        viewportCenter.y,
      );
    }

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

      const { scale: contentScale } = this.viewportStore.getContentMatrix();

      const viewportBoxHeight = (maxY - minY) * contentScale;
      const viewportBoxWidth = (maxX - minX) * contentScale;

      const { width, height } = this.viewportStore.getDimensions();

      const ratio = Math.max(
        viewportBoxWidth / width,
        viewportBoxHeight / height,
      );

      const fitContentScale = ratio > 1 ? contentScale / ratio : contentScale;
      const thresholdScale = Math.max(fitContentScale, params.minContentScale);

      this.center(contentBoxCenter, { contentScale: thresholdScale });
    }
  }
}
