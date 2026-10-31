import { describe, expect, it, vi } from "vitest";
import { Waypoints } from "./waypoints";

describe("Waypoints", () => {
  it("should have empty array by default", () => {
    const waypoints = new Waypoints();

    expect(waypoints.getValue()).toEqual([]);
  });

  it("should set specified value", () => {
    const waypoints = new Waypoints();

    waypoints.setValue([{ x: 100, y: 100 }]);

    expect(waypoints.getValue()).toEqual([{ x: 100, y: 100 }]);
  });

  it("should call specified callback on value change", () => {
    const waypoints = new Waypoints();

    const spy = vi.fn();

    waypoints.onChange.subscribe(() => {
      spy();
    });

    waypoints.setValue([{ x: 100, y: 100 }]);

    expect(spy).toHaveBeenCalled();
  });
});
