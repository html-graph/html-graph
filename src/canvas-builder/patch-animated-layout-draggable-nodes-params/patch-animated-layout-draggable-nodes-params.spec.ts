import { DraggableNodesParams } from "@/configurators";
import { patchAnimatedLayoutDraggableNodesParams } from "./patch-animated-layout-draggable-nodes-params";
import { Identifier } from "@/identifier";

const createParams = (): DraggableNodesParams => {
  return {
    moveOnTop: true,
    moveEdgesOnTop: true,
    dragCursor: "grab",
    gridSize: null,
    mouseDownEventVerifier: (event): boolean => event.button === 0,
    mouseUpEventVerifier: (event): boolean => event.button === 0,
    nodeDragVerifier: (): boolean => true,
    onNodeDragStarted: (): void => {},
    onNodeDrag: (): void => {},
    onNodeDragFinished: (): void => {},
  };
};

describe("patchAnimatedLayoutDraggableNodesParams", () => {
  it("should add static node on grab", () => {
    const params = createParams();
    const staticNodes = new Set<Identifier>();

    const patchedParams = patchAnimatedLayoutDraggableNodesParams(
      params,
      staticNodes,
    );

    patchedParams.onNodeDragStarted("node-1");

    expect(staticNodes.has("node-1")).toBe(true);
  });

  it("should call original nodeDragStarted", () => {
    const params = createParams();

    const staticNodes = new Set<Identifier>();
    const spy = jest.spyOn(params, "onNodeDragStarted");
    const patchedParams = patchAnimatedLayoutDraggableNodesParams(
      params,
      staticNodes,
    );

    patchedParams.onNodeDragStarted("node-1");

    expect(spy).toHaveBeenCalledWith("node-1");
  });

  it("should remove static node on release", () => {
    const params = createParams();
    const staticNodes = new Set<Identifier>();

    const patchedParams = patchAnimatedLayoutDraggableNodesParams(
      params,
      staticNodes,
    );

    patchedParams.onNodeDragStarted("node-1");
    patchedParams.onNodeDragFinished("node-1");

    expect(staticNodes.has("node-1")).toBe(false);
  });

  it("should call original onNodeDragFinished", () => {
    const params = createParams();
    const staticNodes = new Set<Identifier>();

    const spy = jest.spyOn(params, "onNodeDragFinished");
    const patchedParams = patchAnimatedLayoutDraggableNodesParams(
      params,
      staticNodes,
    );

    patchedParams.onNodeDragFinished("node-1");

    expect(spy).toHaveBeenCalledWith("node-1");
  });
});
