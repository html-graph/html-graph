import { createEdgeLine } from "./create-edge-line";

describe("createEdgeLine", () => {
  it("should create line with specified color", () => {
    const line = createEdgeLine("#FFFFFF", 1);

    expect(line.getAttribute("stroke")).toBe("#FFFFFF");
  });

  it("should create line with specified width", () => {
    const line = createEdgeLine("#FFFFFF", 1);

    expect(line.getAttribute("stroke-width")).toBe("1");
  });

  it("should create line without fill", () => {
    const line = createEdgeLine("#FFFFFF", 1);

    expect(line.getAttribute("fill")).toBe("none");
  });
});
