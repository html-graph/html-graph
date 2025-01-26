import { TransformState } from "../transform-state";

export interface AbstractPublicViewportTransformer {
  getViewportMatrix(): TransformState;

  getContentMatrix(): TransformState;
}
