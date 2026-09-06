import { describe, expect, it } from "vitest";
import { createUserSelectableCanvasParams } from "./create-user-selectable-canvas-params";
import {
  lmbMouseEventVerifier,
  lmbNoCtrlMouseEventVerifier,
  selectionMovementThreshold,
} from "../shared";

describe("createUserSelectableCanvasParams", () => {
  it("should return lmb no ctrl mouse down event verifier by default", () => {
    const params = createUserSelectableCanvasParams({
      onCanvasSelected: (): void => {},
    });

    expect(params.mouseDownEventVerifier).toBe(lmbNoCtrlMouseEventVerifier);
  });

  it("should return lmb no ctrl mouse up event verifier by default", () => {
    const params = createUserSelectableCanvasParams({
      onCanvasSelected: (): void => {},
    });

    expect(params.mouseUpEventVerifier).toBe(lmbMouseEventVerifier);
  });

  it("should return default movement threshold", () => {
    const params = createUserSelectableCanvasParams({
      onCanvasSelected: (): void => {},
    });

    expect(params.movementThreshold).toBe(selectionMovementThreshold);
  });

  it("should return specified canvas selected callback", () => {
    const onCanvasSelected = (): void => {};

    const params = createUserSelectableCanvasParams({
      onCanvasSelected,
    });

    expect(params.onCanvasSelected).toBe(onCanvasSelected);
  });

  it("should return specified mouse down event verifier", () => {
    const mouseDownEventVerifier = (): boolean => true;

    const params = createUserSelectableCanvasParams({
      onCanvasSelected: (): void => {},
      mouseDownEventVerifier,
    });

    expect(params.mouseDownEventVerifier).toBe(mouseDownEventVerifier);
  });

  it("should return specified mouse up event verifier", () => {
    const mouseUpEventVerifier = (): boolean => true;

    const params = createUserSelectableCanvasParams({
      onCanvasSelected: (): void => {},
      mouseUpEventVerifier,
    });

    expect(params.mouseUpEventVerifier).toBe(mouseUpEventVerifier);
  });

  it("should return specified movement threshold", () => {
    const params = createUserSelectableCanvasParams({
      onCanvasSelected: (): void => {},
      movementThreshold: 100,
    });

    expect(params.movementThreshold).toBe(100);
  });
});
