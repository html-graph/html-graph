import { DummyLayoutAlgorithm } from "@/mocks";
import { LayoutAlgorithmConfig } from "../layout-algorithm-config";
import { resolveLayoutAlgorithm } from "./resolve-layout-algorithm";
import {
  ForceDirectedLayoutAlgorithm,
  HierarchicalLayoutAlgorithm,
} from "@/layouts";

describe("resolveLayoutAlgorithm", () => {
  it("should resolve specified custom algorithm", () => {
    const instance = new DummyLayoutAlgorithm();

    const config: LayoutAlgorithmConfig = {
      type: "custom",
      instance,
    };

    const algorithm = resolveLayoutAlgorithm(config);

    expect(instance).toBe(algorithm);
  });

  it("should resolve hierarchical algorithm", () => {
    const config: LayoutAlgorithmConfig = {
      type: "hierarchical",
    };

    const algorithm = resolveLayoutAlgorithm(config);

    expect(algorithm instanceof HierarchicalLayoutAlgorithm).toBe(true);
  });

  it("should resolve force directed layout algorithm when config not specified", () => {
    const algorithm = resolveLayoutAlgorithm(undefined);

    expect(algorithm instanceof ForceDirectedLayoutAlgorithm).toBe(true);
  });
});
