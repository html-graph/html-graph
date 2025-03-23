import { GraphStore } from "@/graph-store";
import { HtmlView } from "@/html-view";
import { ViewportTransformer } from "@/viewport-transformer";

export type HtmlViewFactory = (
  graphStore: GraphStore,
  viewportTransformer: ViewportTransformer,
) => HtmlView;
