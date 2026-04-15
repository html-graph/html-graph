import { EventHandler } from "@/event-subject";

export interface DraggingPortDirectionResolver {
  readonly directionChangeHandler: EventHandler<number>;
}
