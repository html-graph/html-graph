import { CoreCanvasController } from "@/canvas-controller";
import { GraphStore } from "@/graph-store";
import { CoreHtmlView } from "@/html-view";
import { ViewportTransformer } from "@/viewport-transformer";
import { Canvas } from "./canvas";

const createCanvas = (): Canvas => {
  const graphStore = new GraphStore();
  const viewportTransformer = new ViewportTransformer();

  const controller = new CoreCanvasController(
    graphStore,
    viewportTransformer,
    new CoreHtmlView(graphStore, viewportTransformer),
  );

  return new Canvas(controller, {});
};

describe("Canvas", () => {
  it("should", () => {
    const canvas = createCanvas();

    expect(canvas).toBe(true);
  });
});
