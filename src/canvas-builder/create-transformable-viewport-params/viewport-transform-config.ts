import { MouseEventVerifier } from "@/configurators";
import { TransformPreprocessorConfig } from "./transform-preprocessor-config";

export interface ViewportTransformConfig {
  readonly scale?: {
    readonly mouseWheelSensitivity?: number;
    readonly mouseWheelEventVerifier?: (event: WheelEvent) => boolean;
    readonly wheelFinishTimeout?: number;
  };
  readonly shift?: {
    readonly cursor?: string | null;
    readonly mouseDownEventVerifier?: MouseEventVerifier;
    readonly mouseUpEventVerifier?: MouseEventVerifier;
  };
  readonly transformPreprocessor?:
    | TransformPreprocessorConfig
    | TransformPreprocessorConfig[];
  readonly events?: {
    readonly onTransformStarted?: () => void;
    readonly onTransformFinished?: () => void;
    readonly onBeforeTransformChange?: () => void;
    readonly onTransformChange?: () => void;
    readonly onResizeTransformStarted?: () => void;
    readonly onResizeTransformFinished?: () => void;
  };
}
