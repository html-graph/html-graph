import { DummyAnimatedLayoutAlgorithm } from "@/mocks";
import { ForceDirectedAnimatedLayoutAlgorithm } from "@/layouts";
import { resolveAnimatedLayoutAlgorithm } from "./resolve-animated-layout-algorithm";
import { AnimatedLayoutAlgorithmConfig } from "../animated-layout-algorithm-config";

describe("resolveAnimatedLayoutAlgorithm", () => {
  it("should set specified algorithm", () => {
    const instance = new DummyAnimatedLayoutAlgorithm();

    const config: AnimatedLayoutAlgorithmConfig = {
      type: "custom",
      instance,
    };

    const algorithm = resolveAnimatedLayoutAlgorithm(config);

    expect(algorithm).toBe(instance);
  });

  it("should resolve force based algorithm when config not specified", () => {
    const algorithm = resolveAnimatedLayoutAlgorithm({});

    expect(algorithm instanceof ForceDirectedAnimatedLayoutAlgorithm).toBe(
      true,
    );
  });
});
