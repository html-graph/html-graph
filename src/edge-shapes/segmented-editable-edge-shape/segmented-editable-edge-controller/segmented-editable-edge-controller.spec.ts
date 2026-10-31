import { describe, expect, it, vi } from "vitest";
import { SegmentedEditableEdgeController } from "./segmented-editable-edge-controller";
import { ConnectionCategory } from "../../shared";
import { createCanvas } from "@/mocks/create-canvas.mock";

const createController = (): SegmentedEditableEdgeController => {
  const canvas = createCanvas();

  return new SegmentedEditableEdgeController({
    canvasViewport: canvas.viewport,
    color: "#777777",
    width: 1,
    arrowLength: 10,
    arrowRenderer: (): string => "arrow path",
    hasSourceArrow: false,
    hasTargetArrow: false,
    arrowOffset: 10,
    roundness: 3,
  });
};

describe("SegmentedEditableEdgeController", () => {
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
});
