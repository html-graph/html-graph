import { DraggingPortDirectionResolver } from "../dragging-port-direction-resolver";

export class ConstantDraggingPortDirectionResolver
  implements DraggingPortDirectionResolver
{
  public constructor(private readonly direction: number | undefined) {}

  public resolve(): number | undefined {
    return this.direction;
  }
}
