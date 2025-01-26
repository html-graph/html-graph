import { createContainer } from "./create-container";

describe("createContainer", () => {
  it("should create element with absolute positioning", () => {
    const element = createContainer();

    expect(element.style.position).toBe("absolute");
  });

  it("should create element with top 0", () => {
    const element = createContainer();

    expect(element.style.top).toBe("0px");
  });

  it("should create element with left 0", () => {
    const element = createContainer();

    expect(element.style.left).toBe("0px");
  });

  it("should create element with width 0", () => {
    const element = createContainer();

    expect(element.style.width).toBe("0px");
  });

  it("should create element with height 0", () => {
    const element = createContainer();

    expect(element.style.height).toBe("0px");
  });
});
