import { DummyAnimatedLayoutAlgorithm } from "@/mocks";
import { AnimatedLayoutConfig } from "./animated-layout-config";
import { createAnimatedLayoutParams } from "./create-animated-layout-params";
import { ForceDirectedAnimatedLayoutAlgorithm } from "@/layouts";

describe("createAnimatedLayoutParams", () => {
  it("should set specified algorithm", () => {
    const instance = new DummyAnimatedLayoutAlgorithm();

    const config: AnimatedLayoutConfig = {
      algorithm: {
        type: "custom",
        instance,
      },
    };

    const { algorithm } = createAnimatedLayoutParams(config, new Set());

    expect(algorithm).toBe(instance);
  });

  it("should resolve force based algorithm when config not specified", () => {
    const { algorithm } = createAnimatedLayoutParams(undefined, new Set());

    expect(algorithm instanceof ForceDirectedAnimatedLayoutAlgorithm).toBe(
      true,
    );
  });

  it("should resolve force based algorithm when algorithm not specified", () => {
    const { algorithm } = createAnimatedLayoutParams({}, new Set());

    expect(algorithm instanceof ForceDirectedAnimatedLayoutAlgorithm).toBe(
      true,
    );
  });
});
