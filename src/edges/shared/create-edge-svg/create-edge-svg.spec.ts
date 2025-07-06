import { createEdgeSvg } from "./create-edge-svg";

describe("createEdgeSvg", () => {
  it("should create edge svg without pointer events", () => {
    const svg = createEdgeSvg("red");

    expect(svg.style.pointerEvents).toBe("none");
  });

  it("should create edge svg with absolute positioning", () => {
    const svg = createEdgeSvg("red");

    expect(svg.style.position).toBe("absolute");
  });

  it("should create edge svg with top 0px", () => {
    const svg = createEdgeSvg("red");

    expect(svg.style.top).toBe("0px");
  });

  it("should create edge svg with left 0px", () => {
    const svg = createEdgeSvg("red");

    expect(svg.style.left).toBe("0px");
  });

  it("should create edge svg with visible overflow", () => {
    const svg = createEdgeSvg("red");

    expect(svg.style.overflow).toBe("visible");
  });

  it("should create edge svg with specified edge color variable value", () => {
    const svg = createEdgeSvg("red");

    expect(svg.style.getPropertyValue("--edge-color")).toBe("red");
  });
});
