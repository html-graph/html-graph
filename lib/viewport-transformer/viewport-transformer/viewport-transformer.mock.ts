import { initialMatrix } from "../initial-matrix";
import { TransformState } from "../transform-state";
import { AbstractViewportTransformer } from "./abstract-viewport-transformer";

export class ViewportTransformerMock implements AbstractViewportTransformer {
  public getViewportMatrix(): TransformState {
    return initialMatrix;
  }

  public getContentMatrix(): TransformState {
    return initialMatrix;
  }

  public patchViewportMatrix(): void {
    // mock method is intended to be dummy
  }

  public patchContentMatrix(): void {
    // mock method is intended to be dummy
  }
}
