import {
  createCombinedTransformPreprocessor,
  TransformPayload,
  TransformPreprocessorFn,
  TransformPreprocessorParams,
} from "../preprocessors";
import { resolveTransformPreprocessor } from "../resolve-transform-preprocessor";
import { TransformableViewportParams } from "../transformable-viewport-params";
import { ViewportTransformConfig } from "./viewport-transform-config";

export const createTransformableViewportParams = (
  transformConfig: ViewportTransformConfig | undefined,
): TransformableViewportParams => {
  const configWheelSensitivity = transformConfig?.scale?.mouseWheelSensitivity;
  const wheelSensitivity =
    configWheelSensitivity !== undefined ? configWheelSensitivity : 1.2;

  const preprocessors = transformConfig?.transformPreprocessor;

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
    transformConfig?.shift?.cursor !== undefined
      ? transformConfig.shift.cursor
      : "grab";

  const onBeforeTransformStarted =
    transformConfig?.events?.onBeforeTransformChange ?? ((): void => {});

  const onTransformFinished =
    transformConfig?.events?.onTransformChange ?? ((): void => {});

  const defaultMouseDownEventVerifier =
    transformConfig?.shift?.mouseDownEventVerifier;

  const mouseDownEventVerifier =
    defaultMouseDownEventVerifier !== undefined
      ? defaultMouseDownEventVerifier
      : (event: MouseEvent): boolean => event.button === 0;

  const defaultMouseUpEventVerifier =
    transformConfig?.shift?.mouseUpEventVerifier;

  const mouseUpEventVerifier =
    defaultMouseUpEventVerifier !== undefined
      ? defaultMouseUpEventVerifier
      : (event: MouseEvent): boolean => event.button === 0;

  const defaultMouseWheelEventVerifier =
    transformConfig?.scale?.mouseWheelEventVerifier;

  const mouseWheelEventVerifier =
    defaultMouseWheelEventVerifier !== undefined
      ? defaultMouseWheelEventVerifier
      : (): boolean => true;

  return {
    wheelSensitivity: wheelSensitivity,
    onTransformStarted:
      transformConfig?.events?.onTransformStarted ?? ((): void => {}),
    onTransformFinished:
      transformConfig?.events?.onTransformFinished ?? ((): void => {}),
    onBeforeTransformChange: onBeforeTransformStarted,
    onTransformChange: onTransformFinished,
    transformPreprocessor,
    shiftCursor,
    mouseDownEventVerifier,
    mouseUpEventVerifier,
    mouseWheelEventVerifier,
    scaleWheelFinishTimeout: transformConfig?.scale?.wheelFinishTimeout ?? 500,
    onResizeTransformStarted:
      transformConfig?.events?.onResizeTransformStarted ?? ((): void => {}),
    onResizeTransformFinished:
      transformConfig?.events?.onResizeTransformFinished ?? ((): void => {}),
  };
};
