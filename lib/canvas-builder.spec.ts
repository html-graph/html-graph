import {
  CoreCanvas,
  ResizeReactiveNodesCanvas,
  UserDraggableNodesCanvas,
  UserTransformableViewportCanvas,
  UserTransformableViewportVirtualScrollCanvas,
} from "@/canvas";
import { CanvasBuilder } from "./canvas-builder";
import { EventSubject } from "./event-subject";
import { RenderingBox } from "./html-view";

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

    const canvas = builder.enableResizeReactiveNodes().build();

    expect(canvas instanceof ResizeReactiveNodesCanvas).toBe(true);
  });

  it("should build user draggable nodes canvas", () => {
    const builder = new CanvasBuilder();

    const canvas = builder.enableUserDraggableNodes().build();

    expect(canvas instanceof UserDraggableNodesCanvas).toBe(true);
  });

  it("should build user transformable canvas", () => {
    const builder = new CanvasBuilder();

    const canvas = builder.enableUserTransformableViewport().build();

    expect(canvas instanceof UserTransformableViewportCanvas).toBe(true);
  });

  it("should build canvas with specified rendering trigger", () => {
    const builder = new CanvasBuilder();
    const trigger = new EventSubject<RenderingBox>();

    const canvas = builder.enableBoxAreaRendering(trigger).build();

    const canvasElement = document.createElement("div");
    canvas.attach(canvasElement);

    canvas.addNode({
      element: document.createElement("div"),
      x: 0,
      y: 0,
    });

    const container = canvasElement.children[0].children[0];
    const elementsBefore = container.children.length;
    trigger.emit({ x: -1, y: -1, width: 2, height: 2 });
    const elementsAfter = container.children.length;

    expect([elementsBefore, elementsAfter]).toStrictEqual([0, 1]);
  });

  it("should build canvas with virtual scroll", () => {
    const builder = new CanvasBuilder();

    const canvas = builder
      .enableVirtualScroll({
        nodeContainingRadius: {
          vertical: 100,
          horizontal: 100,
        },
      })
      .build();

    expect(canvas instanceof UserTransformableViewportVirtualScrollCanvas).toBe(
      true,
    );
  });
});
