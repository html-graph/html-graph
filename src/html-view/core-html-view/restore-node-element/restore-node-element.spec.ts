import { restoreNodeElement } from "./restore-node-element";

describe("restoreNodeElement", () => {
  it("should restore element positioning", () => {
    const element = document.createElement("div");
    restoreNodeElement(element);

    expect(element.style.position).toBe("");
  });

  it("should restore element visibility", () => {
    const element = document.createElement("div");
    restoreNodeElement(element);

    expect(element.style.visibility).toBe("");
  });

  it("should restore element top", () => {
    const element = document.createElement("div");
    restoreNodeElement(element);

    expect(element.style.top).toBe("");
  });

  it("should restore element left", () => {
    const element = document.createElement("div");
    restoreNodeElement(element);

    expect(element.style.left).toBe("");
  });

  it("should restore element transform", () => {
    const element = document.createElement("div");
    element.style.transform = "translate(1px, 2px)";

    restoreNodeElement(element);

    expect(element.style.transform).toBe("");
  });
});
