import { TransformPreprocessorFn } from "../transform-preprocessor-fn";
import { createCombinedTransformPreprocessor } from "./create-combined-transform-preprocessor";

describe("createCombinedTransformPreprocessor", () => {
  it("should apply first specified preprocessor", () => {
    const processor1: TransformPreprocessorFn = (params) => {
      return {
        scale: Math.min(params.nextTransform.scale, 2),
        dx: params.nextTransform.dx,
        dy: params.nextTransform.dy,
      };
    };

    const processor2: TransformPreprocessorFn = (params) => {
      return {
        scale: Math.max(params.nextTransform.scale, 0.5),
        dx: params.nextTransform.dx,
        dy: params.nextTransform.dy,
      };
    };

    const preprocessor = createCombinedTransformPreprocessor([
      processor1,
      processor2,
    ]);

    const res = preprocessor({
      prevTransform: { scale: 1, dx: 0, dy: 0 },
      nextTransform: { scale: 3, dx: 0, dy: 0 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    expect(res).toStrictEqual({ scale: 2, dx: 0, dy: 0 });
  });

  it("should apply second specified preprocessor", () => {
    const processor1: TransformPreprocessorFn = (params) => {
      return {
        scale: Math.min(params.nextTransform.scale, 2),
        dx: params.nextTransform.dx,
        dy: params.nextTransform.dy,
      };
    };

    const processor2: TransformPreprocessorFn = (params) => {
      return {
        scale: Math.max(params.nextTransform.scale, 0.5),
        dx: params.nextTransform.dx,
        dy: params.nextTransform.dy,
      };
    };

    const preprocessor = createCombinedTransformPreprocessor([
      processor1,
      processor2,
    ]);

    const res = preprocessor({
      prevTransform: { scale: 1, dx: 0, dy: 0 },
      nextTransform: { scale: 0.1, dx: 0, dy: 0 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    expect(res).toStrictEqual({ scale: 0.5, dx: 0, dy: 0 });
  });
});
