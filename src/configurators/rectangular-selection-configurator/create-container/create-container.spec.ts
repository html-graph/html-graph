import { describe, expect, it } from "vitest";
import { createContainer } from "./create-container";

describe("createContainer", () => {
  it("should create div element", () => {
    expect(createContainer().tagName).toBe("DIV");
  });

  it("should create element with absolute positioning", () => {
    expect(createContainer().style.position).toBe("absolute");
  });

  it("should create element with left set to 0", () => {
    expect(createContainer().style.left).toBe("0px");
  });

  it("should create element with top set to 0", () => {
    expect(createContainer().style.top).toBe("0px");
  });

  it("should create element with 100% width", () => {
    expect(createContainer().style.width).toBe("0px");
  });

  it("should create element with 100% height", () => {
    expect(createContainer().style.height).toBe("0px");
  });
});
