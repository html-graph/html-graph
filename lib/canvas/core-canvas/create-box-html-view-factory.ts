import { GraphStore } from "@/graph-store";
import { ViewportTransformer } from "@/viewport-transformer";
import { BoxHtmlView, CoreHtmlView, RenderingBox } from "@/html-view";
import { EventSubject } from "@/event-subject";
import { HtmlViewFactory } from "./html-view-factory";

export const createBoxHtmlViewFactory: (
  trigger: EventSubject<RenderingBox>,
) => HtmlViewFactory = (
  trigger: EventSubject<RenderingBox>,
): HtmlViewFactory => {
  return (graphStore: GraphStore, viewportTransformer: ViewportTransformer) =>
    new BoxHtmlView(
      new CoreHtmlView(graphStore, viewportTransformer),
      graphStore,
      trigger,
      trigger,
    );
};
