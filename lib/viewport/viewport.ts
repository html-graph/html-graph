import { EventHandler } from "@/event-subject";
import { ViewportStore, TransformState } from "../viewport-store";

/**
 * This entity is responsible for providing viewport API
 */
export class Viewport {
  public readonly onBeforeUpdate: EventHandler<void>;

  public readonly onAfterUpdate: EventHandler<void>;

  public constructor(private readonly transformer: ViewportStore) {
    this.onBeforeUpdate = this.transformer.onBeforeUpdate;

    this.onAfterUpdate = this.transformer.onAfterUpdate;
  }

  public getViewportMatrix(): TransformState {
    return { ...this.transformer.getViewportMatrix() };
  }

  public getContentMatrix(): TransformState {
    return { ...this.transformer.getContentMatrix() };
  }
}
