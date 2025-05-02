import { createSvg } from "./create-svg";

describe("createPattern", () => {
  it("should create svg element", () => {
    const sgv = createSvg();

    expect(sgv.tagName).toBe("svg");
  });

  it("should create element with absolute positioning", () => {
    const pattern = createSvg();

    expect(pattern.style.position).toBe("absolute");
  });

  it("should create element with inset 0", () => {
    const pattern = createSvg();

    expect(pattern.style.inset).toBe("0");
  });
});
