import { describe, expect, it } from "vitest";
import { createRectangularSelectionParams } from "./create-rectangular-selection-params";
import { noopFn } from "../shared";
import { lmbCtrlMouseEventVerifier } from "../shared";
import { lmbMouseEventVerifier } from "../shared";

describe("createRectangularSelectionParams", () => {
  it("should set noop function for onSelectionStarted by default", () => {
    const params = createRectangularSelectionParams({});

    expect(params.onSelectionStarted).toBe(noopFn);
  });

  it("should set specified function for onSelectionStarted", () => {
    const onSelectionStarted = (): void => {};
    const params = createRectangularSelectionParams({ onSelectionStarted });

    expect(params.onSelectionStarted).toBe(onSelectionStarted);
  });

  it("should set noop function for onSelectionChange by default", () => {
    const params = createRectangularSelectionParams({});

    expect(params.onSelectionChange).toBe(noopFn);
  });

  it("should set specified function for onSelectionChange", () => {
    const onSelectionChange = (): void => {};
    const params = createRectangularSelectionParams({ onSelectionChange });

    expect(params.onSelectionChange).toBe(onSelectionChange);
  });

  it("should set noop function for onSelectionFinished by default", () => {
    const params = createRectangularSelectionParams({});

    expect(params.onSelectionFinished).toBe(noopFn);
  });

  it("should set specified function for onSelectionFinished", () => {
    const onSelectionFinished = (): void => {};
    const params = createRectangularSelectionParams({ onSelectionFinished });

    expect(params.onSelectionFinished).toBe(onSelectionFinished);
  });

  it("should set noop function for onSelectionInterrupted by default", () => {
    const params = createRectangularSelectionParams({});

    expect(params.onSelectionInterrupted).toBe(noopFn);
  });

  it("should set specified function for onSelectionInterrupted", () => {
    const onSelectionInterrupted = (): void => {};
    const params = createRectangularSelectionParams({ onSelectionInterrupted });

    expect(params.onSelectionInterrupted).toBe(onSelectionInterrupted);
  });

  it("should set specified rectangle element", () => {
    const rectangleElement = document.createElement("div");
    const params = createRectangularSelectionParams({ rectangleElement });

    expect(params.rectangleElement).toBe(rectangleElement);
  });

  it("should set lmbCtrlMouseDownEventVerifier by default", () => {
    const params = createRectangularSelectionParams({});

    expect(params.mouseDownEventVerifier).toBe(lmbCtrlMouseEventVerifier);
  });

  it("should set specified mouse down event verifier by default", () => {
    const mouseDownEventVerifier = (): boolean => true;
    const params = createRectangularSelectionParams({ mouseDownEventVerifier });

    expect(params.mouseDownEventVerifier).toBe(mouseDownEventVerifier);
  });

  it("should set lmbMouseUpEventVerifier by default", () => {
    const params = createRectangularSelectionParams({});

    expect(params.mouseUpEventVerifier).toBe(lmbMouseEventVerifier);
  });

  it("should set specified mouse up event verifier by default", () => {
    const mouseUpEventVerifier = (): boolean => true;
    const params = createRectangularSelectionParams({ mouseUpEventVerifier });

    expect(params.mouseUpEventVerifier).toBe(mouseUpEventVerifier);
  });
});
