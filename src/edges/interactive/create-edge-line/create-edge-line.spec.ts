import { createEdgeLine } from "./create-edge-line";

describe("createEdgeLine", () => {
  it("should create line with specified width", () => {
    const line = createEdgeLine(1);

    expect(line.getAttribute("stroke-width")).toBe("1");
  });

  it("should create line without fill", () => {
    const line = createEdgeLine(1);

    expect(line.getAttribute("fill")).toBe("none");
  });

  it("should create line with round linecap", () => {
    const line = createEdgeLine(1);

    expect(line.getAttribute("stroke-linecap")).toBe("round");
  });
});
