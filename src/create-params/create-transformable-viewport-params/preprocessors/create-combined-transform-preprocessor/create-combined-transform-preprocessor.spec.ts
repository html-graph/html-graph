import { TransformState } from "@/viewport-store";
import { TransformPreprocessorFn } from "@/configurators";
import { createCombinedTransformPreprocessor } from "./create-combined-transform-preprocessor";

describe("createCombinedTransformPreprocessor", () => {
  it("should apply first specified preprocessor", () => {
    const processor1: TransformPreprocessorFn = (params) => {
      return {
        scale: Math.min(params.nextTransform.scale, 2),
        x: params.nextTransform.x,
        y: params.nextTransform.y,
      };
    };

    const processor2: TransformPreprocessorFn = (params) => {
      return {
        scale: Math.max(params.nextTransform.scale, 0.5),
        x: params.nextTransform.x,
        y: params.nextTransform.y,
      };
    };

    const preprocessor = createCombinedTransformPreprocessor([
      processor1,
      processor2,
    ]);

    const res = preprocessor({
      prevTransform: { scale: 1, x: 0, y: 0 },
      nextTransform: { scale: 3, x: 0, y: 0 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    const expected: TransformState = {
      scale: 2,
      x: 0,
      y: 0,
    };

    expect(res).toStrictEqual(expected);
  });

  it("should apply second specified preprocessor", () => {
    const processor1: TransformPreprocessorFn = (params) => {
      return {
        scale: Math.min(params.nextTransform.scale, 2),
        x: params.nextTransform.x,
        y: params.nextTransform.y,
      };
    };

    const processor2: TransformPreprocessorFn = (params) => {
      return {
        scale: Math.max(params.nextTransform.scale, 0.5),
        x: params.nextTransform.x,
        y: params.nextTransform.y,
      };
    };

    const preprocessor = createCombinedTransformPreprocessor([
      processor1,
      processor2,
    ]);

    const res = preprocessor({
      prevTransform: { scale: 1, x: 0, y: 0 },
      nextTransform: { scale: 0.1, x: 0, y: 0 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    const expected: TransformState = {
      scale: 0.5,
      x: 0,
      y: 0,
    };

    expect(res).toStrictEqual(expected);
  });
});
