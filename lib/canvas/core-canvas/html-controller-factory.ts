import { GraphStore } from "@/graph-store";
import { HtmlController } from "@/html-controller";
import { ViewportTransformer } from "@/viewport-transformer";

export type HtmlControllerFactory = (
  graphStore: GraphStore,
  viewportTransformer: ViewportTransformer,
) => HtmlController;
