import { EdgeShape } from "../edge-shape";
import { GenericEdgeShape } from "./generic-edge-shape";

const createBezierEdge = (
  hasSourceArrow: boolean,
  hasTargetArrow: boolean,
): EdgeShape => {
  return new GenericEdgeShape({
    color: "#FFFFFF",
    width: 2,
    arrowLength: 10,
    arrowWidth: 3,
    hasSourceArrow,
    hasTargetArrow,
    createLinePath: () => "",
    createDetourPath: () => "",
    createCyclePath: () => "",
  });
};

describe("GenericEdgeShape", () => {
  it("should have only line element", () => {
    const shape = createBezierEdge(false, false);

    const childrenCount = shape.svg.children[0].children.length;

    expect(childrenCount).toBe(1);
  });

  it("should have line and arrow element", () => {
    const shape = createBezierEdge(true, false);

    const childrenCount = shape.svg.children[0].children.length;

    expect(childrenCount).toBe(2);
  });

  it("should have line and 2 arrows element", () => {
    const shape = createBezierEdge(true, true);

    const childrenCount = shape.svg.children[0].children.length;

    expect(childrenCount).toBe(3);
  });

  it("should apply specified mirroring to group", () => {
    const shape = createBezierEdge(false, false);

    shape.render({
      from: {
        x: 0,
        y: 100,
        width: 0,
        height: 0,
        portId: "port-1",
        nodeId: "node-1",
        direction: 0,
      },
      to: {
        x: 100,
        y: 0,
        width: 0,
        height: 0,
        portId: "port-2",
        nodeId: "node-2",
        direction: 0,
      },
    });

    const g = shape.svg.children[0] as SVGGElement;

    expect(g.style.transform).toBe("scale(1, -1)");
  });

  it("should create path for target arrow", () => {
    const shape = createBezierEdge(false, true);

    shape.render({
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

    const g = shape.svg.children[0];
    const arrow = g.children[1];

    expect(arrow.getAttribute("d")).toBe("M 100 100 L 90 103 L 90 97");
  });

  it("should create path for source arrow", () => {
    const shape = createBezierEdge(true, false);

    shape.render({
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

    const g = shape.svg.children[0];
    const arrow = g.children[1];

    expect(arrow.getAttribute("d")).toBe("M 0 0 L 10 3 L 10 -3");
  });

  it("should create port cycle target arrow path", () => {
    const shape = createBezierEdge(false, true);

    shape.render({
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
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        portId: "port-1",
        nodeId: "node-1",
        direction: 0,
      },
    });

    const line = shape.svg.children[0].children[1];

    expect(line.getAttribute("d")).toBe("M 0 0 L 10 3 L 10 -3");
  });

  it("should create node cycle target arrow path", () => {
    const shape = createBezierEdge(false, true);

    shape.render({
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
        nodeId: "node-1",
        direction: 0,
      },
    });

    const g = shape.svg.children[0];
    const arrow = g.children[1];

    expect(arrow.getAttribute("d")).toBe("M 100 100 L 90 103 L 90 97");
  });
});
