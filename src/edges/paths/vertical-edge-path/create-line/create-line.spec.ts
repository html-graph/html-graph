import { createLine } from "./create-line";

describe("createLinePoints", () => {
  it("should create horizontal line points when connection idirection matches port directions", () => {
    const line = createLine(
      { arrowPoint: { x: 0, y: 0 }, linePoint: { x: 0, y: 10 }, dirY: 1 },
      {
        arrowPoint: { x: 100, y: 100 },
        linePoint: { x: 100, y: 90 },
        dirY: 1,
      },
    );

    expect(line.points).toEqual([
      { x: 0, y: 0 },
      { x: 0, y: 50 },
      { x: 100, y: 50 },
      { x: 100, y: 100 },
    ]);
  });

  it("should create vertical line points when connection is direction is opposite to ports direction", () => {
    const line = createLine(
      { arrowPoint: { x: 0, y: 0 }, linePoint: { x: 0, y: -10 }, dirY: -1 },
      {
        arrowPoint: { x: 100, y: 100 },
        linePoint: { x: 100, y: 110 },
        dirY: -1,
      },
    );

    expect(line.points).toEqual([
      { x: 0, y: 0 },
      { x: 0, y: -10 },
      { x: 50, y: -10 },
      { x: 50, y: 110 },
      { x: 100, y: 110 },
      { x: 100, y: 100 },
    ]);
  });

  it("should create vertical line followed by horizontal line when source port direction matches connection direction", () => {
    const line = createLine(
      { arrowPoint: { x: 0, y: 0 }, linePoint: { x: 0, y: 10 }, dirY: 1 },
      {
        arrowPoint: { x: 100, y: 100 },
        linePoint: { x: 100, y: 110 },
        dirY: -1,
      },
    );

    expect(line.points).toEqual([
      { x: 0, y: 0 },
      { x: 0, y: 110 },
      { x: 100, y: 110 },
      { x: 100, y: 100 },
    ]);
  });

  it("should create horizontal line followed by vertical line when source port direction is opposite to connection direction", () => {
    const line = createLine(
      { arrowPoint: { x: 0, y: 0 }, linePoint: { x: 0, y: -10 }, dirY: -1 },
      { arrowPoint: { x: 100, y: 100 }, linePoint: { x: 100, y: 90 }, dirY: 1 },
    );

    expect(line.points).toEqual([
      { x: 0, y: 0 },
      { x: 0, y: -10 },
      { x: 100, y: -10 },
      { x: 100, y: 100 },
    ]);
  });

  it("should create middle point when connection idirection matches port directions", () => {
    const line = createLine(
      { arrowPoint: { x: 0, y: 0 }, linePoint: { x: 0, y: 10 }, dirY: 1 },
      { arrowPoint: { x: 100, y: 100 }, linePoint: { x: 100, y: 90 }, dirY: 1 },
    );

    expect(line.midpoint).toEqual({ x: 50, y: 50 });
  });

  it("should create middle point when connection is direction is opposite to ports direction", () => {
    const line = createLine(
      { arrowPoint: { x: 0, y: 0 }, linePoint: { x: 0, y: -10 }, dirY: -1 },
      {
        arrowPoint: { x: 100, y: 100 },
        linePoint: { x: 100, y: 110 },
        dirY: -1,
      },
    );

    expect(line.midpoint).toEqual({ x: 50, y: 50 });
  });

  it("should create middle point when source port direction matches connection direction", () => {
    const line = createLine(
      { arrowPoint: { x: 0, y: 0 }, linePoint: { x: 0, y: 10 }, dirY: 1 },
      {
        arrowPoint: { x: 100, y: 100 },
        linePoint: { x: 100, y: 110 },
        dirY: -1,
      },
    );

    expect(line.midpoint).toEqual({ x: 50, y: 110 });
  });

  it("should create midpoint when source port direction is opposite to connection direction", () => {
    const line = createLine(
      { arrowPoint: { x: 0, y: 0 }, linePoint: { x: 0, y: -10 }, dirY: -1 },
      { arrowPoint: { x: 100, y: 100 }, linePoint: { x: 100, y: 90 }, dirY: 1 },
    );

    expect(line.midpoint).toEqual({ x: 50, y: -10 });
  });
});
