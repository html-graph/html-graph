import { createNodeWrapper } from "./create-node-wrapper";

describe("createNodeWrapper", () => {
  it("should create element with absolute positioning", () => {
    const element = createNodeWrapper();

    expect(element.style.position).toBe("absolute");
  });

  it("should create element with hidden visibility", () => {
    const element = createNodeWrapper();

    expect(element.style.visibility).toBe("hidden");
  });

  it("should create element with top 0", () => {
    const element = createNodeWrapper();

    expect(element.style.top).toBe("0px");
  });

  it("should create element with left 0", () => {
    const element = createNodeWrapper();

    expect(element.style.left).toBe("0px");
  });
});
