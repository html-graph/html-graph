import { TransformPreprocessorFn } from "@/configurators";
import { resolveTransformPreprocessor } from "./resolve-transform-preprocessor";

describe("resolveTransformPreprocessor", () => {
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
      prevTransform: { scale: 1, x: 0, y: 0 },
      nextTransform: { scale: 1, x: -200, y: 0 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    expect(res.x).toBe(-100);
  });

  it("should resolve scale limit transform preprocessor", () => {
    const preprocessor = resolveTransformPreprocessor({
      type: "scale-limit",
      minContentScale: 0.5,
    });

    const res = preprocessor({
      prevTransform: { scale: 1, x: 0, y: 0 },
      nextTransform: { scale: 10, x: 0, y: 0 },
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
      prevTransform: { scale: 1, x: 0, y: 0 },
      nextTransform: { scale: 10, x: 0, y: 0 },
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
      prevTransform: { scale: 1, x: 0, y: 0 },
      nextTransform: { scale: 0.001, x: 0, y: 0 },
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
      prevTransform: { scale: 1, x: 0, y: 0 },
      nextTransform: { scale: 1, x: -1_000_000, y: 0 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    expect(res.x).toBe(-1_000_000);
  });

  it("should maxX as Infinity when not specified", () => {
    const preprocessor = resolveTransformPreprocessor({
      type: "shift-limit",
    });

    const res = preprocessor({
      prevTransform: { scale: 1, x: 0, y: 0 },
      nextTransform: { scale: 1, x: 1_000_000, y: 0 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    expect(res.x).toBe(1_000_000);
  });

  it("should minY as -Infinity when not specified", () => {
    const preprocessor = resolveTransformPreprocessor({
      type: "shift-limit",
    });

    const res = preprocessor({
      prevTransform: { scale: 1, x: 0, y: 0 },
      nextTransform: { scale: 1, x: 0, y: -1_000_000 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    expect(res.y).toBe(-1_000_000);
  });

  it("should maxY as Infinity when not specified", () => {
    const preprocessor = resolveTransformPreprocessor({
      type: "shift-limit",
    });

    const res = preprocessor({
      prevTransform: { scale: 1, x: 0, y: 0 },
      nextTransform: { scale: 1, x: 0, y: 1_000_000 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    expect(res.y).toBe(1_000_000);
  });
});
