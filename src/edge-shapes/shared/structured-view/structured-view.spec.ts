import { describe, expect, it } from "vitest";
import { StructuredView } from "./structured-view";

describe("StructuredView", () => {
  it("should attach group element to main element", () => {
    const view = new StructuredView({
      hasSourceArrow: false,
      hasTargetArrow: false,
      color: "red",
      width: 1,
    });

    expect(view.element.children[0]).toBe(view.group);
  });

  it("should attach line element to group element", () => {
    const view = new StructuredView({
      hasSourceArrow: false,
      hasTargetArrow: false,
      color: "red",
      width: 1,
    });

    expect(view.group.children[0]).toBe(view.line);
  });

  it("should attach source arrow element to group element", () => {
    const view = new StructuredView({
      hasSourceArrow: true,
      hasTargetArrow: false,
      color: "red",
      width: 1,
    });

    expect(view.group.children[1]).toBe(view.sourceArrow);
  });

  it("should attach target arrow element to group element", () => {
    const view = new StructuredView({
      hasSourceArrow: false,
      hasTargetArrow: true,
      color: "red",
      width: 1,
    });

    expect(view.group.children[1]).toBe(view.targetArrow);
  });
});
