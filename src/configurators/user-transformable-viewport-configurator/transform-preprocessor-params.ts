import { TransformState } from "@/viewport-store";

export interface TransformPreprocessorParams {
  readonly prevTransform: TransformState;
  readonly nextTransform: TransformState;
  readonly viewport: {
    readonly width: number;
    readonly height: number;
  };
}
