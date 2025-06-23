import { createEdgeSvg } from "./create-edge-svg";

describe("createEdgeSvg", () => {
  it("should create edge svg without pointer events", () => {
    const svg = createEdgeSvg();

    expect(svg.style.pointerEvents).toBe("none");
  });

  it("should create edge svg with absolute positioning", () => {
    const svg = createEdgeSvg();

    expect(svg.style.position).toBe("absolute");
  });

  it("should create edge svg with top 0px", () => {
    const svg = createEdgeSvg();

    expect(svg.style.top).toBe("0px");
  });

  it("should create edge svg with left 0px", () => {
    const svg = createEdgeSvg();

    expect(svg.style.left).toBe("0px");
  });

  it("should create edge svg with visible overflow", () => {
    const svg = createEdgeSvg();

    expect(svg.style.overflow).toBe("visible");
  });
});
