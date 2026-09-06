import { describe, expect, it } from "vitest";
import { createDefaultRectangleElement } from "./create-default-rectangle-element";

describe("createDefaultRectangleElement", () => {
  it("should create element with width 100%", () => {
    const element = createDefaultRectangleElement();

    expect(element.style.width).toBe("100%");
  });

  it("should create element with height 100%", () => {
    const element = createDefaultRectangleElement();

    expect(element.style.height).toBe("100%");
  });

  it("should create element with opacit blue background", () => {
    const element = createDefaultRectangleElement();

    expect(element.style.background).toBe("rgba(174, 238, 255, 0.34)");
  });

  it("should create element with grey dashed border", () => {
    const element = createDefaultRectangleElement();

    expect(element.style.border).toBe("1px dashed rgba(96, 96, 96, 0.47)");
  });
});
