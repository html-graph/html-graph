import { DummyAnimatedLayoutAlgorithm } from "@/mocks";
import { AnimatedLayoutConfig } from "./animated-layout-config";
import { createAnimatedLayoutAlgorithm } from "./create-animated-layout-algorithm";
import { ForceBasedAnimatedLayoutAlgorithm } from "@/animated-layout-algorithm";

describe("createAnimatedLayoutParams", () => {
  it("should set specified algorithm", () => {
    const config: AnimatedLayoutConfig = {
      type: "custom",
      algorithm: new DummyAnimatedLayoutAlgorithm(),
    };

    const algorithm = createAnimatedLayoutAlgorithm(config);

    expect(algorithm).toBe(config.algorithm);
  });

  it("should resolve force based algorithm when config not specified", () => {
    const algorithm = createAnimatedLayoutAlgorithm(undefined);

    expect(algorithm instanceof ForceBasedAnimatedLayoutAlgorithm).toBe(true);
  });

  it("should resolve force based algorithm when algorithm not specified", () => {
    const algorithm = createAnimatedLayoutAlgorithm({});

    expect(algorithm instanceof ForceBasedAnimatedLayoutAlgorithm).toBe(true);
  });
});
