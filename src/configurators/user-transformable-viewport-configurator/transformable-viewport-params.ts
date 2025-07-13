import { TransformPreprocessorFn } from "./preprocessors";
import { MouseEventVerifier } from "../shared";

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
