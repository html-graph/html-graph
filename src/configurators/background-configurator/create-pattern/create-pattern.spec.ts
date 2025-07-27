import { createPattern } from "./create-pattern";

describe("createPattern", () => {
  it("should create pattern element", () => {
    const pattern = createPattern();

    expect(pattern.tagName).toBe("pattern");
  });

  it("should create element with particular id", () => {
    const pattern = createPattern();

    expect(pattern.id).toBe("pattern");
  });
});
