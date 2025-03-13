import { EventHandler } from "@/event-subject";
import { ViewportBox } from "./viewport-box";

export interface VirtualScrollHtmlControllerParams {
  readonly trigger?: EventHandler<ViewportBox>;
  readonly nodeBoundingBox: {
    readonly width: number;
    readonly height: number;
  };
}
