import { prepareNodeElement } from "./prepare-node-element";

describe("prepareNodeElement", () => {
  it("should set element positioning to absolute", () => {
    const element = document.createElement("div");
    prepareNodeElement(element);

    expect(element.style.position).toBe("absolute");
  });

  it("should set element visibility to hidden", () => {
    const element = document.createElement("div");
    prepareNodeElement(element);

    expect(element.style.visibility).toBe("hidden");
  });

  it("should set element top to 0", () => {
    const element = document.createElement("div");
    prepareNodeElement(element);

    expect(element.style.top).toBe("0px");
  });

  it("should set element left to 0", () => {
    const element = document.createElement("div");
    prepareNodeElement(element);

    expect(element.style.left).toBe("0px");
  });
});
