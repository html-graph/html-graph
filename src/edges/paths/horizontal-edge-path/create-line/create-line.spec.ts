import { createLine } from "./create-line";

describe("createLinePoints", () => {
  it("should create vertical line points when connection idirection matches port directions", () => {
    const line = createLine(
      { x: 0, y: 0, dirX: 1 },
      { x: 100, y: 100, dirX: 1 },
    );

    expect(line.points).toEqual([
      { x: 0, y: 0 },
      { x: 50, y: 0 },
      { x: 50, y: 100 },
      { x: 100, y: 100 },
    ]);
  });

  it("should create horizontal line points when connection is direction is opposite to ports direction", () => {
    const line = createLine(
      { x: 0, y: 0, dirX: -1 },
      { x: 100, y: 100, dirX: -1 },
    );

    expect(line.points).toEqual([
      { x: 0, y: 0 },
      { x: 0, y: 50 },
      { x: 100, y: 50 },
      { x: 100, y: 100 },
    ]);
  });

  it("should create horizontal line followed by vertical line when source port direction matches connection direction", () => {
    const line = createLine(
      { x: 0, y: 0, dirX: 1 },
      { x: 100, y: 100, dirX: -1 },
    );

    expect(line.points).toEqual([
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
    ]);
  });

  it("should create vertical line followed by horizontal line when source port direction is opposite to connection direction", () => {
    const line = createLine(
      { x: 0, y: 0, dirX: -1 },
      { x: 100, y: 100, dirX: 1 },
    );

    expect(line.points).toEqual([
      { x: 0, y: 0 },
      { x: 0, y: 100 },
      { x: 100, y: 100 },
    ]);
  });

  it("should create middle point when connection idirection matches port directions", () => {
    const line = createLine(
      { x: 0, y: 0, dirX: 1 },
      { x: 100, y: 100, dirX: 1 },
    );

    expect(line.midpoint).toEqual({ x: 50, y: 50 });
  });

  it("should create middle point when connection is direction is opposite to ports direction", () => {
    const line = createLine(
      { x: 0, y: 0, dirX: -1 },
      { x: 100, y: 100, dirX: -1 },
    );

    expect(line.midpoint).toEqual({ x: 50, y: 50 });
  });

  it("should create middle point when source port direction matches connection direction", () => {
    const line = createLine(
      { x: 0, y: 0, dirX: 1 },
      { x: 100, y: 100, dirX: -1 },
    );

    expect(line.midpoint).toEqual({ x: 100, y: 50 });
  });

  it("should create midpoint when source port direction is opposite to connection direction", () => {
    const line = createLine(
      { x: 0, y: 0, dirX: -1 },
      { x: 100, y: 100, dirX: 1 },
    );

    expect(line.midpoint).toEqual({ x: 0, y: 50 });
  });
});
