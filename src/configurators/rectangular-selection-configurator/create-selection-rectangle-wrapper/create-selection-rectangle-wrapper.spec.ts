import { describe, expect, it } from "vitest";
import { createSelectionRectangleWrapper } from "./create-selection-rectangle-wrapper";

describe("createSelectionRectangleWrapper", () => {
  it("should create div element", () => {
    expect(createSelectionRectangleWrapper().tagName).toBe("DIV");
  });

  it("should create element with absolute positioning", () => {
    expect(createSelectionRectangleWrapper().style.position).toBe("absolute");
  });
});
