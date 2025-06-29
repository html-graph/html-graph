import { createEdgeGroup } from "./create-edge-group";

describe("createEdgeGroup", () => {
  it("should create edge group with pointer events set to auto", () => {
    const group = createEdgeGroup();

    expect(group.style.pointerEvents).toBe("auto");
  });

  it("should create edge group with cursor pointer", () => {
    const group = createEdgeGroup();

    expect(group.style.cursor).toBe("pointer");
  });
});
