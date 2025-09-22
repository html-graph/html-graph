import { DummyAnimatedLayoutAlgorithm } from "@/mocks";
import { AnimatedLayoutConfig } from "./animated-layout-config";
import { createAnimatedLayoutParams } from "./create-animated-layout-params";

describe("createAnimatedLayoutParams", () => {
  it("should set specified algorithm", () => {
    const config: AnimatedLayoutConfig = {
      algorithm: new DummyAnimatedLayoutAlgorithm(),
    };

    const params = createAnimatedLayoutParams(config);

    expect(params.algorithm).toBe(config.algorithm);
  });
});
