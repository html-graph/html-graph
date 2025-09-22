import { DummyLayoutAlgorithm } from "@/mocks/dummy-layout-algorithm.mock";
import { LayoutConfig } from "./layout-config";
import { createLayoutParams } from "./create-layout-params";

describe("createLayoutParams", () => {
  it("should set specified algorithm", () => {
    const config: LayoutConfig = {
      applyOn: "topologyChangeTimeout",
      algorithm: new DummyLayoutAlgorithm(),
    };

    const params = createLayoutParams(config);

    expect(params.algorithm).toBe(config.algorithm);
  });

  it("should set specified trigger", () => {
    const config: LayoutConfig = {
      applyOn: "topologyChangeTimeout",
      algorithm: new DummyLayoutAlgorithm(),
    };

    const params = createLayoutParams(config);

    expect(params.applyOn).toBe(config.applyOn);
  });
});
