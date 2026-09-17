import { describe, expect, it } from "vitest";
import { OrthogonalEditableEdgeShape } from "./orthogonal-editable-edge-shape";

describe("OrthogonalEditableEdgeShape", () => {
  it("should create line with default width", () => {
    const shape = new OrthogonalEditableEdgeShape();

    expect(shape.line.getAttribute("stroke-width")).toBe("1");
  });

  it("should create line with specified width", () => {
    const shape = new OrthogonalEditableEdgeShape({ width: 10 });

    expect(shape.line.getAttribute("stroke-width")).toBe("10");
  });

  it("should create element with default color", () => {
    const shape = new OrthogonalEditableEdgeShape();

    expect(shape.element.style.getPropertyValue("--edge-color")).toBe(
      "#777777",
    );
  });

  it("should create element with specified color", () => {
    const shape = new OrthogonalEditableEdgeShape({ color: "red" });

    expect(shape.element.style.getPropertyValue("--edge-color")).toBe("red");
  });
});
