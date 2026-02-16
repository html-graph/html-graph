import { PatchMatrixRequest } from "./patch-matrix-request";
import { GraphStore } from "@/graph-store";
import { ViewportStore } from "@/viewport-store";
import { ViewportControllerParams } from "./viewport-controller-params";
import { ViewportNavigator } from "./viewport-navigator";
import { FocusConfig } from "./focus-config";

export class ViewportController {
  public constructor(
    private readonly graphStore: GraphStore,
    private readonly viewportStore: ViewportStore,
    private readonly params: ViewportControllerParams,
  ) {}

  public focus(config?: FocusConfig | undefined): void {
    const navigator = new ViewportNavigator(
      this.viewportStore,
      this.graphStore,
    );

    const contentMatrix = navigator.createFocusContentMatrix({
      contentOffset: config?.contentOffset ?? this.params.focus.contentOffset,
      nodes: config?.nodes ?? [],
      minContentScale:
        config?.minContentScale ?? this.params.focus.minContentScale,
    });

    this.viewportStore.patchContentMatrix(contentMatrix);
  }

  public patchViewportMatrix(request: PatchMatrixRequest): void {
    this.viewportStore.patchViewportMatrix(request);
  }

  public patchContentMatrix(request: PatchMatrixRequest): void {
    this.viewportStore.patchContentMatrix(request);
  }

  public destroy(): void {
    this.viewportStore.destroy();
  }
}
