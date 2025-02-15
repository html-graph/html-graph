import { BeforeTransformStartedFn } from "./before-transform-started-fn";
import { TransformFinishedFn } from "./transform-finished-fn";
import { TransformPreprocessorOption } from "./transform-preprocessor-option";

export interface TransformOptions {
  readonly scale?: {
    readonly mouseWheelSensitivity?: number;
  };
  readonly shift?: {
    readonly cursor?: string | null;
  };
  readonly transformPreprocessor?:
    | TransformPreprocessorOption
    | TransformPreprocessorOption[];
  readonly events?: {
    readonly onBeforeTransformStarted?: BeforeTransformStartedFn;
    readonly onTransformFinished?: TransformFinishedFn;
  };
}
