import { createCanvas } from "@/mocks";
import { resolveDraggingPortDirectionResolver } from "./resolve-dragging-port-direction-resolver";
import {
  NearestConnectablePortDraggingPortDirectionResolver,
  ConstantDraggingPortDirectionResolver,
} from "@/configurators";

describe("resolveDraggingPortDirectionResolver", () => {
  it("should resolve ConstantDraggingPortDirectionResolver when constant value provided", () => {
    const canvas = createCanvas();
    const resolver = resolveDraggingPortDirectionResolver(
      Math.PI,
      canvas.graph,
      () => true,
    );

    expect(resolver instanceof ConstantDraggingPortDirectionResolver).toBe(
      true,
    );
  });

  it("should resolve NearestConnectablePortDraggingPortDirectionResolver for related value", () => {
    const canvas = createCanvas();
    const resolver = resolveDraggingPortDirectionResolver(
      "closest-connectable-port",
      canvas.graph,
      () => true,
    );

    expect(
      resolver instanceof NearestConnectablePortDraggingPortDirectionResolver,
    ).toBe(true);
  });

  it("should resolve NearestConnectablePortDraggingPortDirectionResolver for related value", () => {
    const canvas = createCanvas();
    const resolver = resolveDraggingPortDirectionResolver(
      "nearest-connectable-port",
      canvas.graph,
      () => true,
    );

    expect(
      resolver instanceof NearestConnectablePortDraggingPortDirectionResolver,
    ).toBe(true);
  });
});
