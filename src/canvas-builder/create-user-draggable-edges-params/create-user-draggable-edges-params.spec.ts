import { BezierEdgeShape } from "@/edges";
import { createUserDraggableEdgeParams } from "./create-user-draggable-edges-params";

describe("createUserDraggableEdgeParams", () => {
  it("should return LMB mouse down event verifier by default", () => {
    const options = createUserDraggableEdgeParams(
      {},
      () => new BezierEdgeShape(),
    );

    const fail1 = options.mouseDownEventVerifier(
      new MouseEvent("mousedown", { button: 1 }),
    );

    const fail2 = options.mouseDownEventVerifier(
      new MouseEvent("mousedown", { button: 0 }),
    );

    const pass = options.mouseDownEventVerifier(
      new MouseEvent("mousedown", { button: 0, ctrlKey: true }),
    );

    expect([fail1, fail2, pass]).toEqual([false, false, true]);
  });

  it("should return specified mouse down event verifier", () => {
    const verifier: (event: MouseEvent) => boolean = () => false;
    const options = createUserDraggableEdgeParams(
      {
        mouseDownEventVerifier: verifier,
      },
      () => new BezierEdgeShape(),
    );

    expect(options.mouseDownEventVerifier).toBe(verifier);
  });
});
