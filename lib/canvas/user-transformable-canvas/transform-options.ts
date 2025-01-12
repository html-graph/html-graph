import { TransformFinishedFn } from "./transform-finished-fn";
import { TransformPreprocessorFn } from "./transform-preprocessor-fn";

export interface TransformOptions {
  readonly scale?: {
    readonly enabled?: boolean;
    readonly min?: number;
    readonly max?: number;
    readonly wheelSensitivity?: number;
  };
  readonly shift?: {
    readonly enabled?: boolean;
  };
  readonly transformPreprocessor?: TransformPreprocessorFn;
  readonly events?: {
    readonly onTransformFinished?: TransformFinishedFn;
  };
}
