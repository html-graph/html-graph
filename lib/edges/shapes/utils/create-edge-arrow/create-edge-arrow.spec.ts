import { createEdgeArrow } from "./create-edge-arrow";

describe("createEdgeArrow", () => {
  it("should create edhe arrow with specified color", () => {
    const arrow = createEdgeArrow("#FFFFFF");

    expect(arrow.getAttribute("fill")).toBe("#FFFFFF");
  });
});
