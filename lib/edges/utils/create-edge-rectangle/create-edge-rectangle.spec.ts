import { EdgeRenderPort } from "../../edge-render-port";
import { createEdgeRectangle } from "./create-edge-rectangle";

const source: EdgeRenderPort = {
  x: -100,
  y: -100,
  width: 10,
  height: 10,
  direction: 0,
  portId: "port-1",
  nodeId: "node-1",
};

const target: EdgeRenderPort = {
  x: 100,
  y: 100,
  width: 10,
  height: 10,
  direction: 0,
  portId: "port-2",
  nodeId: "node-2",
};

describe("createEdgeRectangle", () => {
  it("should create edge rectangle", () => {
    const res = createEdgeRectangle(source, target);

    expect(res).toStrictEqual({
      flipX: 1,
      flipY: 1,
      height: 200,
      width: 200,
      x: -95,
      y: -95,
    });
  });

  it("should create edge flipped rectangle", () => {
    const res = createEdgeRectangle(target, source);

    expect(res).toStrictEqual({
      flipX: -1,
      flipY: -1,
      height: 200,
      width: 200,
      x: -95,
      y: -95,
    });
  });
});
