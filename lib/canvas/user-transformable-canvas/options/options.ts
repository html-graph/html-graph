import { TransformPreprocessorFn } from "../preprocessors";
import { BeforeTransformStartedFn } from "./before-transform-started-fn";
import { TransformFinishedFn } from "./transform-finished-fn";

export interface Options {
  readonly wheelSensitivity: number;
  readonly onBeforeTransformStarted: BeforeTransformStartedFn;
  readonly onTransformFinished: TransformFinishedFn;
  readonly transformPreprocessor: TransformPreprocessorFn;
  readonly shiftCursor: string | null;
}
