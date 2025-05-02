import { createPatternFilledRectangle } from "./create-pattern-filled-rectangle";

describe("createPatternFilledRectangle", () => {
  it("should create rectangle element", () => {
    const rect = createPatternFilledRectangle();

    expect(rect.tagName).toBe("rect");
  });

  it("should create rectangle with pattern fill", () => {
    const rect = createPatternFilledRectangle();

    expect(rect.getAttribute("fill")).toBe("url(#pattern)");
  });
});
