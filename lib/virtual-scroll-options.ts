import { EventSubject } from "@/event-subject";
import { ViewportBox } from "./html-controller";

export interface VirtualScrollOptions {
  readonly trigger?: EventSubject<ViewportBox>;
  readonly nodeOffsets: {
    readonly vertical: number;
    readonly horizontal: number;
  };
}
