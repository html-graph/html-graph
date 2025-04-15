import { EventHandler } from "@/event-subject";
import { ViewportStore, TransformState } from "../viewport-store";

/**
 * This entity is responsible for providing viewport API
 */
export class Viewport {
  public readonly onBeforeUpdated: EventHandler<void>;

  public readonly onAfterUpdated: EventHandler<void>;

  public constructor(private readonly transformer: ViewportStore) {
    this.onBeforeUpdated = this.transformer.onBeforeUpdated;

    this.onAfterUpdated = this.transformer.onAfterUpdated;
  }

  public getViewportMatrix(): TransformState {
    return { ...this.transformer.getViewportMatrix() };
  }

  public getContentMatrix(): TransformState {
    return { ...this.transformer.getContentMatrix() };
  }
}
