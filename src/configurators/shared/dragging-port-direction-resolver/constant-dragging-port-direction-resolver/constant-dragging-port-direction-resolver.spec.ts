import { ConstantDraggingPortDirectionResolver } from "./constant-dragging-port-direction-resolver";
import { DraggingPortDirectionResolver } from "../dragging-port-direction-resolver";

describe("ConstantDraggingPortDirectionResolver", () => {
  it("should resolve specified direction", () => {
    const portDirectionResolver: DraggingPortDirectionResolver =
      new ConstantDraggingPortDirectionResolver(Math.PI / 2);

    expect(portDirectionResolver.resolve({ x: 0, y: 0 })).toBe(Math.PI / 2);
  });
});
