import {
  createCombinedTransformPreprocessor,
  TransformPayload,
  TransformPreprocessorFn,
  TransformPreprocessorParams,
} from "../preprocessors";
import { resolveTransformPreprocessor } from "../resolve-transform-preprocessor";
import { Options } from "./options";
import { TransformOptions } from "./transform-options";

export const createOptions = (
  transformOptions: TransformOptions | undefined,
): Options => {
  const optionsWheelSensitivity =
    transformOptions?.scale?.mouseWheelSensitivity;
  const wheelSensitivity =
    optionsWheelSensitivity !== undefined ? optionsWheelSensitivity : 1.2;

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

  const onBeforeTransformStarted =
    transformOptions?.events?.onBeforeTransformChange ?? ((): void => {});

  const onTransformFinished =
    transformOptions?.events?.onTransformChange ?? ((): void => {});

  return {
    wheelSensitivity: wheelSensitivity,
    onBeforeTransformStarted,
    onTransformFinished,
    transformPreprocessor,
    shiftCursor,
  };
};
