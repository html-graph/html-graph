import { TransformPreprocessorFn } from "../preprocessors";

export interface Options {
  readonly wheelSensitivity: number;
  readonly onTransformStarted: () => void;
  readonly onTransformFinished: () => void;
  readonly onBeforeTransformChange: () => void;
  readonly onTransformChange: () => void;
  readonly transformPreprocessor: TransformPreprocessorFn;
  readonly shiftCursor: string | null;
  readonly mouseDownEventValidator: (event: MouseEvent) => boolean;
  readonly mouseUpEventValidator: (event: MouseEvent) => boolean;
  readonly mouseWheelEventValidator: (event: WheelEvent) => boolean;
}
