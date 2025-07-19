import { createOverlayLayer } from "./create-overlay-layer";

describe("createOverlayLayer", () => {
  it("should create element without pointer events", () => {
    const element = createOverlayLayer();

    expect(element.style.pointerEvents).toBe("none");
  });
});
