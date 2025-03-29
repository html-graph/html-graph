import { createElement } from "@/mocks";
import { isPointOnElement } from "./is-point-on-element";

describe("isPointOnElement", () => {
  it("should return true when point is inside element bounding box", () => {
    const element = createElement({ x: 10, y: 10, width: 100, height: 100 });

    expect(isPointOnElement(element, 20, 20)).toBe(true);
  });

  it("should return false when point x is less than element x", () => {
    const element = createElement({ x: 10, y: 10, width: 100, height: 100 });

    expect(isPointOnElement(element, 0, 20)).toBe(false);
  });

  it("should return false when point y is less than element y", () => {
    const element = createElement({ x: 10, y: 10, width: 100, height: 100 });

    expect(isPointOnElement(element, 20, 0)).toBe(false);
  });

  it("should return false when point x is more than element x + width", () => {
    const element = createElement({ x: 10, y: 10, width: 100, height: 100 });

    expect(isPointOnElement(element, 130, 0)).toBe(false);
  });

  it("should return false when point y is more than element y + height", () => {
    const element = createElement({ x: 10, y: 10, width: 100, height: 100 });

    expect(isPointOnElement(element, 0, 130)).toBe(false);
  });

  it("should return true when point x is on the lower border", () => {
    const element = createElement({ x: 10, y: 10, width: 100, height: 100 });

    expect(isPointOnElement(element, 10, 20)).toBe(true);
  });

  it("should return true when point x is on the upper border", () => {
    const element = createElement({ x: 10, y: 10, width: 100, height: 100 });

    expect(isPointOnElement(element, 110, 20)).toBe(true);
  });

  it("should return true when point y is on the lower border", () => {
    const element = createElement({ x: 10, y: 10, width: 100, height: 100 });

    expect(isPointOnElement(element, 20, 10)).toBe(true);
  });

  it("should return true when point y is on the upper border", () => {
    const element = createElement({ x: 10, y: 10, width: 100, height: 100 });

    expect(isPointOnElement(element, 20, 110)).toBe(true);
  });
});
