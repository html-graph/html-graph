import {
  CoreCanvas,
  ResizeReactiveNodesCanvas,
  UserDraggableNodesCanvas,
  UserTransformableViewportCanvas,
} from "@/canvas";
import { CanvasBuilder } from "./canvas-builder";

describe("CanvasBuilder", () => {
  it("should build core canvas", () => {
    const builder = new CanvasBuilder();

    const canvas = builder.build();

    expect(canvas instanceof CoreCanvas).toBe(true);
  });

  it("should set core options", () => {
    const builder = new CanvasBuilder();

    const canvas = builder
      .setOptions({
        nodes: {
          priority: () => 10,
        },
      })
      .build();

    const canvasElement = document.createElement("div");
    canvas.attach(canvasElement);

    canvas.addNode({
      element: document.createElement("div"),
      x: 0,
      y: 0,
    });

    const container = canvasElement.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.zIndex).toBe("10");
  });

  it("should build resize reactive canvas", () => {
    const builder = new CanvasBuilder();

    const canvas = builder.setResizeReactiveNodes().build();

    expect(canvas instanceof ResizeReactiveNodesCanvas).toBe(true);
  });

  it("should build user draggable nodes canvas", () => {
    const builder = new CanvasBuilder();

    const canvas = builder.setUserDraggableNodes().build();

    expect(canvas instanceof UserDraggableNodesCanvas).toBe(true);
  });

  it("should build user transformable canvas", () => {
    const builder = new CanvasBuilder();

    const canvas = builder.setUserTransformableViewport().build();

    expect(canvas instanceof UserTransformableViewportCanvas).toBe(true);
  });

  it("should build user transformable canvas using deprecated method", () => {
    const builder = new CanvasBuilder();

    const canvas = builder.setUserTransformableCanvas().build();

    expect(canvas instanceof UserTransformableViewportCanvas).toBe(true);
  });
});
