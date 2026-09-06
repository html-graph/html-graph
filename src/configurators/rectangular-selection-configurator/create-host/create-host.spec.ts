import { describe, expect, it } from "vitest";
import { createHost } from "./create-host";

describe("createHost", () => {
  it("should create div element", () => {
    expect(createHost().tagName).toBe("DIV");
  });

  it("should create element with 100% width", () => {
    expect(createHost().style.width).toBe("100%");
  });

  it("should create element with 100% height", () => {
    expect(createHost().style.height).toBe("100%");
  });

  it("should create element with relative positioning", () => {
    expect(createHost().style.position).toBe("relative");
  });
});
