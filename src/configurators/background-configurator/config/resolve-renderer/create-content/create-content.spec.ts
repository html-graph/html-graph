import { createContent } from "./create-content";

describe("createContent", () => {
  it("should create svg circle content", () => {
    const content = createContent(1, "#eeeeee");

    expect(content.tagName).toBe("circle");
  });

  it("should create svg circle with center x 0", () => {
    const content = createContent(1, "#eeeeee");

    expect(content.getAttribute("cx")).toBe("0");
  });

  it("should create svg circle with center y 0", () => {
    const content = createContent(1, "#eeeeee");

    expect(content.getAttribute("cy")).toBe("0");
  });

  it("should create svg circle with specified radius", () => {
    const content = createContent(1, "#eeeeee");

    expect(content.getAttribute("r")).toBe("1");
  });

  it("should create svg circle with specified color", () => {
    const content = createContent(1, "#eeeeee");

    expect(content.getAttribute("fill")).toBe("#eeeeee");
  });
});
