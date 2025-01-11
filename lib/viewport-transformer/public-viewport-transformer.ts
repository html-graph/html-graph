import { TransformState } from "./transform-state";
import { ViewportTransformer } from "./viewport-transformer";

export class PublicViewportTransformer {
  public constructor(private readonly transformer: ViewportTransformer) {}

  public getViewportMatrix(): TransformState {
    return { ...this.transformer.getViewportMatrix() };
  }

  public getContentMatrix(): TransformState {
    return { ...this.transformer.getContentMatrix() };
  }
}
