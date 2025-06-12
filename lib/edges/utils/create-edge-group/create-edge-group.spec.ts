import { createEdgeGroup } from "./create-edge-group";

describe("createEdgeGroup", () => {
  it("should create edge group with centered transform origin", () => {
    const group = createEdgeGroup();

    expect(group.style.transformOrigin).toBe("50% 50%");
  });

  it("should create edge group with pointer events auto", () => {
    const group = createEdgeGroup();

    expect(group.style.pointerEvents).toBe("auto");
  });
});
