import { describe, expect, it } from "vitest";
import { createOrthogonalLine } from "./create-orthogonal-line";

describe("createOrthogonalLine", () => {
  it("should create horizontal line when both ports are horizontal", () => {
    const line = createOrthogonalLine(
      {
        arrowPoint: { x: 0, y: 0 },
        linePoint: { x: 10, y: 0 },
        dir: { x: 1, y: 0 },
      },
      {
        arrowPoint: { x: 100, y: 100 },
        linePoint: { x: 90, y: 100 },
        dir: { x: 1, y: 0 },
      },
    );

    expect(line.points).toEqual([
      { x: 0, y: 0 },
      { x: 50, y: 0 },
      { x: 50, y: 100 },
      { x: 100, y: 100 },
    ]);
  });

  it("should create vertical line when both ports are vertical", () => {
    const line = createOrthogonalLine(
      {
        arrowPoint: { x: 0, y: 0 },
        linePoint: { x: 0, y: 10 },
        dir: { x: 0, y: 1 },
      },
      {
        arrowPoint: { x: 100, y: 100 },
        linePoint: { x: 100, y: 90 },
        dir: { x: 0, y: 1 },
      },
    );

    expect(line.points).toEqual([
      { x: 0, y: 0 },
      { x: 0, y: 50 },
      { x: 100, y: 50 },
      { x: 100, y: 100 },
    ]);
  });

  it("should create horizontal source orthogonal line when source port is horizontal and target port is vertical", () => {
    const line = createOrthogonalLine(
      {
        arrowPoint: { x: 0, y: 0 },
        linePoint: { x: 10, y: 0 },
        dir: { x: 1, y: 0 },
      },
      {
        arrowPoint: { x: 100, y: 100 },
        linePoint: { x: 90, y: 100 },
        dir: { x: 0, y: 1 },
      },
    );

    expect(line.points).toEqual([
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
    ]);
  });

  it("should create vertical source orthogonal line when source port is vertical and target port is vertical", () => {
    const line = createOrthogonalLine(
      {
        arrowPoint: { x: 0, y: 0 },
        linePoint: { x: 0, y: 10 },
        dir: { x: 0, y: 1 },
      },
      {
        arrowPoint: { x: 100, y: 100 },
        linePoint: { x: 100, y: 90 },
        dir: { x: 1, y: 0 },
      },
    );

    expect(line.points).toEqual([
      { x: 0, y: 0 },
      { x: 0, y: 100 },
      { x: 100, y: 100 },
    ]);
  });
});
