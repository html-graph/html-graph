import { TransformState } from "../transform-state";
import { AbstractViewportTransformer } from "../viewport-transformer";

export class PublicViewportTransformer {
  public constructor(
    private readonly transformer: AbstractViewportTransformer,
  ) {}

  public getViewportMatrix(): TransformState {
    return { ...this.transformer.getViewportMatrix() };
  }

  public getContentMatrix(): TransformState {
    return { ...this.transformer.getContentMatrix() };
  }
}
