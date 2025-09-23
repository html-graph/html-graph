import { DummyLayoutAlgorithm } from "@/mocks/dummy-layout-algorithm.mock";
import { LayoutConfig } from "./layout-config";
import { createLayoutParams } from "./create-layout-params";

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
      applyOn: { type: "topologyChangeTimeout" },
    };

    const params = createLayoutParams(config);

    expect(params.applyOn).toEqual({
      type: "topologyChangeTimeout",
    });
  });
});
