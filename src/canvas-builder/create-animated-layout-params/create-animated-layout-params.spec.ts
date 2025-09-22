import { DummyAnimatedLayoutAlgorithm } from "@/mocks";
import { AnimatedLayoutConfig } from "./animated-layout-config";
import { createAnimatedLayoutParams } from "./create-animated-layout-params";
import { ForceBasedAnimatedLayoutAlgorithm } from "@/animated-layout-algorithm";

describe("createAnimatedLayoutParams", () => {
  it("should set specified algorithm", () => {
    const config: AnimatedLayoutConfig = {
      algorithm: new DummyAnimatedLayoutAlgorithm(),
    };

    const params = createAnimatedLayoutParams(config);

    expect(params.algorithm).toBe(config.algorithm);
  });

  it("should resolve force based algorithm when config not specified", () => {
    const params = createAnimatedLayoutParams(undefined);

    expect(params.algorithm instanceof ForceBasedAnimatedLayoutAlgorithm).toBe(
      true,
    );
  });

  it("should resolve force based algorithm when algorithm not specified", () => {
    const params = createAnimatedLayoutParams({});

    expect(params.algorithm instanceof ForceBasedAnimatedLayoutAlgorithm).toBe(
      true,
    );
  });
});
