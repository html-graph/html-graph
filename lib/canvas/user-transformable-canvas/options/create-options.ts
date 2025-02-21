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

  const defaultMouseDownEventVerifier =
    transformOptions?.shift?.mouseDownEventVerifier;

  const mouseDownEventVerifier =
    defaultMouseDownEventVerifier !== undefined
      ? defaultMouseDownEventVerifier
      : (event: MouseEvent): boolean => event.button === 0;

  const defaultMouseUpEventVerifier =
    transformOptions?.shift?.mouseUpEventVerifier;

  const mouseUpEventVerifier =
    defaultMouseUpEventVerifier !== undefined
      ? defaultMouseUpEventVerifier
      : (event: MouseEvent): boolean => event.button === 0;

  const defaultMouseWheelEventVerifier =
    transformOptions?.scale?.mouseWheelEventVerifier;

  const mouseWheelEventVerifier =
    defaultMouseWheelEventVerifier !== undefined
      ? defaultMouseWheelEventVerifier
      : (): boolean => true;

  return {
    wheelSensitivity: wheelSensitivity,
    onTransformStarted:
      transformOptions?.events?.onTransformStarted ?? ((): void => {}),
    onTransformFinished:
      transformOptions?.events?.onTransformFinished ?? ((): void => {}),
    onBeforeTransformChange: onBeforeTransformStarted,
    onTransformChange: onTransformFinished,
    transformPreprocessor,
    shiftCursor,
    mouseDownEventVerifier,
    mouseUpEventVerifier,
    mouseWheelEventVerifier,
  };
};
