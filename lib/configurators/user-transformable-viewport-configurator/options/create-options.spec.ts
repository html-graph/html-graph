import { TransformState } from "@/viewport-store";
import {
  TransformPayload,
  TransformPreprocessorParams,
} from "../preprocessors";
import { createOptions } from "./create-options";
import { TransformOptions } from "./transform-options";

describe("createOptions", () => {
  it("should set default wheel velocity if not specified", () => {
    const res = createOptions(undefined);

    expect(res.wheelSensitivity).toBe(1.2);
  });

  it("should set specified wheel velocity", () => {
    const res = createOptions({
      scale: {
        mouseWheelSensitivity: 1.5,
      },
    });

    expect(res.wheelSensitivity).toBe(1.5);
  });

  it("should set noop transform preprocessor if not specified", () => {
    const res = createOptions(undefined);

    const preprocessor = res.transformPreprocessor;

    const matrix = preprocessor({
      prevTransform: { scale: 1, x: 0, y: 0 },
      nextTransform: { scale: 1_000_000, x: 1_000_000, y: 1_000_000 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    const expected: TransformState = {
      scale: 1_000_000,
      x: 1_000_000,
      y: 1_000_000,
    };

    expect(matrix).toStrictEqual(expected);
  });

  it("should set specified single transform preprocessor", () => {
    const transformPreprocessor = (
      params: TransformPreprocessorParams,
    ): TransformPayload => {
      return params.nextTransform;
    };

    const fn = jest.fn(transformPreprocessor);

    const res = createOptions({
      transformPreprocessor: fn,
    });

    const preprocessor = res.transformPreprocessor;

    preprocessor({
      prevTransform: { scale: 1, x: 0, y: 0 },
      nextTransform: { scale: 2, x: 3, y: 4 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    expect(fn).toHaveBeenCalled();
  });

  it("should set specified multiple transform preprocessor", () => {
    const transformPreprocessor = (
      params: TransformPreprocessorParams,
    ): TransformPayload => {
      return params.nextTransform;
    };

    const fn = jest.fn(transformPreprocessor);

    const res = createOptions({
      transformPreprocessor: [fn, fn],
    });

    const preprocessor = res.transformPreprocessor;

    preprocessor({
      prevTransform: { scale: 1, x: 0, y: 0 },
      nextTransform: { scale: 2, x: 3, y: 4 },
      canvasWidth: 500,
      canvasHeight: 500,
    });

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("should set default shift cursor if not specified", () => {
    const res = createOptions(undefined);

    expect(res.shiftCursor).toBe("grab");
  });

  it("should set specified shift cursor", () => {
    const res = createOptions({
      shift: {
        cursor: "crosshair",
      },
    });

    expect(res.shiftCursor).toBe("crosshair");
  });

  it("should set specified onBeforeTransformChange", () => {
    const onBeforeTransformChange = (): void => {};

    const res = createOptions({
      events: {
        onBeforeTransformChange,
      },
    });

    expect(res.onBeforeTransformChange).toBe(onBeforeTransformChange);
  });

  it("should set specified onTransformChange", () => {
    const onTransformChange = (): void => {};

    const res = createOptions({
      events: {
        onTransformChange,
      },
    });

    expect(res.onTransformChange).toBe(onTransformChange);
  });

  it("should set specified onTransformStarted", () => {
    const onTransformStarted = (): void => {};

    const res = createOptions({
      events: {
        onTransformStarted,
      },
    });

    expect(res.onTransformStarted).toBe(onTransformStarted);
  });

  it("should set specified onTransformFinished", () => {
    const onTransformFinished = (): void => {};

    const res = createOptions({
      events: {
        onTransformFinished,
      },
    });

    expect(res.onTransformFinished).toBe(onTransformFinished);
  });

  it("should set default mouse down event validator", () => {
    const mouseDownEventVerifier = (): boolean => false;

    const transformOptions: TransformOptions = {
      shift: {
        mouseDownEventVerifier,
      },
    };

    const options = createOptions(transformOptions);

    expect(options.mouseDownEventVerifier).toBe(mouseDownEventVerifier);
  });

  it("should set default mouse up event validator", () => {
    const mouseUpEventVerifier = (): boolean => false;

    const transformOptions: TransformOptions = {
      shift: {
        mouseUpEventVerifier,
      },
    };

    const options = createOptions(transformOptions);

    expect(options.mouseUpEventVerifier).toBe(mouseUpEventVerifier);
  });

  it("should set default mouse wheel event validator", () => {
    const mouseWheelEventVerifier = (): boolean => false;

    const transformOptions: TransformOptions = {
      scale: {
        mouseWheelEventVerifier,
      },
    };

    const options = createOptions(transformOptions);

    expect(options.mouseWheelEventVerifier).toBe(mouseWheelEventVerifier);
  });

  it("should set default scale wheel timeout", () => {
    const res = createOptions(undefined);

    expect(res.scaleWheelFinishTimeout).toBe(500);
  });

  it("should set specified onResizeTransformStarted", () => {
    const onResizeTransformStarted = (): void => {};

    const res = createOptions({
      events: {
        onResizeTransformStarted,
      },
    });

    expect(res.onResizeTransformStarted).toBe(onResizeTransformStarted);
  });

  it("should set specified onResizeTransformFinished", () => {
    const onResizeTransformFinished = (): void => {};

    const res = createOptions({
      events: {
        onResizeTransformFinished,
      },
    });

    expect(res.onResizeTransformFinished).toBe(onResizeTransformFinished);
  });
});
