import { GraphStore } from "@/graph-store";
import { ViewportTransformer } from "@/viewport-transformer";
import { CoreHtmlView, ViewportBox, ViewportHtmlView } from "@/html-view";
import { EventSubject } from "@/event-subject";
import { HtmlViewFactory } from "./canvas/core-canvas";

export const createViewportHtmlViewFactory: (
  trigger: EventSubject<ViewportBox>,
) => HtmlViewFactory = (
  trigger: EventSubject<ViewportBox>,
): HtmlViewFactory => {
  return (graphStore: GraphStore, viewportTransformer: ViewportTransformer) =>
    new ViewportHtmlView(
      new CoreHtmlView(graphStore, viewportTransformer),
      graphStore,
      trigger,
    );
};
