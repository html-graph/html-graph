import { BeforeTransformChangeFn } from "./before-transform-change-fn";
import { TransformChangeFn } from "./transform-change-fn";
import { TransformPreprocessorOption } from "./transform-preprocessor-option";

export interface TransformOptions {
  readonly scale?: {
    readonly mouseWheelSensitivity?: number;
    readonly mouseWheelEventValidator?: (event: WheelEvent) => boolean;
  };
  readonly shift?: {
    readonly cursor?: string | null;
    readonly mouseDownEventValidator?: (event: MouseEvent) => boolean;
    readonly mouseUpEventValidator?: (event: MouseEvent) => boolean;
  };
  readonly transformPreprocessor?:
    | TransformPreprocessorOption
    | TransformPreprocessorOption[];
  readonly events?: {
    readonly onTransformStarted?: () => void;
    readonly onTransformFinished?: () => void;
    readonly onBeforeTransformChange?: BeforeTransformChangeFn;
    readonly onTransformChange?: TransformChangeFn;
  };
}
