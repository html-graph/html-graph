import { GraphStore } from "@/graph-store";
import { ViewportTransformer } from "@/viewport-transformer";
import { CoreHtmlView, HtmlView } from "@/html-view";
import { HtmlViewFactory } from "./canvas/core-canvas";

export const coreHtmlViewFactory: HtmlViewFactory = (
  graphStore: GraphStore,
  viewportTransformer: ViewportTransformer,
): HtmlView => {
  return new CoreHtmlView(graphStore, viewportTransformer);
};
