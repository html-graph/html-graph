import { createCanvas } from "@/mocks";
import { createUserSelectableCanvasParams } from "./create-user-selectable-canvas-params";
import { selectionDefaults } from "../shared";

describe("createUserSelectableCanvasParams", () => {
  it("should pass specified canvas instance", () => {
    const canvas = createCanvas();
    const element = document.createElement("div");

    const params = createUserSelectableCanvasParams(canvas, element, window, {
      onCanvasSelected: (): void => {},
    });

    expect(params.canvas).toBe(canvas);
  });

  it("should pass specified layer element", () => {
    const canvas = createCanvas();
    const element = document.createElement("div");

    const params = createUserSelectableCanvasParams(canvas, element, window, {
      onCanvasSelected: (): void => {},
    });

    expect(params.element).toBe(element);
  });

  it("should pass specified window", () => {
    const canvas = createCanvas();
    const element = document.createElement("div");

    const params = createUserSelectableCanvasParams(canvas, element, window, {
      onCanvasSelected: (): void => {},
    });

    expect(params.window).toBe(window);
  });

  it("should return default mouse down event verifier", () => {
    const canvas = createCanvas();
    const element = document.createElement("div");

    const params = createUserSelectableCanvasParams(canvas, element, window, {
      onCanvasSelected: (): void => {},
    });

    expect(params.mouseDownEventVerifier).toBe(
      selectionDefaults.mouseDownEventVerifier,
    );
  });

  it("should return default mouse up event verifier", () => {
    const canvas = createCanvas();
    const element = document.createElement("div");

    const params = createUserSelectableCanvasParams(canvas, element, window, {
      onCanvasSelected: (): void => {},
    });

    expect(params.mouseUpEventVerifier).toBe(
      selectionDefaults.mouseUpEventVerifier,
    );
  });

  it("should return default movement threshold", () => {
    const canvas = createCanvas();
    const element = document.createElement("div");

    const params = createUserSelectableCanvasParams(canvas, element, window, {
      onCanvasSelected: (): void => {},
    });

    expect(params.movementThreshold).toBe(selectionDefaults.movementThreshold);
  });

  it("should return specified canvas selected callback", () => {
    const canvas = createCanvas();
    const element = document.createElement("div");

    const onCanvasSelected = (): void => {};

    const params = createUserSelectableCanvasParams(canvas, element, window, {
      onCanvasSelected,
    });

    expect(params.onCanvasSelected).toBe(onCanvasSelected);
  });

  it("should return specified mouse down event verifier", () => {
    const canvas = createCanvas();
    const element = document.createElement("div");

    const mouseDownEventVerifier = (): boolean => true;

    const params = createUserSelectableCanvasParams(canvas, element, window, {
      onCanvasSelected: (): void => {},
      mouseDownEventVerifier,
    });

    expect(params.mouseDownEventVerifier).toBe(mouseDownEventVerifier);
  });

  it("should return specified mouse up event verifier", () => {
    const canvas = createCanvas();
    const element = document.createElement("div");

    const mouseUpEventVerifier = (): boolean => true;

    const params = createUserSelectableCanvasParams(canvas, element, window, {
      onCanvasSelected: (): void => {},
      mouseUpEventVerifier,
    });

    expect(params.mouseUpEventVerifier).toBe(mouseUpEventVerifier);
  });

  it("should return specified movement threshold", () => {
    const canvas = createCanvas();
    const element = document.createElement("div");

    const params = createUserSelectableCanvasParams(canvas, element, window, {
      onCanvasSelected: (): void => {},
      movementThreshold: 100,
    });

    expect(params.movementThreshold).toBe(100);
  });
});
