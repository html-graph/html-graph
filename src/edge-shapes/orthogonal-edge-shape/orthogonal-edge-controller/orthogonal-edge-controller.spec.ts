import { describe, expect, it, vi } from "vitest";
import { OrthogonalEdgeController } from "./orthogonal-edge-controller";
import { ConnectionCategory } from "../../shared";

const createController = (): OrthogonalEdgeController => {
  return new OrthogonalEdgeController({
    color: "#777777",
    width: 1,
    arrowLength: 10,
    arrowRenderer: (): string => "arrow path",
    hasSourceArrow: false,
    hasTargetArrow: false,
    detourDistance: 100,
    arrowOffset: 10,
    roundness: 3,
    cycleSquareSide: 50,
  });
};

describe("OrthogonalEdgeController", () => {
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
      "M 50 50 L 97 50 C 100 50 100 50 100 53 L 100 147 C 100 150 100 150 103 150 L 150 150",
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
      "M 150 50 L 167 50 C 170 50 170 50 170 53 L 170 147 C 170 150 170 150 167 150 L 33 150 C 30 150 30 150 30 147 L 30 53 C 30 50 30 50 33 50 L 50 50",
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
