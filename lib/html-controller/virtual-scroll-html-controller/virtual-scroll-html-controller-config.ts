import { EventSubject } from "@/event-subject";
import { ViewportBox } from "./viewport-box";

export interface VirtualScrollHtmlControllerConfig {
  readonly trigger: EventSubject<ViewportBox>;
}
