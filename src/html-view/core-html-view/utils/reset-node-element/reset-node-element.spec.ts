import { resetNodeElement } from "./reset-node-element";

describe("resetNodeElement", () => {
  it("should set element positioning to absolute", () => {
    const element = document.createElement("div");
    resetNodeElement(element);

    expect(element.style.position).toBe("");
  });

  it("should set element visibility to hidden", () => {
    const element = document.createElement("div");
    resetNodeElement(element);

    expect(element.style.visibility).toBe("");
  });

  it("should set element top to 0", () => {
    const element = document.createElement("div");
    resetNodeElement(element);

    expect(element.style.top).toBe("");
  });

  it("should set element left to 0", () => {
    const element = document.createElement("div");
    resetNodeElement(element);

    expect(element.style.left).toBe("");
  });
});
