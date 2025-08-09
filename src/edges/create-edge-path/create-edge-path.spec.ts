import { cssVariables } from "../css-variables";
import { createEdgePath } from "./create-edge-path";

describe("createEdgePath", () => {
  it("should create pathwith specified color", () => {
    const path = createEdgePath(1);

    expect(path.getAttribute("stroke")).toBe(`var(${cssVariables.edgeColor})`);
  });

  it("should create pathwith specified width", () => {
    const path = createEdgePath(1);

    expect(path.getAttribute("stroke-width")).toBe("1");
  });

  it("should create pathwithout fill", () => {
    const path = createEdgePath(1);

    expect(path.getAttribute("fill")).toBe("none");
  });
});
