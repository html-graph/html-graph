import { EventHandler } from "@/event-subject";
import { EdgeShape } from "./edge-shape";
import { EdgePath } from "./shared";

export interface PostRenderEdgeShape extends EdgeShape {
  readonly onAfterRender: EventHandler<EdgePath>;
}
