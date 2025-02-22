import { TransformState } from "@/viewport-transformer";
import { createScaleLimitTransformPreprocessor } from "./create-scale-limit-transform-preprocessor";

describe("createScaleLimitTransformPreprocessor", () => {
  it("should create noop transform preprocessor when limits not specified", () => {
    const preprocessor = createScaleLimitTransformPreprocessor({
      minContentScale: null,
      maxContentScale: null,
    });

    const res = preprocessor({
      prevTransform: { scale: 1, x: 0, y: 0 },
      nextTransform: { scale: 2, x: 0, y: 0 },
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

  it("should not scale to less than minContentScale", () => {
    const preprocessor = createScaleLimitTransformPreprocessor({
      minContentScale: 0.5,
      maxContentScale: null,
    });

    const res = preprocessor({
      prevTransform: { scale: 1, x: 0, y: 0 },
      nextTransform: { scale: 10, x: 0, y: 0 },
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

  it("should not scale less when limit bypassed", () => {
    const preprocessor = createScaleLimitTransformPreprocessor({
      minContentScale: 0.5,
      maxContentScale: null,
    });

    const res = preprocessor({
      prevTransform: { scale: 10, x: 0, y: 0 },
      nextTransform: { scale: 20, x: 0, y: 0 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    const expected: TransformState = {
      scale: 10,
      x: 0,
      y: 0,
    };

    expect(res).toStrictEqual(expected);
  });

  it("should not scale more than maxContentScale", () => {
    const preprocessor = createScaleLimitTransformPreprocessor({
      minContentScale: null,
      maxContentScale: 2,
    });

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

  it("should not scale more when limit bypassed", () => {
    const preprocessor = createScaleLimitTransformPreprocessor({
      minContentScale: null,
      maxContentScale: 2,
    });

    const res = preprocessor({
      prevTransform: { scale: 0.2, x: 0, y: 0 },
      nextTransform: { scale: 0.1, x: 0, y: 0 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    const expected: TransformState = {
      scale: 0.2,
      x: 0,
      y: 0,
    };

    expect(res).toStrictEqual(expected);
  });
});
