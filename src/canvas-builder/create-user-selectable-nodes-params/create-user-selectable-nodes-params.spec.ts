import { createCanvas } from "@/mocks";
import { createUserSelectableNodesParams } from "./create-user-selectable-nodes-params";
import { defaults } from "./defaults";

describe("createUserSelectableNodesParams", () => {
  it("should pass specified canvas instance", () => {
    const canvas = createCanvas();
    const element = document.createElement("div");

    const params = createUserSelectableNodesParams(canvas, element, window, {});

    expect(params.canvas).toBe(canvas);
  });

  it("should pass specified layer element", () => {
    const canvas = createCanvas();
    const element = document.createElement("div");

    const params = createUserSelectableNodesParams(canvas, element, window, {});

    expect(params.element).toBe(element);
  });

  it("should pass specified window", () => {
    const canvas = createCanvas();
    const element = document.createElement("div");

    const params = createUserSelectableNodesParams(canvas, element, window, {});

    expect(params.window).toBe(window);
  });

  it("should return default node selected callback", () => {
    const canvas = createCanvas();
    const element = document.createElement("div");

    const params = createUserSelectableNodesParams(canvas, element, window, {});

    expect(params.onNodeSelected).toBe(defaults.onNodeSelected);
  });

  it("should return default mouse down event verifier", () => {
    const canvas = createCanvas();
    const element = document.createElement("div");

    const params = createUserSelectableNodesParams(canvas, element, window, {});

    expect(params.mouseDownEventVerifier).toBe(defaults.mouseDownEventVerifier);
  });

  it("should return default mouse up event verifier", () => {
    const canvas = createCanvas();
    const element = document.createElement("div");

    const params = createUserSelectableNodesParams(canvas, element, window, {});

    expect(params.mouseUpEventVerifier).toBe(defaults.mouseUpEventVerifier);
  });

  it("should return default movement threshold", () => {
    const canvas = createCanvas();
    const element = document.createElement("div");

    const params = createUserSelectableNodesParams(canvas, element, window, {});

    expect(params.movementThreshold).toBe(defaults.movementThreshold);
  });

  it("should return specified node selected callback", () => {
    const canvas = createCanvas();
    const element = document.createElement("div");

    const onNodeSelected = (): void => {};

    const params = createUserSelectableNodesParams(canvas, element, window, {
      onNodeSelected,
    });

    expect(params.onNodeSelected).toBe(onNodeSelected);
  });

  it("should return specified mouse down event verifier", () => {
    const canvas = createCanvas();
    const element = document.createElement("div");

    const mouseDownEventVerifier = (): boolean => true;

    const params = createUserSelectableNodesParams(canvas, element, window, {
      mouseDownEventVerifier,
    });

    expect(params.mouseDownEventVerifier).toBe(mouseDownEventVerifier);
  });

  it("should return specified mouse up event verifier", () => {
    const canvas = createCanvas();
    const element = document.createElement("div");

    const mouseUpEventVerifier = (): boolean => true;

    const params = createUserSelectableNodesParams(canvas, element, window, {
      mouseUpEventVerifier,
    });

    expect(params.mouseUpEventVerifier).toBe(mouseUpEventVerifier);
  });

  it("should return specified movement threshold", () => {
    const canvas = createCanvas();
    const element = document.createElement("div");

    const params = createUserSelectableNodesParams(canvas, element, window, {
      movementThreshold: 100,
    });

    expect(params.movementThreshold).toBe(100);
  });
});
