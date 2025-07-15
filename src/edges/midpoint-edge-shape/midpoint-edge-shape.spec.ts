import { BezierEdgeShape } from "../bezier-edge-shape";
import { MidpointEdgeShape } from "./midpoint-edge-shape";

describe("MidpointEdgeShape", () => {
  it("should append specified midpoint element to svg", () => {
    const baseShape = new BezierEdgeShape();

    const midpointElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g",
    );

    const midpointShape = new MidpointEdgeShape(baseShape, midpointElement);

    expect(midpointShape.svg.lastChild).toBe(midpointElement);
  });

  it("should update midpoint element transformation", () => {
    const baseShape = new BezierEdgeShape();

    const midpointElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g",
    );

    const midpointShape = new MidpointEdgeShape(baseShape, midpointElement);

    midpointShape.render({
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

    expect(midpointElement.style.transform).toBe("translate(50px, 50px)");
  });
});
