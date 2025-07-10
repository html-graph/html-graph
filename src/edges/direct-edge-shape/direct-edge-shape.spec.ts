import { DirectEdgeShape } from "./direct-edge-shape";

describe("DirectEdgeShape", () => {
  it("should create edge shape with only line", () => {
    const shape = new DirectEdgeShape();

    const childrenCount = shape.svg.children[0].children.length;

    expect(childrenCount).toBe(1);
  });

  it("should create edge with line and arrow element", () => {
    const shape = new DirectEdgeShape({ hasSourceArrow: true });

    const childrenCount = shape.svg.children[0].children.length;

    expect(childrenCount).toBe(2);
  });

  it("should create edge with line and 2 arrows element", () => {
    const shape = new DirectEdgeShape({
      hasSourceArrow: true,
      hasTargetArrow: true,
    });

    const childrenCount = shape.svg.children[0].children.length;

    expect(childrenCount).toBe(3);
  });

  it("should apply specified mirroring to group", () => {
    const shape = new DirectEdgeShape();

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

  it("should create path for source arrow", () => {
    const shape = new DirectEdgeShape({ hasSourceArrow: true });

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
        y: 0,
        width: 0,
        height: 0,
        portId: "port-2",
        nodeId: "node-2",
        direction: 0,
      },
    });

    const g = shape.svg.children[0];
    const arrow = g.children[1];

    expect(arrow.getAttribute("d")).toBe("M 0 0 L 15 4 L 15 -4 Z");
  });

  it("should create path for source arrow", () => {
    const shape = new DirectEdgeShape({ hasTargetArrow: true });

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
        y: 0,
        width: 0,
        height: 0,
        portId: "port-2",
        nodeId: "node-2",
        direction: 0,
      },
    });

    const g = shape.svg.children[0];
    const arrow = g.children[1];

    expect(arrow.getAttribute("d")).toBe("M 100 0 L 85 -4 L 85 4 Z");
  });

  it("should render empty line when diagonal distance is 0", () => {
    const shape = new DirectEdgeShape({ hasTargetArrow: true });

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
        portId: "port-2",
        nodeId: "node-2",
        direction: 0,
      },
    });

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe("");
  });
});
