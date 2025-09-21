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

  it("should set 100ms default time delta limit", () => {
    const config: AnimatedLayoutConfig = {
      algorithm: new DummyAnimatedLayoutAlgorithm(),
    };

    const params = createAnimatedLayoutParams(config);

    expect(params.maxTimeDeltaSec).toBe(0.1);
  });

  it("should set specified time delta limit", () => {
    const config: AnimatedLayoutConfig = {
      algorithm: new DummyAnimatedLayoutAlgorithm(),
      maxTimeDeltaSec: 0.2,
    };

    const params = createAnimatedLayoutParams(config);

    expect(params.maxTimeDeltaSec).toBe(0.2);
  });
});
