import {
  createCombinedTransformPreprocessor,
  resolveTransformPreprocessor,
  TransformPayload,
  TransformPreprocessorFn,
  TransformPreprocessorParams,
} from "../preprocessors";
import { Options } from "./options";
import { TransformOptions } from "./transform-options";

export const createOptions = (
  transformOptions: TransformOptions | undefined,
): Options => {
  const wheelVelocity = transformOptions?.scale?.wheelSensitivity;
  const wheelSensitivity = wheelVelocity !== undefined ? wheelVelocity : 1.2;

  const preprocessors = transformOptions?.transformPreprocessor;

  let transformPreprocessor: TransformPreprocessorFn;

  if (preprocessors !== undefined) {
    if (Array.isArray(preprocessors)) {
      transformPreprocessor = createCombinedTransformPreprocessor(
        preprocessors.map((preprocessor) =>
          resolveTransformPreprocessor(preprocessor),
        ),
      );
    } else {
      transformPreprocessor = resolveTransformPreprocessor(preprocessors);
    }
  } else {
    transformPreprocessor = (
      params: TransformPreprocessorParams,
    ): TransformPayload => {
      return params.nextTransform;
    };
  }

  const shiftCursor =
    transformOptions?.shift?.cursor !== undefined
      ? transformOptions.shift.cursor
      : "grab";

  return {
    wheelSensitivity,
    onBeforeTransformStarted:
      transformOptions?.events?.onBeforeTransformStarted ?? ((): void => {}),
    onTransformFinished:
      transformOptions?.events?.onTransformFinished ?? ((): void => {}),
    transformPreprocessor,
    shiftCursor,
  };
};
