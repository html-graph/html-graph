import { BeforeTransformChangeFn } from "./before-transform-change-fn";
import { TransformChangeFn } from "./transform-change-fn";
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
    readonly onBeforeTransformChange?: BeforeTransformChangeFn;
    readonly onTransformChange?: TransformChangeFn;
  };
}
