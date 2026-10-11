import { describe, expect, it, vi } from "vitest";
import { StraightEdgeController } from "./straight-edge-controller";
import { ConnectionCategory } from "../../shared";

const createController = (): StraightEdgeController => {
  return new StraightEdgeController({
    color: "#777777",
    width: 1,
    arrowLength: 10,
    arrowRenderer: (): string => "arrow path",
    hasSourceArrow: false,
    hasTargetArrow: false,
    detourDistance: 100,
    detourDirection: -Math.PI / 2,
    arrowOffset: 10,
    cycleSquareSide: 50,
    roundness: 3,
  });
};

describe("StraightEdgeController", () => {
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
      "M 50 50 L 67 50 C 70 50 70 50 71.54348726628258 52.57247877713763 L 128.45651273371743 147.42752122286237 C 130 150 130 150 133 150 L 150 150",
    );
  });

  it("should update node cycle view", () => {
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
      "M 150 50 L 167 50 C 170 50 170 50 170 47 L 170 -47 C 170 -50 170 -50 167 -50 L 33.00000000000001 -50 C 30.000000000000007 -50 30.000000000000007 -50 30.000000000000007 -47 L 30 47 C 30 50 30 50 33 50 L 50 50",
    );
  });

  it("should update port cycle view", () => {
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
      "M 50 50 L 60 50 M 60 50 L 67 50 C 70 50 70 50 70 53 L 70 97 C 70 100 70 100 73 100 L 167 100 C 170 100 170 100 170 97 L 170 3 C 170 0 170 0 167 0 L 73 0 C 70 0 70 0 70 3 L 70 47 C 70 50 70 50 67 50 L 60 50",
    );
  });
});
