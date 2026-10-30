import { describe, expect, it } from "vitest";
import { createHorizontalLinePoints } from "./create-horizontal-line";

describe("createHorizontalLinePoints", () => {
  it("should create horizontal line points when connection direction matches port directions", () => {
    const linePoints = createHorizontalLinePoints(
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

    expect(linePoints).toEqual([
      { x: 0, y: 0 },
      { x: 50, y: 0 },
      { x: 50, y: 100 },
      { x: 100, y: 100 },
    ]);
  });

  it("should create horizontal line points when connection direction is opposite to ports direction", () => {
    const linePoints = createHorizontalLinePoints(
      {
        arrowPoint: { x: 0, y: 0 },
        linePoint: { x: -10, y: 0 },
        dir: { x: -1, y: 0 },
      },
      {
        arrowPoint: { x: 100, y: 100 },
        linePoint: { x: 110, y: 100 },
        dir: { x: -1, y: 0 },
      },
    );

    expect(linePoints).toEqual([
      { x: 0, y: 0 },
      { x: -10, y: 0 },
      { x: -10, y: 50 },
      { x: 110, y: 50 },
      { x: 110, y: 100 },
      { x: 100, y: 100 },
    ]);
  });

  it("should create horizontal line points when source port direction matches connection direction", () => {
    const linePoints = createHorizontalLinePoints(
      {
        arrowPoint: { x: 0, y: 0 },
        linePoint: { x: 10, y: 0 },
        dir: { x: 1, y: 0 },
      },
      {
        arrowPoint: { x: 100, y: 100 },
        linePoint: { x: 110, y: 100 },
        dir: { x: -1, y: 0 },
      },
    );

    expect(linePoints).toEqual([
      { x: 0, y: 0 },
      { x: 110, y: 0 },
      { x: 110, y: 100 },
      { x: 100, y: 100 },
    ]);
  });

  it("should create horizontal line points when source port direction is opposite to connection direction", () => {
    const linePoints = createHorizontalLinePoints(
      {
        arrowPoint: { x: 0, y: 0 },
        linePoint: { x: -10, y: 0 },
        dir: { x: -1, y: 0 },
      },
      {
        arrowPoint: { x: 100, y: 100 },
        linePoint: { x: 90, y: 100 },
        dir: { x: 1, y: 0 },
      },
    );

    expect(linePoints).toEqual([
      { x: 0, y: 0 },
      { x: -10, y: 0 },
      { x: -10, y: 100 },
      { x: 100, y: 100 },
    ]);
  });
});
