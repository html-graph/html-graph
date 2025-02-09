import { TransformPreprocessorFn } from "../preprocessors";
import { resolveTransformPreprocessor } from "./resolve-transform-preprocessor";

describe("olveransformPreprocessor", () => {
  it("should resolve custom transform preprocessor", () => {
    const preprocessorFn: TransformPreprocessorFn = (params) => {
      return params.nextTransform;
    };

    const preprocessor = resolveTransformPreprocessor(preprocessorFn);

    expect(preprocessor).toBe(preprocessorFn);
  });

  it("should resolve shift limit transform preprocessor", () => {
    const preprocessor = resolveTransformPreprocessor({
      type: "shift-limit",
      minX: -100,
    });

    const res = preprocessor({
      prevTransform: { scale: 1, dx: 0, dy: 0 },
      nextTransform: { scale: 1, dx: -200, dy: 0 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    expect(res.dx).toBe(-100);
  });

  it("should resolve scale limit transform preprocessor", () => {
    const preprocessor = resolveTransformPreprocessor({
      type: "scale-limit",
      minContentScale: 0.5,
    });

    const res = preprocessor({
      prevTransform: { scale: 1, dx: 0, dy: 0 },
      nextTransform: { scale: 10, dx: 0, dy: 0 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    expect(res.scale).toBe(2);
  });

  it("should regard minContentScale as 0 when not specified", () => {
    const preprocessor = resolveTransformPreprocessor({
      type: "scale-limit",
    });

    const res = preprocessor({
      prevTransform: { scale: 1, dx: 0, dy: 0 },
      nextTransform: { scale: 10, dx: 0, dy: 0 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    expect(res.scale).toBe(10);
  });

  it("should regard maxContentScale as Infinity when not specified", () => {
    const preprocessor = resolveTransformPreprocessor({
      type: "scale-limit",
    });

    const res = preprocessor({
      prevTransform: { scale: 1, dx: 0, dy: 0 },
      nextTransform: { scale: 0.001, dx: 0, dy: 0 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    expect(res.scale).toBe(0.001);
  });

  it("should minX as -Infinity when not specified", () => {
    const preprocessor = resolveTransformPreprocessor({
      type: "shift-limit",
    });

    const res = preprocessor({
      prevTransform: { scale: 1, dx: 0, dy: 0 },
      nextTransform: { scale: 1, dx: -1_000_000, dy: 0 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    expect(res.dx).toBe(-1_000_000);
  });

  it("should maxX as Infinity when not specified", () => {
    const preprocessor = resolveTransformPreprocessor({
      type: "shift-limit",
    });

    const res = preprocessor({
      prevTransform: { scale: 1, dx: 0, dy: 0 },
      nextTransform: { scale: 1, dx: 1_000_000, dy: 0 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    expect(res.dx).toBe(1_000_000);
  });

  it("should minY as -Infinity when not specified", () => {
    const preprocessor = resolveTransformPreprocessor({
      type: "shift-limit",
    });

    const res = preprocessor({
      prevTransform: { scale: 1, dx: 0, dy: 0 },
      nextTransform: { scale: 1, dx: 0, dy: -1_000_000 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    expect(res.dy).toBe(-1_000_000);
  });

  it("should maxY as Infinity when not specified", () => {
    const preprocessor = resolveTransformPreprocessor({
      type: "shift-limit",
    });

    const res = preprocessor({
      prevTransform: { scale: 1, dx: 0, dy: 0 },
      nextTransform: { scale: 1, dx: 0, dy: 1_000_000 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    expect(res.dy).toBe(1_000_000);
  });
});
