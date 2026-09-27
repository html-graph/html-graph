import { describe, expect, it } from "vitest";
import { ConnectionCategory } from "../shared";
import { DirectEdgeShape } from "./direct-edge-shape";

describe("DirectEdgeShape", () => {
  it("should create line path", () => {
    const shape = new DirectEdgeShape();

    shape.render({
      from: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        direction: 0,
      },
      to: {
        x: 100,
        y: 0,
        width: 0,
        height: 0,
        direction: 0,
      },
      category: ConnectionCategory.Line,
    });

    expect(true).toBe(false);
  });
});
