import { createPair, EventEmitter, EventHandler } from "@/event-subject";
import { DraggingPortDirectionResolver } from "../dragging-port-direction-resolver";

export class ClosestConnectablePortDraggingPortDirectionResolver
  implements DraggingPortDirectionResolver
{
  public readonly directionChangeHandler: EventHandler<number>;

  private readonly directionChangeEmitter: EventEmitter<number>;

  public constructor() {
    [this.directionChangeEmitter, this.directionChangeHandler] =
      createPair<number>();

    this.directionChangeEmitter.emit(0);
  }
}
