import { AnimatedLayoutParams } from "@/configurators";
import { Identifier } from "@/identifier";
import { DummyAnimatedLayoutAlgorithm } from "@/mocks";
import { patchDraggableNodesAnimatedLayoutParams } from "./patch-draggable-nodes-animated-layout-params";

const createParams = (): AnimatedLayoutParams => {
  return {
    algorithm: new DummyAnimatedLayoutAlgorithm(),
    staticNodeResolver: (nodeId: Identifier) => nodeId === "node-1",
  };
};

describe("patchDraggableNodesAnimatedLayoutParams", () => {
  it("should apply the original algorithm", () => {
    const params = createParams();
    const staticNodes = new Set<Identifier>();
    const patchedParams = patchDraggableNodesAnimatedLayoutParams(
      params,
      staticNodes,
    );

    expect(patchedParams.algorithm).toBe(params.algorithm);
  });

  it("should account for the original static nodes resolver", () => {
    const params = createParams();
    const staticNodes = new Set<Identifier>();
    const patchedParams = patchDraggableNodesAnimatedLayoutParams(
      params,
      staticNodes,
    );

    expect(patchedParams.staticNodeResolver("node-1")).toBe(true);
  });

  it("should account for static nodes set", () => {
    const params = createParams();
    const staticNodes = new Set<Identifier>(["node-2"]);
    const patchedParams = patchDraggableNodesAnimatedLayoutParams(
      params,
      staticNodes,
    );

    expect(patchedParams.staticNodeResolver("node-2")).toBe(true);
  });
});
