import { describe, expect, it } from "vitest";
import { createLayer } from "./create-layer";

describe("createLayer", () => {
  it("should create element with absolute positioning", () => {
    const element = createLayer(0);

    expect(element.style.position).toBe("absolute");
  });

  it("should create element with 0 inset", () => {
    const element = createLayer(0);

    expect(element.style.inset).toBe("0");
  });

  it("should create element with specified zIndex", () => {
    const element = createLayer(10);

    expect(element.style.zIndex).toBe("10");
  });
});
