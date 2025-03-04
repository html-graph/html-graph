import { TransformPreprocessorFn } from "../preprocessors";

export interface Options {
  readonly wheelSensitivity: number;
  readonly onTransformStarted: () => void;
  readonly onTransformFinished: () => void;
  readonly onBeforeTransformChange: () => void;
  readonly onTransformChange: () => void;
  readonly transformPreprocessor: TransformPreprocessorFn;
  readonly shiftCursor: string | null;
  readonly mouseDownEventVerifier: (event: MouseEvent) => boolean;
  readonly mouseUpEventVerifier: (event: MouseEvent) => boolean;
  readonly mouseWheelEventVerifier: (event: WheelEvent) => boolean;
}
