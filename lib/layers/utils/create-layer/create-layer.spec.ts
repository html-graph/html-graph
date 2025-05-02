import { createLayer } from "./create-layer";

describe("createLayer", () => {
  it("should create element with absolute positioning", () => {
    const element = createLayer();

    expect(element.style.position).toBe("absolute");
  });

  it("should create element with 0 inset", () => {
    const element = createLayer();

    expect(element.style.inset).toBe("0");
  });
});
