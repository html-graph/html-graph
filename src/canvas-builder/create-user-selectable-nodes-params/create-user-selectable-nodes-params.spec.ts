import { createUserSelectableNodesParams } from "./create-user-selectable-nodes-params";
import { selectionDefaults } from "../shared";

describe("createUserSelectableNodesParams", () => {
  it("should return default mouse down event verifier", () => {
    const params = createUserSelectableNodesParams({
      onNodeSelected: (): void => {},
    });

    expect(params.mouseDownEventVerifier).toBe(
      selectionDefaults.mouseDownEventVerifier,
    );
  });

  it("should return default mouse up event verifier", () => {
    const params = createUserSelectableNodesParams({
      onNodeSelected: (): void => {},
    });

    expect(params.mouseUpEventVerifier).toBe(
      selectionDefaults.mouseUpEventVerifier,
    );
  });

  it("should return default movement threshold", () => {
    const params = createUserSelectableNodesParams({
      onNodeSelected: (): void => {},
    });

    expect(params.movementThreshold).toBe(selectionDefaults.movementThreshold);
  });

  it("should return specified node selected callback", () => {
    const onNodeSelected = (): void => {};

    const params = createUserSelectableNodesParams({
      onNodeSelected,
    });

    expect(params.onNodeSelected).toBe(onNodeSelected);
  });

  it("should return specified mouse down event verifier", () => {
    const mouseDownEventVerifier = (): boolean => true;

    const params = createUserSelectableNodesParams({
      onNodeSelected: (): void => {},
      mouseDownEventVerifier,
    });

    expect(params.mouseDownEventVerifier).toBe(mouseDownEventVerifier);
  });

  it("should return specified mouse up event verifier", () => {
    const mouseUpEventVerifier = (): boolean => true;

    const params = createUserSelectableNodesParams({
      onNodeSelected: (): void => {},
      mouseUpEventVerifier,
    });

    expect(params.mouseUpEventVerifier).toBe(mouseUpEventVerifier);
  });

  it("should return specified movement threshold", () => {
    const params = createUserSelectableNodesParams({
      onNodeSelected: (): void => {},
      movementThreshold: 100,
    });

    expect(params.movementThreshold).toBe(100);
  });
});
