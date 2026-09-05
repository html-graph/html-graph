import { describe, expect, it } from "vitest";
import { createRectangularSelectionParams } from "./create-rectangular-selection-params";
import { noopFn } from "../shared";

describe("createRectangularSelectionParams", () => {
  it("should have noop function for onSelectionStarted by default", () => {
    const params = createRectangularSelectionParams({});

    expect(params.onSelectionStarted).toBe(noopFn);
  });

  it("should have specified function for onSelectionStarted by default", () => {
    const onSelectionStarted = (): void => {};
    const params = createRectangularSelectionParams({ onSelectionStarted });

    expect(params.onSelectionStarted).toBe(onSelectionStarted);
  });

  it("should have noop function for onSelectionChange by default", () => {
    const params = createRectangularSelectionParams({});

    expect(params.onSelectionChange).toBe(noopFn);
  });

  it("should have specified function for onSelectionChange by default", () => {
    const onSelectionChange = (): void => {};
    const params = createRectangularSelectionParams({ onSelectionChange });

    expect(params.onSelectionChange).toBe(onSelectionChange);
  });

  it("should have noop function for onSelectionFinished by default", () => {
    const params = createRectangularSelectionParams({});

    expect(params.onSelectionFinished).toBe(noopFn);
  });

  it("should have specified function for onSelectionFinished by default", () => {
    const onSelectionFinished = (): void => {};
    const params = createRectangularSelectionParams({ onSelectionFinished });

    expect(params.onSelectionFinished).toBe(onSelectionFinished);
  });

  it("should have noop function for onSelectionInterrupted by default", () => {
    const params = createRectangularSelectionParams({});

    expect(params.onSelectionInterrupted).toBe(noopFn);
  });

  it("should have specified function for onSelectionInterrupted by default", () => {
    const onSelectionInterrupted = (): void => {};
    const params = createRectangularSelectionParams({ onSelectionInterrupted });

    expect(params.onSelectionInterrupted).toBe(onSelectionInterrupted);
  });
});
