import {
  TransformableViewportParams,
  TransformPreprocessorFn,
  TransformPreprocessorParams,
} from "@/configurators";
import { createCombinedTransformPreprocessor } from "./preprocessors";
import { resolveTransformPreprocessor } from "./resolve-transform-preprocessor";
import { ViewportTransformConfig } from "./viewport-transform-config";
import { TransformState } from "@/viewport-store";
import {
  lmbMouseEventVerifier,
  lmbNoCtrlMouseEventVerifier,
  noopFn,
} from "../shared";

export const createTransformableViewportParams = (
  transformConfig: ViewportTransformConfig | undefined,
): TransformableViewportParams => {
  const preprocessors = transformConfig?.transformPreprocessor;

  let transformPreprocessor: TransformPreprocessorFn;

  if (preprocessors !== undefined) {
    if (Array.isArray(preprocessors)) {
      transformPreprocessor = createCombinedTransformPreprocessor(
        preprocessors.map((preprocessor) => {
          return resolveTransformPreprocessor(preprocessor);
        }),
      );
    } else {
      transformPreprocessor = resolveTransformPreprocessor(preprocessors);
    }
  } else {
    transformPreprocessor = (
      params: TransformPreprocessorParams,
    ): TransformState => {
      return params.nextTransform;
    };
  }

  return {
    wheelSensitivity: transformConfig?.scale?.mouseWheelSensitivity ?? 1.2,
    onTransformStarted: transformConfig?.events?.onTransformStarted ?? noopFn,
    onTransformFinished: transformConfig?.events?.onTransformFinished ?? noopFn,
    onBeforeTransformChange:
      transformConfig?.events?.onBeforeTransformChange ?? noopFn,
    onTransformChange: transformConfig?.events?.onTransformChange ?? noopFn,
    transformPreprocessor,
    shiftCursor: transformConfig?.pan?.cursor ?? "grab",
    mouseDownEventVerifier:
      transformConfig?.pan?.mouseDownEventVerifier ??
      lmbNoCtrlMouseEventVerifier,
    mouseUpEventVerifier:
      transformConfig?.pan?.mouseUpEventVerifier ?? lmbMouseEventVerifier,
    mouseWheelEventVerifier:
      transformConfig?.scale?.mouseWheelEventVerifier ?? ((): boolean => true),
    scaleWheelFinishTimeout: transformConfig?.scale?.wheelFinishTimeout ?? 500,
    onResizeTransformStarted:
      transformConfig?.events?.onResizeTransformStarted ?? noopFn,
    onResizeTransformFinished:
      transformConfig?.events?.onResizeTransformFinished ?? noopFn,
  };
};
