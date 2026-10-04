import { describe, expect, it, vi } from "vitest";
import { BezierEdgeController } from "./bezier-edge-controller";
import { ConnectionCategory } from "../../shared";

const createController = (): BezierEdgeController => {
  return new BezierEdgeController({
    color: "#777777",
    width: 1,
    curvature: 100,
    arrowLength: 10,
    arrowRenderer: (): string => "arrow path",
    hasSourceArrow: false,
    hasTargetArrow: false,
    detourDistance: 100,
    detourDirection: -Math.PI / 2,
    portCycleRadius: 30,
    portCycleSmallRadius: 10,
  });
};

describe("BezierEdgeController", () => {
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

  it("should update line view", () => {
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

    expect(controller.view.line.getAttribute("d")).toBe(
      "M 50 50 L 60 50 M 60 50 C 160 50, 40 150, 140 150 M 140 150 L 150 150",
    );
  });

  it("should update node cycle", () => {
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
        x: -100,
        y: 0,
        width: 0,
        height: 0,
        direction: 0,
      },
      category: ConnectionCategory.NodeCycle,
    });

    expect(controller.view.line.getAttribute("d")).toBe(
      "M 150 50 L 160 50 C 260 50 160 -50 100 -50 C 40.00000000000001 -50 -60 50 40 50 L 50 50",
    );
  });

  it("should update port cycle", () => {
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
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        direction: 0,
      },
      category: ConnectionCategory.PortCycle,
    });

    expect(controller.view.line.getAttribute("d")).toBe(
      "M 50 50 L 60 50 M 60 50 A 10 10 0 0 1 69.68245836551854 57.5 A 30 30 0 1 0 69.68245836551854 42.5 A 10 10 0 0 1 60 50",
    );
  });
});
