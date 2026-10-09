import { describe, expect, it, vi } from "vitest";
import { ConnectionCategory } from "../../shared";
import { DirectEdgeController } from "./direct-edge-controller";

const createController = (): DirectEdgeController => {
  return new DirectEdgeController({
    color: "#777777",
    width: 1,
    arrowLength: 10,
    arrowRenderer: (): string => "arrow path",
    hasSourceArrow: false,
    hasTargetArrow: false,
    sourceOffsetFn: () => 0,
    targetOffsetFn: () => 0,
  });
};

describe("DirectEdgeController", () => {
  it("should emit model change", () => {
    const controller = createController();

    const spy = vi.fn();

    controller.onModelChange.subscribe(() => {
      spy();
    });

    controller.render({
      from: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        direction: 0,
      },
      to: {
        x: 100,
        y: 100,
        width: 0,
        height: 0,
        direction: 0,
      },
      category: ConnectionCategory.Line,
    });

    expect(spy).toHaveBeenCalled();
  });

  it("should update view", () => {
    const controller = createController();

    controller.render({
      from: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        direction: 0,
      },
      to: {
        x: 100,
        y: 100,
        width: 0,
        height: 0,
        direction: 0,
      },
      category: ConnectionCategory.Line,
    });

    expect(controller.view.line.getAttribute("d")).toBe("M 50 50 L 150 150");
  });
});
