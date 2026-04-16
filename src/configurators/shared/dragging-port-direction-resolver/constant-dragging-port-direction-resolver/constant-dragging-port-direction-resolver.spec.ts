import { ConstantDraggingPortDirectionResolver } from "./constant-dragging-port-direction-resolver";
import { DraggingPortDirectionResolver } from "../dragging-port-direction-resolver";
import { DraggingPortDirectionResolverParams } from "../dragging-port-direction-resolver-params";

describe("ConstantDraggingPortDirectionResolver", () => {
  it("should resolve specified direction", () => {
    const portDirectionResolver: DraggingPortDirectionResolver =
      new ConstantDraggingPortDirectionResolver(Math.PI / 2);

    const params: DraggingPortDirectionResolverParams = {
      staticPortId: "port-1",
      isDirect: true,
      cursor: { x: 0, y: 0 },
    };

    expect(portDirectionResolver.resolve(params)).toBe(Math.PI / 2);
  });
});
