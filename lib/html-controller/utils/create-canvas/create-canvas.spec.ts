import { createCanvas } from "./create-canvas";

describe("createCanvas", () => {
  it("should create element with absolute positioning", () => {
    const element = createCanvas();

    expect(element.style.position).toBe("absolute");
  });

  it("should create element with inset 0", () => {
    const element = createCanvas();

    expect(element.style.inset).toBe("0");
  });
});
