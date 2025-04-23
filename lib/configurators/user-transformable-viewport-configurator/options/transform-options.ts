import { TransformPreprocessorOption } from "./transform-preprocessor-option";

export interface TransformOptions {
  readonly scale?: {
    readonly mouseWheelSensitivity?: number;
    readonly mouseWheelEventVerifier?: (event: WheelEvent) => boolean;
    readonly wheelFinishTimeout?: number;
  };
  readonly shift?: {
    readonly cursor?: string | null;
    readonly mouseDownEventVerifier?: (event: MouseEvent) => boolean;
    readonly mouseUpEventVerifier?: (event: MouseEvent) => boolean;
  };
  readonly transformPreprocessor?:
    | TransformPreprocessorOption
    | TransformPreprocessorOption[];
  readonly events?: {
    readonly onTransformStarted?: () => void;
    readonly onTransformFinished?: () => void;
    readonly onBeforeTransformChange?: () => void;
    readonly onTransformChange?: () => void;
    readonly onResizeTransformStarted?: () => void;
    readonly onResizeTransformFinished?: () => void;
  };
}
