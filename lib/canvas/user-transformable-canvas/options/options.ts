import { TransformPreprocessorFn } from "../preprocessors";
import { BeforeTransformChangeFn } from "./before-transform-change-fn";
import { TransformChangeFn } from "./transform-change-fn";

export interface Options {
  readonly wheelSensitivity: number;
  readonly onTransformStarted: () => void;
  readonly onTransformFinished: () => void;
  readonly onBeforeTransformChange: BeforeTransformChangeFn;
  readonly onTransformChange: TransformChangeFn;
  readonly transformPreprocessor: TransformPreprocessorFn;
  readonly shiftCursor: string | null;
}
