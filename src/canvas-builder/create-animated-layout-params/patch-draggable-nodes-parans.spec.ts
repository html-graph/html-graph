import { DraggableNodesParams } from "@/configurators";
import { patchDraggableNodesParams } from "./patch-draggable-nodes-params";
import { Identifier } from "@/identifier";

const createParams = (): DraggableNodesParams => {
  return {
    moveOnTop: true,
    moveEdgesOnTop: true,
    dragCursor: "grab",
    gridSize: null,
    mouseDownEventVerifier: (event): boolean => event.button === 0,
    mouseUpEventVerifier: (event): boolean => event.button === 0,
    onNodeDrag: (): void => {},
    nodeDragVerifier: (): boolean => true,
    onNodeDragFinished: (): void => {},
  };
};

describe("patchDraggableNodesParams", () => {
  it("should add static node on grab", () => {
    const params = createParams();
    const staticNodes = new Set<Identifier>();

    const patchedParams = patchDraggableNodesParams(params, staticNodes);

    patchedParams.nodeDragVerifier("node-1");

    expect(staticNodes.has("node-1")).toBe(true);
  });

  it("should call original nodeDragVerifier", () => {
    const params = createParams();

    const staticNodes = new Set<Identifier>();
    const spy = jest.spyOn(params, "nodeDragVerifier");
    const patchedParams = patchDraggableNodesParams(params, staticNodes);

    patchedParams.nodeDragVerifier("node-1");

    expect(spy).toHaveBeenCalledWith("node-1");
  });

  it("should remove static node on release", () => {
    const params = createParams();
    const staticNodes = new Set<Identifier>();

    const patchedParams = patchDraggableNodesParams(params, staticNodes);

    patchedParams.nodeDragVerifier("node-1");
    patchedParams.onNodeDragFinished("node-1");

    expect(staticNodes.has("node-1")).toBe(false);
  });

  it("should call original onNodeDragFinished", () => {
    const params = createParams();
    const staticNodes = new Set<Identifier>();

    const spy = jest.spyOn(params, "onNodeDragFinished");
    const patchedParams = patchDraggableNodesParams(params, staticNodes);

    patchedParams.onNodeDragFinished("node-1");

    expect(spy).toHaveBeenCalledWith("node-1");
  });
});
