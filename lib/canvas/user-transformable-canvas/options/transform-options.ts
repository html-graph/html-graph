import { TransformFinishedFn } from "../transform-finished";
import { TransformPreprocessorOption } from "./transform-preprocessor-option";

export interface TransformOptions {
  readonly scale?: {
    readonly enabled?: boolean;
    readonly wheelSensitivity?: number;
  };
  readonly shift?: {
    readonly enabled?: boolean;
    readonly cursor?: string | null;
  };
  readonly transformPreprocessor?:
    | TransformPreprocessorOption
    | TransformPreprocessorOption[];
  readonly events?: {
    readonly onTransformFinished?: TransformFinishedFn;
  };
}
