import { createCanvas } from "@/mocks";
import { resolveDraggingPortDirectionResolver } from "./resolve-dragging-port-direction-resolver";
import {
  ClosestConnectablePortDraggingPortDirectionResolver,
  ConstantDraggingPortDirectionResolver,
} from "@/configurators";

describe("resolveDraggingPortDirectionResolver", () => {
  it("should resolve ConstantDraggingPortDirectionResolver when constant value provided", () => {
    const canvas = createCanvas();
    const resolver = resolveDraggingPortDirectionResolver(
      Math.PI,
      canvas.graph,
    );

    expect(resolver instanceof ConstantDraggingPortDirectionResolver).toBe(
      true,
    );
  });

  it("should resolve ClosestConnectablePortDraggingPortDirectionResolver for related value", () => {
    const canvas = createCanvas();
    const resolver = resolveDraggingPortDirectionResolver(
      "closest-connectable-port",
      canvas.graph,
    );

    expect(
      resolver instanceof ClosestConnectablePortDraggingPortDirectionResolver,
    ).toBe(true);
  });
});
