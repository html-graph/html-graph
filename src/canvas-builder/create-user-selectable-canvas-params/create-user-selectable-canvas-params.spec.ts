import { createUserSelectableCanvasParams } from "./create-user-selectable-canvas-params";
import { selectionDefaults } from "../shared";

describe("createUserSelectableCanvasParams", () => {
  it("should return default mouse down event verifier", () => {
    const params = createUserSelectableCanvasParams({
      onCanvasSelected: (): void => {},
    });

    expect(params.mouseDownEventVerifier).toBe(
      selectionDefaults.mouseDownEventVerifier,
    );
  });

  it("should return default mouse up event verifier", () => {
    const params = createUserSelectableCanvasParams({
      onCanvasSelected: (): void => {},
    });

    expect(params.mouseUpEventVerifier).toBe(
      selectionDefaults.mouseUpEventVerifier,
    );
  });

  it("should return default movement threshold", () => {
    const params = createUserSelectableCanvasParams({
      onCanvasSelected: (): void => {},
    });

    expect(params.movementThreshold).toBe(selectionDefaults.movementThreshold);
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
