import { TransformState } from "@/viewport-store";
import { createShiftLimitTransformPreprocessor } from "./create-shift-limit-transform-preprocessor";

describe("createShiftLimitTransformPreprocessor", () => {
  it("should create noop transform preprocessor when limits not specified", () => {
    const preprocessor = createShiftLimitTransformPreprocessor({
      minX: null,
      maxX: null,
      minY: null,
      maxY: null,
    });

    const res = preprocessor({
      prevTransform: { scale: 1, x: 0, y: 0 },
      nextTransform: { scale: 1, x: 100, y: 100 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    const expected: TransformState = {
      scale: 1,
      x: 100,
      y: 100,
    };

    expect(res).toStrictEqual(expected);
  });

  it("should not transform horizontally to less than minX", () => {
    const preprocessor = createShiftLimitTransformPreprocessor({
      minX: -100,
      maxX: null,
      minY: null,
      maxY: null,
    });

    const res = preprocessor({
      prevTransform: { scale: 1, x: 0, y: 0 },
      nextTransform: { scale: 1, x: -200, y: 0 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    const expected: TransformState = {
      scale: 1,
      x: -100,
      y: 0,
    };

    expect(res).toStrictEqual(expected);
  });

  it("should not transform horizontally to less when limit bypassed", () => {
    const preprocessor = createShiftLimitTransformPreprocessor({
      minX: -100,
      maxX: null,
      minY: null,
      maxY: null,
    });

    const res = preprocessor({
      prevTransform: { scale: 1, x: -200, y: 0 },
      nextTransform: { scale: 1, x: -300, y: 0 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    const expected: TransformState = {
      scale: 1,
      x: -200,
      y: 0,
    };

    expect(res).toStrictEqual(expected);
  });

  it("should not transform horizontally to more than maxX", () => {
    const preprocessor = createShiftLimitTransformPreprocessor({
      minX: null,
      maxX: 600,
      minY: null,
      maxY: null,
    });

    const res = preprocessor({
      prevTransform: { scale: 1, x: 0, y: 0 },
      nextTransform: { scale: 1, x: 200, y: 0 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    const expected: TransformState = {
      scale: 1,
      x: 100,
      y: 0,
    };

    expect(res).toStrictEqual(expected);
  });

  it("should not transform horizontally to more when limit bypassed", () => {
    const preprocessor = createShiftLimitTransformPreprocessor({
      minX: null,
      maxX: 600,
      minY: null,
      maxY: null,
    });

    const res = preprocessor({
      prevTransform: { scale: 1, x: 200, y: 0 },
      nextTransform: { scale: 1, x: 300, y: 0 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    const expected: TransformState = {
      scale: 1,
      x: 200,
      y: 0,
    };

    expect(res).toStrictEqual(expected);
  });

  it("should not transform vertically to less than minY", () => {
    const preprocessor = createShiftLimitTransformPreprocessor({
      minX: null,
      maxX: null,
      minY: -100,
      maxY: null,
    });

    const res = preprocessor({
      prevTransform: { scale: 1, x: 0, y: 0 },
      nextTransform: { scale: 1, x: 0, y: -200 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    const expected: TransformState = {
      scale: 1,
      x: 0,
      y: -100,
    };

    expect(res).toStrictEqual(expected);
  });

  it("should not transform vertically to less when limit bypassed", () => {
    const preprocessor = createShiftLimitTransformPreprocessor({
      minX: null,
      maxX: null,
      minY: -100,
      maxY: null,
    });

    const res = preprocessor({
      prevTransform: { scale: 1, x: 0, y: -200 },
      nextTransform: { scale: 1, x: 0, y: -300 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    const expected: TransformState = {
      scale: 1,
      x: 0,
      y: -200,
    };

    expect(res).toStrictEqual(expected);
  });

  it("should not transform vertically to more than maxY", () => {
    const preprocessor = createShiftLimitTransformPreprocessor({
      minX: null,
      maxX: null,
      minY: null,
      maxY: 600,
    });

    const res = preprocessor({
      prevTransform: { scale: 1, x: 0, y: 0 },
      nextTransform: { scale: 1, x: 0, y: 200 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    const expected: TransformState = {
      scale: 1,
      x: 0,
      y: 100,
    };

    expect(res).toStrictEqual(expected);
  });

  it("should not transform vertically to more when limit bypassed", () => {
    const preprocessor = createShiftLimitTransformPreprocessor({
      minX: null,
      maxX: null,
      minY: null,
      maxY: 600,
    });

    const res = preprocessor({
      prevTransform: { scale: 1, x: 0, y: 200 },
      nextTransform: { scale: 1, x: 0, y: 300 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    const expected: TransformState = {
      scale: 1,
      x: 0,
      y: 200,
    };

    expect(res).toStrictEqual(expected);
  });
});
