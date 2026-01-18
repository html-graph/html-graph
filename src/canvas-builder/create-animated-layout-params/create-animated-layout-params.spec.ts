import { DummyAnimatedLayoutAlgorithm } from "@/mocks";
import { AnimatedLayoutConfig } from "./animated-layout-config";
import { createAnimatedLayoutParams } from "./create-animated-layout-params";
import { ForceDirectedAnimatedLayoutAlgorithm } from "@/layouts";
import { defaults } from "./defaults";

describe("createAnimatedLayoutParams", () => {
  it("should set specified algorithm", () => {
    const instance = new DummyAnimatedLayoutAlgorithm();

    const config: AnimatedLayoutConfig = {
      algorithm: {
        type: "custom",
        instance,
      },
    };

    const { algorithm } = createAnimatedLayoutParams(config);

    expect(algorithm).toBe(instance);
  });

  it("should resolve force based algorithm when config not specified", () => {
    const { algorithm } = createAnimatedLayoutParams(undefined);

    expect(algorithm instanceof ForceDirectedAnimatedLayoutAlgorithm).toBe(
      true,
    );
  });

  it("should resolve force based algorithm when algorithm not specified", () => {
    const { algorithm } = createAnimatedLayoutParams({});

    expect(algorithm instanceof ForceDirectedAnimatedLayoutAlgorithm).toBe(
      true,
    );
  });

  it("should resolve default static nodes resolver", () => {
    const { staticNodeResolver } = createAnimatedLayoutParams({});

    expect(staticNodeResolver).toBe(defaults.staticNodeResolver);
  });

  it("should resolve specified static nodes resolver", () => {
    const resolver = (): boolean => true;

    const { staticNodeResolver } = createAnimatedLayoutParams({
      staticNodeResolver: resolver,
    });

    expect(staticNodeResolver).toBe(resolver);
  });

  it("should set default onBeforeApplied", () => {
    const config: AnimatedLayoutConfig = {};

    const params = createAnimatedLayoutParams(config);

    expect(params.onBeforeApplied).toEqual(defaults.onBeforeApplied);
  });

  it("should set default onAfterApplied", () => {
    const config: AnimatedLayoutConfig = {};

    const params = createAnimatedLayoutParams(config);

    expect(params.onAfterApplied).toEqual(defaults.onAfterApplied);
  });

  it("should set specified onBeforeApplied", () => {
    const config: AnimatedLayoutConfig = {
      onBeforeApplied: () => {},
    };

    const params = createAnimatedLayoutParams(config);

    expect(params.onBeforeApplied).toEqual(config.onBeforeApplied);
  });

  it("should set specified onAfterApplied", () => {
    const config: AnimatedLayoutConfig = {
      onAfterApplied: () => {},
    };

    const params = createAnimatedLayoutParams(config);

    expect(params.onAfterApplied).toEqual(config.onAfterApplied);
  });
});
