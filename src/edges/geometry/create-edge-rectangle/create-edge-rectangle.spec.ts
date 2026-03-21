import { EdgeRenderPort } from "../../edge-render-port";
import { createEdgeRectangle } from "./create-edge-rectangle";

const source: EdgeRenderPort = {
  x: -100,
  y: -100,
  width: 10,
  height: 10,
  direction: 0,
};

const target: EdgeRenderPort = {
  x: 100,
  y: 100,
  width: 10,
  height: 10,
  direction: 0,
};

describe("createEdgeRectangle", () => {
  it("should create edge rectangle", () => {
    const res = createEdgeRectangle(source, target, 0);

    expect(res).toStrictEqual({
      height: 200,
      width: 200,
      x: -95,
      y: -95,
      from: { x: 0, y: 0 },
      to: { x: 200, y: 200 },
    });
  });

  it("should create edge flipped rectangle", () => {
    const res = createEdgeRectangle(target, source, 0);

    expect(res).toStrictEqual({
      height: 200,
      width: 200,
      x: -95,
      y: -95,
      from: { x: 200, y: 200 },
      to: { x: 0, y: 0 },
    });
  });

  it("should account for specified padding", () => {
    const res = createEdgeRectangle(source, target, 10);

    expect(res).toStrictEqual({
      height: 220,
      width: 220,
      x: -105,
      y: -105,
      from: { x: 10, y: 10 },
      to: { x: 210, y: 210 },
    });
  });
});
