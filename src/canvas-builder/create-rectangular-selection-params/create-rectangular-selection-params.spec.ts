import { describe, expect, it } from "vitest";
import { createRectangularSelectionParams } from "./create-rectangular-selection-params";
import { noopFn } from "../shared";
import { defaultMouseDownEventVerifier } from "./default-mouse-down-event-verifier";
import { defaultMouseUpEventVerifier } from "./default-mouse-up-event-verifier";

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

  it("should set defaultMouseDownEventVerifier buy default", () => {
    const params = createRectangularSelectionParams({});

    expect(params.mouseDownEventVerifier).toBe(defaultMouseDownEventVerifier);
  });

  it("should set defaultMouseUpEventVerifier buy default", () => {
    const params = createRectangularSelectionParams({});

    expect(params.mouseUpEventVerifier).toBe(defaultMouseUpEventVerifier);
  });
});
