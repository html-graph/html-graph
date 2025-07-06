import { cssVariables } from "../css-variables";
import { createEdgeArrow } from "./create-edge-arrow";

describe("createEdgeArrow", () => {
  it("should create edge arrow with edge color", () => {
    const arrow = createEdgeArrow();

    expect(arrow.getAttribute("fill")).toBe(`var(${cssVariables.edgeColor})`);
  });
});
