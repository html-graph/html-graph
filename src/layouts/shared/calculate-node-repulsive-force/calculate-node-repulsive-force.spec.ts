import { calculateNodeRepulsiveForce } from "./calculate-node-repulsive-force";

describe("calculateNodeRepulsiveForceParams", () => {
  it("should calculate node force", () => {
    const force = calculateNodeRepulsiveForce({
      coefficient: 1,
      charge1: 10,
      charge2: 10,
      distance: 10,
      maxForce: 1e9,
    });

    expect(force).toBe(1);
  });

  it("should account for coefficient", () => {
    const force = calculateNodeRepulsiveForce({
      coefficient: 10,
      charge1: 10,
      charge2: 10,
      distance: 10,
      maxForce: 1e9,
    });

    expect(force).toBe(10);
  });

  it("should limit with maximum force", () => {
    const force = calculateNodeRepulsiveForce({
      coefficient: 10,
      charge1: 10,
      charge2: 10,
      distance: 1e-4,
      maxForce: 1e4,
    });

    expect(force).toBe(1e4);
  });

  it("should limit with maximum force when distance and charges are 0", () => {
    const force = calculateNodeRepulsiveForce({
      coefficient: 10,
      charge1: 0,
      charge2: 0,
      distance: 0,
      maxForce: 1e4,
    });

    expect(force).toBe(1e4);
  });
});
