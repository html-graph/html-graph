import { createEdgeArrow } from "./create-edge-arrow";

describe("createEdgeArrow", () => {
  it("should create edge arrow with specified width", () => {
    const arrow = createEdgeArrow(10);

    expect(arrow.getAttribute("stroke-width")).toBe("10");
  });

  it("should create edge arrow with transparent color", () => {
    const arrow = createEdgeArrow(10);

    expect(arrow.getAttribute("fill")).toBe("transparent");
  });

  it("should create edge with rounded perimeter", () => {
    const arrow = createEdgeArrow(10);

    expect(arrow.getAttribute("stroke-linejoin")).toBe("round");
  });

  it("should create edge arrow with transparent stroke", () => {
    const arrow = createEdgeArrow(10);

    expect(arrow.getAttribute("stroke")).toBe("transparent");
  });
});
