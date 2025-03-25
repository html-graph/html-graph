// import { AddEdgeRequest, AddNodeRequest } from "./canvas";
// import { CanvasBuilder } from "./canvas-builder";
// import { BezierEdgeShape } from "./edges";
// // import { EventSubject } from "./event-subject";
// // import { RenderingBox } from "./html-view";

// const triggerResizeFor = (element: HTMLElement): void => {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   (global as any).triggerResizeFor(element);
// };

describe("CanvasBuilder", () => {
  it("should", () => {
    expect(true).toBe(true);
  });

  // it("should build canvas with specified options", () => {
  //   const builder = new CanvasBuilder();

  //   const canvas = builder
  //     .setOptions({
  //       nodes: {
  //         priority: () => 10,
  //       },
  //     })
  //     .build();

  //   const canvasElement = document.createElement("div");
  //   canvas.attach(canvasElement);

  //   canvas.addNode({
  //     element: document.createElement("div"),
  //     x: 0,
  //     y: 0,
  //   });

  //   const container = canvasElement.children[0].children[0];
  //   const nodeWrapper = container.children[0] as HTMLElement;

  //   expect(nodeWrapper.style.zIndex).toBe("10");
  // });

  // it("should build resize reactive canvas", () => {
  //   const builder = new CanvasBuilder();

  //   const canvas = builder.enableResizeReactiveNodes().build();

  //   const canvasElement = document.createElement("div");
  //   canvas.attach(canvasElement);

  //   const nodeRequest1: AddNodeRequest = {
  //     id: "node-1",
  //     element: document.createElement("div"),
  //     x: 0,
  //     y: 0,
  //     ports: [
  //       {
  //         id: "port-1",
  //         element: document.createElement("div"),
  //       },
  //     ],
  //   };

  //   const nodeRequest2: AddNodeRequest = {
  //     id: "node-2",
  //     element: document.createElement("div"),
  //     x: 0,
  //     y: 0,
  //     ports: [
  //       {
  //         id: "port-2",
  //         element: document.createElement("div"),
  //       },
  //     ],
  //   };

  //   const shape = new BezierEdgeShape();

  //   const addEdge: AddEdgeRequest = {
  //     from: "port-1",
  //     to: "port-2",
  //     shape,
  //   };

  //   canvas.addNode(nodeRequest1).addNode(nodeRequest2).addEdge(addEdge);

  //   const spy = jest.spyOn(shape, "render");

  //   triggerResizeFor(nodeRequest1.element);

  //   expect(spy).toHaveBeenCalled();
  // });

  // it("should build user draggable nodes canvas", () => {
  //   const builder = new CanvasBuilder();

  //   const canvas = builder.enableUserDraggableNodes().build();

  //   expect(canvas instanceof UserDraggableNodesCanvasController).toBe(true);
  // });

  // it("should build user transformable canvas", () => {
  //   const builder = new CanvasBuilder();

  //   const canvas = builder.enableUserTransformableViewport().build();

  //   expect(canvas instanceof UserTransformableViewportCanvasController).toBe(
  //     true,
  //   );
  // });

  // it("should build canvas with specified rendering trigger", () => {
  //   const builder = new CanvasBuilder();
  //   const trigger = new EventSubject<RenderingBox>();

  //   const canvas = builder.enableBoxAreaRendering(trigger).build();

  //   const canvasElement = document.createElement("div");
  //   canvas.attach(canvasElement);

  //   canvas.addNode({
  //     element: document.createElement("div"),
  //     x: 0,
  //     y: 0,
  //   });

  //   const container = canvasElement.children[0].children[0];
  //   const elementsBefore = container.children.length;
  //   trigger.emit({ x: -1, y: -1, width: 2, height: 2 });
  //   const elementsAfter = container.children.length;

  //   expect([elementsBefore, elementsAfter]).toStrictEqual([0, 1]);
  // });

  // it("should build canvas with virtual scroll", () => {
  //   const builder = new CanvasBuilder();

  //   const canvas = builder
  //     .enableVirtualScroll({
  //       nodeContainingRadius: {
  //         vertical: 100,
  //         horizontal: 100,
  //       },
  //     })
  //     .build();

  //   expect(
  //     canvas instanceof UserTransformableViewportVirtualScrollCanvasController,
  //   ).toBe(true);
  // });
});
