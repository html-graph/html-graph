import { TransformFinishedFn } from "./transform-finished-fn";
import { TransformPreprocessorOption } from "./transform-preprocessor-option";

export interface TransformOptions {
  readonly scale?: {
    readonly enabled?: boolean;
    readonly wheelSensitivity?: number;
  };
  readonly shift?: {
    readonly enabled?: boolean;
  };
  readonly transformPreprocessor?:
    | TransformPreprocessorOption
    | TransformPreprocessorOption[];
  readonly events?: {
    readonly onTransformFinished?: TransformFinishedFn;
  };
}
