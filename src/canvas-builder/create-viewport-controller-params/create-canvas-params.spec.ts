import { createViewportControllerParams } from "./create-canvas-params";

describe("createViewportControllerParams", () => {
  it("should return default focus content offset", () => {
    const viewportControllerParams = createViewportControllerParams({});

    expect(viewportControllerParams.focus.contentOffset).toBe(100);
  });

  it("should return specified focus content offset", () => {
    const viewportControllerParams = createViewportControllerParams({
      focus: {
        contentOffset: 200,
      },
    });

    expect(viewportControllerParams.focus.contentOffset).toBe(200);
  });

  it("should return default minimum content scale", () => {
    const viewportControllerParams = createViewportControllerParams({});

    expect(viewportControllerParams.focus.minContentScale).toBe(0);
  });

  it("should return specified minimum content scale", () => {
    const viewportControllerParams = createViewportControllerParams({
      focus: {
        minContentScale: 0.25,
      },
    });

    expect(viewportControllerParams.focus.minContentScale).toBe(0.25);
  });
});
