import { describe, expect, it, vi } from "vitest";
import { TransformState } from "@/viewport-store";
import { createUserTransformableViewportParams } from "./create-user-transformable-viewport-params";
import { UserTransformableViewportConfig } from "./user-transformable-viewport-config";
import { TransformPreprocessorParams } from "@/configurators";
import { lmbMouseEventVerifier, lmbNoCtrlMouseEventVerifier } from "../shared";

describe("createUserTransformableViewportParams", () => {
  it("should set default wheel velocity if not specified", () => {
    const res = createUserTransformableViewportParams(undefined);

    expect(res.wheelSensitivity).toBe(1.2);
  });

  it("should set specified wheel velocity", () => {
    const res = createUserTransformableViewportParams({
      zoom: {
        mouseWheelSensitivity: 1.5,
      },
    });

    expect(res.wheelSensitivity).toBe(1.5);
  });

  it("should set deprecated specified wheel velocity", () => {
    const res = createUserTransformableViewportParams({
      scale: {
        mouseWheelSensitivity: 1.5,
      },
    });

    expect(res.wheelSensitivity).toBe(1.5);
  });

  it("should set noop transform preprocessor if not specified", () => {
    const res = createUserTransformableViewportParams(undefined);

    const preprocessor = res.transformPreprocessor;

    const matrix = preprocessor({
      prevTransform: { scale: 1, x: 0, y: 0 },
      nextTransform: { scale: 1_000_000, x: 1_000_000, y: 1_000_000 },
      viewport: {
        width: 500,
        height: 500,
      },
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
    ): TransformState => {
      return params.nextTransform;
    };

    const fn = vi.fn(transformPreprocessor);

    const res = createUserTransformableViewportParams({
      transformPreprocessor: fn,
    });

    const preprocessor = res.transformPreprocessor;

    preprocessor({
      prevTransform: { scale: 1, x: 0, y: 0 },
      nextTransform: { scale: 2, x: 3, y: 4 },
      viewport: {
        width: 500,
        height: 500,
      },
    });

    expect(fn).toHaveBeenCalled();
  });

  it("should set specified multiple transform preprocessor", () => {
    const transformPreprocessor = (
      params: TransformPreprocessorParams,
    ): TransformState => {
      return params.nextTransform;
    };

    const fn = vi.fn(transformPreprocessor);

    const res = createUserTransformableViewportParams({
      transformPreprocessor: [fn, fn],
    });

    const preprocessor = res.transformPreprocessor;

    preprocessor({
      prevTransform: { scale: 1, x: 0, y: 0 },
      nextTransform: { scale: 2, x: 3, y: 4 },
      viewport: {
        width: 500,
        height: 500,
      },
    });

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("should set default shift cursor if not specified", () => {
    const res = createUserTransformableViewportParams(undefined);

    expect(res.shiftCursor).toBe("grab");
  });

  it("should set specified shift cursor", () => {
    const res = createUserTransformableViewportParams({
      pan: {
        cursor: "crosshair",
      },
    });

    expect(res.shiftCursor).toBe("crosshair");
  });

  it("should set specified onBeforeTransformChange", () => {
    const onBeforeTransformChange = (): void => {};

    const res = createUserTransformableViewportParams({
      events: {
        onBeforeTransformChange,
      },
    });

    expect(res.onBeforeTransformChange).toBe(onBeforeTransformChange);
  });

  it("should set specified onTransformChange", () => {
    const onTransformChange = (): void => {};

    const res = createUserTransformableViewportParams({
      events: {
        onTransformChange,
      },
    });

    expect(res.onTransformChange).toBe(onTransformChange);
  });

  it("should set specified onTransformStarted", () => {
    const onTransformStarted = (): void => {};

    const res = createUserTransformableViewportParams({
      events: {
        onTransformStarted,
      },
    });

    expect(res.onTransformStarted).toBe(onTransformStarted);
  });

  it("should set specified onTransformFinished", () => {
    const onTransformFinished = (): void => {};

    const res = createUserTransformableViewportParams({
      events: {
        onTransformFinished,
      },
    });

    expect(res.onTransformFinished).toBe(onTransformFinished);
  });

  it("should set lmb no ctrl mouse down event verifier by default", () => {
    const options = createUserTransformableViewportParams({});
    const verifier = options.mouseDownEventVerifier;

    expect(verifier).toBe(lmbNoCtrlMouseEventVerifier);
  });

  it("should set specified mouse down event validator", () => {
    const mouseDownEventVerifier = (): boolean => false;

    const transformOptions: UserTransformableViewportConfig = {
      pan: {
        mouseDownEventVerifier,
      },
    };

    const options = createUserTransformableViewportParams(transformOptions);

    expect(options.mouseDownEventVerifier).toBe(mouseDownEventVerifier);
  });

  it("should set lmb mouse up event verifier by default", () => {
    const options = createUserTransformableViewportParams({});
    const verifier = options.mouseUpEventVerifier;

    expect(verifier).toEqual(lmbMouseEventVerifier);
  });

  it("should set specified mouse up event validator", () => {
    const mouseUpEventVerifier = (): boolean => false;

    const transformOptions: UserTransformableViewportConfig = {
      pan: {
        mouseUpEventVerifier,
      },
    };

    const options = createUserTransformableViewportParams(transformOptions);

    expect(options.mouseUpEventVerifier).toBe(mouseUpEventVerifier);
  });

  it("should set default mouse wheel event validator", () => {
    const options = createUserTransformableViewportParams({});

    expect(options.mouseWheelEventVerifier(new WheelEvent(""))).toBe(true);
  });

  it("should set specified mouse wheel event validator", () => {
    const mouseWheelEventVerifier = (): boolean => false;

    const transformOptions: UserTransformableViewportConfig = {
      zoom: {
        mouseWheelEventVerifier,
      },
    };

    const options = createUserTransformableViewportParams(transformOptions);

    expect(options.mouseWheelEventVerifier).toBe(mouseWheelEventVerifier);
  });

  it("should set default mouse wheel finish timeout", () => {
    const options = createUserTransformableViewportParams({});

    expect(options.scaleWheelFinishTimeout).toBe(500);
  });

  it("should set specified mouse wheel finish timeout", () => {
    const transformOptions: UserTransformableViewportConfig = {
      zoom: {
        wheelFinishTimeout: 1000,
      },
    };

    const options = createUserTransformableViewportParams(transformOptions);

    expect(options.scaleWheelFinishTimeout).toBe(1000);
  });

  it("should set deprecated specified mouse wheel finish timeout", () => {
    const transformOptions: UserTransformableViewportConfig = {
      scale: {
        wheelFinishTimeout: 1000,
      },
    };

    const options = createUserTransformableViewportParams(transformOptions);

    expect(options.scaleWheelFinishTimeout).toBe(1000);
  });

  it("should set deprecated specified mouse wheel event validator", () => {
    const mouseWheelEventVerifier = (): boolean => false;

    const transformOptions: UserTransformableViewportConfig = {
      scale: {
        mouseWheelEventVerifier,
      },
    };

    const options = createUserTransformableViewportParams(transformOptions);

    expect(options.mouseWheelEventVerifier).toBe(mouseWheelEventVerifier);
  });

  it("should set default scale wheel timeout", () => {
    const res = createUserTransformableViewportParams(undefined);

    expect(res.scaleWheelFinishTimeout).toBe(500);
  });

  it("should set specified onResizeTransformStarted", () => {
    const onResizeTransformStarted = (): void => {};

    const res = createUserTransformableViewportParams({
      events: {
        onResizeTransformStarted,
      },
    });

    expect(res.onResizeTransformStarted).toBe(onResizeTransformStarted);
  });

  it("should set specified onResizeTransformFinished", () => {
    const onResizeTransformFinished = (): void => {};

    const res = createUserTransformableViewportParams({
      events: {
        onResizeTransformFinished,
      },
    });

    expect(res.onResizeTransformFinished).toBe(onResizeTransformFinished);
  });
});
