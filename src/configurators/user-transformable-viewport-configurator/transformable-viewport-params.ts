import { MouseEventVerifier } from "../shared";
import { TransformPreprocessorFn } from "./transform-preprocessor-fn";

export interface TransformableViewportParams {
  readonly wheelSensitivity: number;
  readonly onTransformStarted: () => void;
  readonly onTransformFinished: () => void;
  readonly onBeforeTransformChange: () => void;
  readonly onTransformChange: () => void;
  readonly onResizeTransformStarted: () => void;
  readonly onResizeTransformFinished: () => void;
  readonly transformPreprocessor: TransformPreprocessorFn;
  readonly shiftCursor: string | null;
  readonly mouseDownEventVerifier: MouseEventVerifier;
  readonly mouseUpEventVerifier: MouseEventVerifier;
  readonly mouseWheelEventVerifier: (event: WheelEvent) => boolean;
  readonly scaleWheelFinishTimeout: number;
}
