import { describe, expect, it } from "vitest";
import { createHorizontalSourceOrthogonalLine } from "./create-horizontal-source-orthogonal-line";

describe("createHorizontalSourceOrthogonalLine", () => {
  it("should create orthogonal line points when both port directions match line direction", () => {
    const line = createHorizontalSourceOrthogonalLine(
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

  it("should create orthogonal line points when only target port direction is opposite to the connection direction", () => {
    const line = createHorizontalSourceOrthogonalLine(
      {
        arrowPoint: { x: 0, y: 0 },
        linePoint: { x: 10, y: 0 },
        dir: { x: 1, y: 0 },
      },
      {
        arrowPoint: { x: 100, y: 100 },
        linePoint: { x: 100, y: 110 },
        dir: { x: 0, y: -1 },
      },
    );

    expect(line.points).toEqual([
      { x: 0, y: 0 },
      { x: 55, y: 0 },
      { x: 55, y: 110 },
      { x: 100, y: 110 },
      { x: 100, y: 100 },
    ]);
  });

  it("should create orthogonal line points when only source port direction is opposite to the connection direction", () => {
    const line = createHorizontalSourceOrthogonalLine(
      {
        arrowPoint: { x: 0, y: 0 },
        linePoint: { x: -10, y: 0 },
        dir: { x: -1, y: 0 },
      },
      {
        arrowPoint: { x: 100, y: 100 },
        linePoint: { x: 100, y: 90 },
        dir: { x: 0, y: 1 },
      },
    );

    expect(line.points).toEqual([
      { x: 0, y: 0 },
      { x: -10, y: 0 },
      { x: -10, y: 45 },
      { x: 100, y: 45 },
      { x: 100, y: 100 },
    ]);
  });

  it("should create orthogonal line points when both port directions are opposite to line direction", () => {
    const line = createHorizontalSourceOrthogonalLine(
      {
        arrowPoint: { x: 0, y: 0 },
        linePoint: { x: -10, y: 0 },
        dir: { x: -1, y: 0 },
      },
      {
        arrowPoint: { x: 100, y: 100 },
        linePoint: { x: 100, y: 110 },
        dir: { x: 0, y: -1 },
      },
    );

    expect(line.points).toEqual([
      { x: 0, y: 0 },
      { x: -10, y: 0 },
      { x: -10, y: 110 },
      { x: 100, y: 110 },
      { x: 100, y: 100 },
    ]);
  });
});
