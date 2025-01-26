import { TransformState } from "../transform-state";
import { AbstractPublicViewportTransformer } from "./abstract-public-viewport-transformer";

export class PublicViewportTransformerMock
  implements AbstractPublicViewportTransformer
{
  public getViewportMatrix(): TransformState {
    return { scale: 1, dx: 0, dy: 0 };
  }

  public getContentMatrix(): TransformState {
    return { scale: 1, dx: 0, dy: 0 };
  }
}
