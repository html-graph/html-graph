import { createUserSelectableEdgesParams } from "./create-user-selectable-edges-params";
import { selectionDefaults } from "../shared";

describe("createUserSelectableEdgesParams", () => {
  it("should return default mouse down event verifier", () => {
    const params = createUserSelectableEdgesParams({
      onEdgeSelected: (): void => {},
    });

    expect(params.mouseDownEventVerifier).toBe(
      selectionDefaults.mouseDownEventVerifier,
    );
  });

  it("should return default mouse up event verifier", () => {
    const params = createUserSelectableEdgesParams({
      onEdgeSelected: (): void => {},
    });

    expect(params.mouseUpEventVerifier).toBe(
      selectionDefaults.mouseUpEventVerifier,
    );
  });

  it("should return default movement threshold", () => {
    const params = createUserSelectableEdgesParams({
      onEdgeSelected: (): void => {},
    });

    expect(params.movementThreshold).toBe(selectionDefaults.movementThreshold);
  });

  it("should return specified edge selected callback", () => {
    const onEdgeSelected = (): void => {};

    const params = createUserSelectableEdgesParams({
      onEdgeSelected,
    });

    expect(params.onEdgeSelected).toBe(onEdgeSelected);
  });

  it("should return specified mouse down event verifier", () => {
    const mouseDownEventVerifier = (): boolean => true;

    const params = createUserSelectableEdgesParams({
      onEdgeSelected: (): void => {},
      mouseDownEventVerifier,
    });

    expect(params.mouseDownEventVerifier).toBe(mouseDownEventVerifier);
  });

  it("should return specified mouse up event verifier", () => {
    const mouseUpEventVerifier = (): boolean => true;

    const params = createUserSelectableEdgesParams({
      onEdgeSelected: (): void => {},
      mouseUpEventVerifier,
    });

    expect(params.mouseUpEventVerifier).toBe(mouseUpEventVerifier);
  });

  it("should return specified movement threshold", () => {
    const params = createUserSelectableEdgesParams({
      onEdgeSelected: (): void => {},
      movementThreshold: 100,
    });

    expect(params.movementThreshold).toBe(100);
  });
});
