import { BezierEdgeShape } from "../bezier-edge-shape";
import { MedianEdgeShape } from "./median-edge-shape";

describe("MedianEdgeShape", () => {
  it("should append specified median element to svg", () => {
    const baseShape = new BezierEdgeShape();

    const medianElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g",
    );

    const medianShape = new MedianEdgeShape(baseShape, medianElement);

    expect(medianShape.svg.lastChild).toBe(medianElement);
  });

  it("should update median element transformation", () => {
    const baseShape = new BezierEdgeShape();

    const medianElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g",
    );

    const medianShape = new MedianEdgeShape(baseShape, medianElement);

    medianShape.render({
      from: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        portId: "port-1",
        nodeId: "node-1",
        direction: 0,
      },
      to: {
        x: 100,
        y: 100,
        width: 0,
        height: 0,
        portId: "port-2",
        nodeId: "node-2",
        direction: 0,
      },
    });

    expect(medianElement.style.transform).toBe("translate(50px, 50px)");
  });
});
