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
      prevTransform: { scale: 1, dx: 0, dy: 0 },
      nextTransform: { scale: 1, dx: 100, dy: 100 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    expect(res).toStrictEqual({ scale: 1, dx: 100, dy: 100 });
  });

  it("should not transform horizontally to less than minX", () => {
    const preprocessor = createShiftLimitTransformPreprocessor({
      minX: -100,
      maxX: null,
      minY: null,
      maxY: null,
    });

    const res = preprocessor({
      prevTransform: { scale: 1, dx: 0, dy: 0 },
      nextTransform: { scale: 1, dx: -200, dy: 0 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    expect(res).toStrictEqual({ scale: 1, dx: -100, dy: 0 });
  });

  it("should not transform horizontally to less when limit passed", () => {
    const preprocessor = createShiftLimitTransformPreprocessor({
      minX: -100,
      maxX: null,
      minY: null,
      maxY: null,
    });

    const res = preprocessor({
      prevTransform: { scale: 1, dx: -200, dy: 0 },
      nextTransform: { scale: 1, dx: -300, dy: 0 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    expect(res).toStrictEqual({ scale: 1, dx: -200, dy: 0 });
  });

  it("should not transform horizontally to more than maxX", () => {
    const preprocessor = createShiftLimitTransformPreprocessor({
      minX: null,
      maxX: 600,
      minY: null,
      maxY: null,
    });

    const res = preprocessor({
      prevTransform: { scale: 1, dx: 0, dy: 0 },
      nextTransform: { scale: 1, dx: 200, dy: 0 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    expect(res).toStrictEqual({ scale: 1, dx: 100, dy: 0 });
  });

  it("should not transform horizontally to more when limit passed", () => {
    const preprocessor = createShiftLimitTransformPreprocessor({
      minX: null,
      maxX: 600,
      minY: null,
      maxY: null,
    });

    const res = preprocessor({
      prevTransform: { scale: 1, dx: 200, dy: 0 },
      nextTransform: { scale: 1, dx: 300, dy: 0 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    expect(res).toStrictEqual({ scale: 1, dx: 200, dy: 0 });
  });

  it("should not transform vertically to less than minY", () => {
    const preprocessor = createShiftLimitTransformPreprocessor({
      minX: null,
      maxX: null,
      minY: -100,
      maxY: null,
    });

    const res = preprocessor({
      prevTransform: { scale: 1, dx: 0, dy: 0 },
      nextTransform: { scale: 1, dx: 0, dy: -200 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    expect(res).toStrictEqual({ scale: 1, dx: 0, dy: -100 });
  });

  it("should not transform vertically to less when limit passed", () => {
    const preprocessor = createShiftLimitTransformPreprocessor({
      minX: null,
      maxX: null,
      minY: -100,
      maxY: null,
    });

    const res = preprocessor({
      prevTransform: { scale: 1, dx: 0, dy: -200 },
      nextTransform: { scale: 1, dx: 0, dy: -300 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    expect(res).toStrictEqual({ scale: 1, dx: 0, dy: -200 });
  });

  it("should not transform vertically to more than maxY", () => {
    const preprocessor = createShiftLimitTransformPreprocessor({
      minX: null,
      maxX: null,
      minY: null,
      maxY: 600,
    });

    const res = preprocessor({
      prevTransform: { scale: 1, dx: 0, dy: 0 },
      nextTransform: { scale: 1, dx: 0, dy: 200 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    expect(res).toStrictEqual({ scale: 1, dx: 0, dy: 100 });
  });

  it("should not transform vertically to more when limit passed", () => {
    const preprocessor = createShiftLimitTransformPreprocessor({
      minX: null,
      maxX: null,
      minY: null,
      maxY: 600,
    });

    const res = preprocessor({
      prevTransform: { scale: 1, dx: 0, dy: 200 },
      nextTransform: { scale: 1, dx: 0, dy: 300 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    expect(res).toStrictEqual({ scale: 1, dx: 0, dy: 200 });
  });
});
