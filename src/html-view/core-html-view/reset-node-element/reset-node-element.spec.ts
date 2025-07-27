import { resetNodeElement } from "./reset-node-element";

describe("resetNodeElement", () => {
  it("should reset element positioning", () => {
    const element = document.createElement("div");
    resetNodeElement(element);

    expect(element.style.position).toBe("");
  });

  it("should reset element visibility", () => {
    const element = document.createElement("div");
    resetNodeElement(element);

    expect(element.style.visibility).toBe("");
  });

  it("should reset element top", () => {
    const element = document.createElement("div");
    resetNodeElement(element);

    expect(element.style.top).toBe("");
  });

  it("should reset element left", () => {
    const element = document.createElement("div");
    resetNodeElement(element);

    expect(element.style.left).toBe("");
  });

  it("should reset element transform", () => {
    const element = document.createElement("div");
    element.style.transform = "translate(1px, 2px)";

    resetNodeElement(element);

    expect(element.style.transform).toBe("");
  });
});
