import { EventHandler } from "@/event-subject";
import { ViewportStore, TransformState } from "@/viewport-store";

export class Viewport {
  public readonly onAfterUpdated: EventHandler<void>;

  public constructor(private readonly viewportStore: ViewportStore) {
    this.onAfterUpdated = this.viewportStore.onAfterUpdated;
  }

  public getViewportMatrix(): TransformState {
    return { ...this.viewportStore.getViewportMatrix() };
  }

  public getContentMatrix(): TransformState {
    return { ...this.viewportStore.getContentMatrix() };
  }
}
