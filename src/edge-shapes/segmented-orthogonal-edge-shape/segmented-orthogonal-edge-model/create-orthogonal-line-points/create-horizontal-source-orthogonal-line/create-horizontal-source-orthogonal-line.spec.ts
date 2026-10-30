import { describe, expect, it } from "vitest";
import { createHorizontalSourceOrthogonalLinePoints } from "./create-horizontal-source-orthogonal-line";

describe("createHorizontalSourceOrthogonalLinePoints", () => {
  it("should create orthogonal line points when both port directions match line direction", () => {
    const linePoints = createHorizontalSourceOrthogonalLinePoints(
      {
        linePoint: { x: 10, y: 0 },
        arrowPoint: { x: 0, y: 0 },
        dir: { x: 1, y: 0 },
      },
      {
        arrowPoint: { x: 100, y: 100 },
        linePoint: { x: 90, y: 100 },
        dir: { x: 0, y: 1 },
      },
    );

    expect(linePoints).toEqual([
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
    ]);
  });

  it("should create orthogonal line points when only target port direction is opposite to the connection direction", () => {
    const linePoints = createHorizontalSourceOrthogonalLinePoints(
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

    expect(linePoints).toEqual([
      { x: 0, y: 0 },
      { x: 55, y: 0 },
      { x: 55, y: 110 },
      { x: 100, y: 110 },
      { x: 100, y: 100 },
    ]);
  });

  it("should create orthogonal line points when only source port direction is opposite to the connection direction", () => {
    const linePoints = createHorizontalSourceOrthogonalLinePoints(
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

    expect(linePoints).toEqual([
      { x: 0, y: 0 },
      { x: -10, y: 0 },
      { x: -10, y: 45 },
      { x: 100, y: 45 },
      { x: 100, y: 100 },
    ]);
  });

  it("should create orthogonal line points when both port directions are opposite to line direction", () => {
    const linePoints = createHorizontalSourceOrthogonalLinePoints(
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

    expect(linePoints).toEqual([
      { x: 0, y: 0 },
      { x: -10, y: 0 },
      { x: -10, y: 110 },
      { x: 100, y: 110 },
      { x: 100, y: 100 },
    ]);
  });
});
