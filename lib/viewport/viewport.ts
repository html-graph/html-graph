import { ViewportTransformer, TransformState } from "../viewport-transformer";

/**
 * This entity is responsible for providing viewport transformation state to the
 * end user in a safe way
 */
export class Viewport {
  public constructor(private readonly transformer: ViewportTransformer) {}

  public getViewportMatrix(): TransformState {
    return { ...this.transformer.getViewportMatrix() };
  }

  public getContentMatrix(): TransformState {
    return { ...this.transformer.getContentMatrix() };
  }
}
