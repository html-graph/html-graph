import { DummyLayoutAlgorithm } from "@/mocks";
import { LayoutConfig } from "./layout-config";
import { createLayoutParams } from "./create-layout-params";
import { defaults } from "./defaults";

describe("createLayoutParams", () => {
  it("should set specified algorithm", () => {
    const instance = new DummyLayoutAlgorithm();

    const config: LayoutConfig = {
      algorithm: {
        type: "custom",
        instance,
      },
    };

    const params = createLayoutParams(config);

    expect(params.algorithm).toBe(instance);
  });

  it("should set specified trigger", () => {
    const config: LayoutConfig = {
      applyOn: { type: "topologyChangeMacrotask" },
    };

    const params = createLayoutParams(config);

    expect(params.applyOn).toEqual({
      type: "topologyChangeMacrotask",
    });
  });

  it("should set default static node resolver", () => {
    const config: LayoutConfig = {};

    const params = createLayoutParams(config);

    expect(params.staticNodeResolver).toEqual(defaults.staticNodeResolver);
  });

  it("should set specified static node resolver", () => {
    const resolver = (): boolean => true;

    const config: LayoutConfig = {
      staticNodeResolver: resolver,
    };

    const params = createLayoutParams(config);

    expect(params.staticNodeResolver).toEqual(resolver);
  });

  it("should set default onBeforeApplied", () => {
    const config: LayoutConfig = {};

    const params = createLayoutParams(config);

    expect(params.onBeforeApplied).toEqual(defaults.onBeforeApplied);
  });

  it("should set default onAfterApplied", () => {
    const config: LayoutConfig = {};

    const params = createLayoutParams(config);

    expect(params.onAfterApplied).toEqual(defaults.onAfterApplied);
  });

  it("should set specified onBeforeApplied", () => {
    const config: LayoutConfig = {
      onBeforeApplied: () => {},
    };

    const params = createLayoutParams(config);

    expect(params.onBeforeApplied).toEqual(config.onBeforeApplied);
  });

  it("should set specified onAfterApplied", () => {
    const config: LayoutConfig = {
      onAfterApplied: () => {},
    };

    const params = createLayoutParams(config);

    expect(params.onAfterApplied).toEqual(config.onAfterApplied);
  });
});
