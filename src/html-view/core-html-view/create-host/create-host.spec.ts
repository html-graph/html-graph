import { createHost } from "./create-host";

describe("createHost", () => {
  it("should create element with relative positioning", () => {
    const element = createHost();

    expect(element.style.position).toBe("relative");
  });

  it("should create element with overflow hidden", () => {
    const element = createHost();

    expect(element.style.overflow).toBe("hidden");
  });

  it("should create element with width 100%", () => {
    const element = createHost();

    expect(element.style.width).toBe("100%");
  });

  it("should create element with height 100%", () => {
    const element = createHost();

    expect(element.style.height).toBe("100%");
  });
});
