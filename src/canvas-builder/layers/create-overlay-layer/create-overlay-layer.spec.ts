import { describe, expect, it } from "vitest";
import { createOverlayLayer } from "./create-overlay-layer";

describe("createOverlayLayer", () => {
  it("should create element without pointer events", () => {
    const element = createOverlayLayer(0);

    expect(element.style.pointerEvents).toBe("none");
  });
});
