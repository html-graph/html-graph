import { DummyAnimatedLayoutAlgorithm } from "@/mocks";
import { AnimatedLayoutConfig } from "./animated-layout-config";
import { createAnimatedLayoutAlgorithm } from "./create-animated-layout-algorithm";
import { ForceDirectedAnimatedLayoutAlgorithm } from "@/animated-layout-algorithm";

describe("createAnimatedLayoutParams", () => {
  it("should set specified algorithm", () => {
    const instance = new DummyAnimatedLayoutAlgorithm();

    const config: AnimatedLayoutConfig = {
      algorithm: {
        type: "custom",
        instance,
      },
    };

    const algorithm = createAnimatedLayoutAlgorithm(config);

    expect(algorithm).toBe(instance);
  });

  it("should resolve force based algorithm when config not specified", () => {
    const algorithm = createAnimatedLayoutAlgorithm(undefined);

    expect(algorithm instanceof ForceDirectedAnimatedLayoutAlgorithm).toBe(
      true,
    );
  });

  it("should resolve force based algorithm when algorithm not specified", () => {
    const algorithm = createAnimatedLayoutAlgorithm({});

    expect(algorithm instanceof ForceDirectedAnimatedLayoutAlgorithm).toBe(
      true,
    );
  });
});
