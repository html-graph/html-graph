import { TransformPreprocessorFn } from "../preprocessors";
import { BeforeTransformChangeFn } from "./before-transform-change-fn";
import { TransformChangeFn } from "./transform-change-fn";

export interface Options {
  readonly wheelSensitivity: number;
  readonly onBeforeTransformStarted: BeforeTransformChangeFn;
  readonly onTransformFinished: TransformChangeFn;
  readonly transformPreprocessor: TransformPreprocessorFn;
  readonly shiftCursor: string | null;
}
