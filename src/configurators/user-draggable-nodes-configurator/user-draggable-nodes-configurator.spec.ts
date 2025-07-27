import { standardCenterFn } from "@/center-fn";
import { BezierEdgeShape } from "@/edges";
import { GraphStore } from "@/graph-store";
import { ViewportStore } from "@/viewport-store";
import { CoreHtmlView } from "@/html-view";
import {
  createElement,
  createMouseMoveEvent,
  createTouch,
  defaultCanvasParams,
} from "@/mocks";
import { Canvas } from "@/canvas";
import { UserDraggableNodesConfigurator } from "./user-draggable-nodes-configurator";
import { DraggableNodesParams } from "./draggable-nodes-params";
import { NodeDragPayload } from "./node-drag-payload";
import { MouseEventVerifier } from "../shared";

let innerWidth: number;
let innerHeight: number;

const createCanvas = (options?: {
  dragCursor?: string | null;
  element?: HTMLElement;
  onBeforeNodeDrag?: (payload: NodeDragPayload) => boolean;
  moveOnTop?: boolean;
  moveEdgesOnTop?: boolean;
  onNodeDragFinished?: (nodeId: NodeDragPayload) => void;
  mouseDownEventVerifier?: MouseEventVerifier;
  mouseUpEventVerifier?: MouseEventVerifier;
}): Canvas => {
  const graphStore = new GraphStore();
  const viewportStore = new ViewportStore();
  const element = options?.element ?? document.createElement("div");
  const htmlView = new CoreHtmlView(graphStore, viewportStore, element);

  const canvas = new Canvas(
    element,
    graphStore,
    viewportStore,
    htmlView,
    defaultCanvasParams,
  );

  const params: DraggableNodesParams = {
    moveOnTop: options?.moveOnTop !== undefined ? options.moveOnTop : true,
    moveEdgesOnTop:
      options?.moveEdgesOnTop !== undefined ? options.moveEdgesOnTop : true,
    dragCursor: options?.dragCursor ?? "grab",
    mouseDownEventVerifier:
      options?.mouseDownEventVerifier ??
      ((event): boolean => event.button === 0),
    mouseUpEventVerifier:
      options?.mouseUpEventVerifier ?? ((event): boolean => event.button === 0),
    onNodeDrag: () => {},
    onBeforeNodeDrag: options?.onBeforeNodeDrag ?? ((): boolean => true),
    onNodeDragFinished: options?.onNodeDragFinished ?? ((): void => {}),
  };

  UserDraggableNodesConfigurator.configure(canvas, element, window, params);

  return canvas;
};

describe("UserDraggableNodesConfigurator", () => {
  beforeEach(() => {
    innerWidth = window.innerWidth;
    innerHeight = window.innerHeight;

    window.innerWidth = 1500;
    window.innerHeight = 1200;
  });

  afterEach(() => {
    window.innerWidth = innerWidth;
    window.innerHeight = innerHeight;
  });

  it("should change cursor on node grab", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ element });
    const nodeElement = createElement();

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    nodeElement.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    expect(element.style.cursor).toBe("grab");
  });

  it("should not change cursor on other than left mouse button", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ element });
    const nodeElement = createElement();

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    nodeElement.dispatchEvent(new MouseEvent("mousedown", { button: 1 }));

    expect(nodeElement.style.cursor).toBe("");
  });

  it("should move grabbed node with mouse", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ element });
    const nodeElement = createElement();

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    nodeElement.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    window.dispatchEvent(createMouseMoveEvent({ clientX: 100, clientY: 100 }));

    const container = element.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.transform).toBe("translate(100px, 100px)");
  });

  it("should change cursor back on node release", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ element });
    const nodeElement = createElement();

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    nodeElement.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));
    window.dispatchEvent(new MouseEvent("mouseup", { button: 0 }));

    expect(nodeElement.style.cursor).toBe("");
  });

  it("should not change cursor back on node release for other than left mouse button", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ element });
    const nodeElement = createElement();

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    nodeElement.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));
    window.dispatchEvent(new MouseEvent("mouseup", { button: 1 }));

    expect(element.style.cursor).toBe("grab");
  });

  it("should change cursor on node grab on specified", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({
      element,
      dragCursor: "crosshair",
    });
    const nodeElement = createElement();

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    nodeElement.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    expect(element.style.cursor).toBe("crosshair");
  });

  it("should move grabbed node with touch", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ element });
    const nodeElement = createElement();

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    nodeElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: 100, clientY: 100 })],
      }),
    );

    const container = element.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.transform).toBe("translate(100px, 100px)");
  });

  it("should not move grabbed node with mouse when pointer is out of controller", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ element });
    const nodeElement = createElement();

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    nodeElement.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    window.dispatchEvent(createMouseMoveEvent({ clientX: 1100, clientY: 0 }));

    const container = element.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.transform).toBe("translate(0px, 0px)");
  });

  it("should not move grabbed node with mouse when pointer is out of window", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ element });
    const nodeElement = createElement();

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    nodeElement.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    window.dispatchEvent(createMouseMoveEvent({ clientX: -100, clientY: 0 }));

    const container = element.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.transform).toBe("translate(0px, 0px)");
  });

  it("should not move grabbed node with touch if more than one touches", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ element });
    const nodeElement = createElement();

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    nodeElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [
          createTouch({ clientX: 100, clientY: 100 }),
          createTouch({ clientX: 200, clientY: 200 }),
        ],
      }),
    );

    const container = element.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.transform).toBe("translate(0px, 0px)");
  });

  it("should not move grabbed node when touch out of controller", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ element });
    const nodeElement = createElement();

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    nodeElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: 1100, clientY: 100 })],
      }),
    );

    const container = element.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.transform).toBe("translate(0px, 0px)");
  });

  it("should not move grabbed node when touch out of window", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ element });
    const nodeElement = createElement();

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    nodeElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: -100, clientY: 100 })],
      }),
    );

    const container = element.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.transform).toBe("translate(0px, 0px)");
  });

  it("should not move grabbed node with touch after release", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ element });
    const nodeElement = createElement();

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    nodeElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: 100, clientY: 100 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchend", {
        touches: [],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: 200, clientY: 200 })],
      }),
    );

    const container = element.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.transform).toBe("translate(100px, 100px)");
  });

  it("should stop moving node with touch after release one of touches", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ element });
    const nodeElement = createElement();

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    nodeElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: 100, clientY: 100 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchend", {
        touches: [createTouch({ clientX: 100, clientY: 100 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: 200, clientY: 200 })],
      }),
    );

    const container = element.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.transform).toBe("translate(100px, 100px)");
  });

  it("should not move node with mouse if drag is not allowed", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({
      element,
      onBeforeNodeDrag: (): boolean => false,
    });
    const nodeElement = createElement();

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    nodeElement.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    window.dispatchEvent(createMouseMoveEvent({ clientX: 100, clientY: 100 }));

    const container = element.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.transform).toBe("translate(0px, 0px)");
  });

  it("should not move node with touch if drag is not allowed", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({
      element,
      onBeforeNodeDrag: (): boolean => false,
    });
    const nodeElement = createElement();

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    nodeElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: 100, clientY: 100 })],
      }),
    );

    const container = element.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.transform).toBe("translate(0px, 0px)");
  });

  it("should not grab node with more than one touch", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ element });
    const nodeElement = createElement();

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    nodeElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [
          createTouch({ clientX: 0, clientY: 0 }),
          createTouch({ clientX: 100, clientY: 0 }),
        ],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: 100, clientY: 100 })],
      }),
    );

    const container = element.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.transform).toBe("translate(0px, 0px)");
  });

  it("should not change cursor on grab after clear", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ element });
    const nodeElement = createElement();

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    canvas.clear();

    nodeElement.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    expect(element.style.cursor).toBe("");
  });

  it("should handle gracefully drag removed node", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ element });
    const nodeElement = createElement();

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    nodeElement.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    canvas.removeNode("node-1");

    expect(() => {
      window.dispatchEvent(
        createMouseMoveEvent({ movementX: 100, movementY: 100 }),
      );
    }).not.toThrow();
  });

  it("should move node on top on grab with mouse", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ element });
    const nodeElement = createElement();

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    nodeElement.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    const container = element.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.zIndex).toBe("2");
  });

  it("should not move node on top when move on top disabled", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({
      element,
      moveOnTop: false,
    });
    const nodeElement = createElement();

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    nodeElement.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    const container = element.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.zIndex).toBe("0");
  });

  it("should update adjacent edges priorities", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ element });

    const element1 = createElement();

    canvas.addNode({
      id: "node-1",
      element: element1,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    canvas.markPort({
      id: "port-1",
      nodeId: "node-1",
      element: createElement(),
      direction: 0,
    });

    canvas.addNode({
      id: "node-2",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    canvas.markPort({
      id: "port-2",
      nodeId: "node-2",
      element: createElement(),
      direction: 0,
    });

    canvas.addEdge({
      id: "edge-1",
      from: "port-1",
      to: "port-2",
      shape: new BezierEdgeShape(),
      priority: 0,
    });

    element1.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    const container = element.children[0].children[0];
    const edgeSvg = container.children[2] as HTMLElement;

    expect(edgeSvg.style.zIndex).toBe("1");
  });

  it("should call on drag finished with mouse", () => {
    const onNodeDragFinished = jest.fn();

    const element = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({
      element,
      onNodeDragFinished,
    });

    const nodeElement = createElement();

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    nodeElement.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));
    window.dispatchEvent(new MouseEvent("mouseup", { button: 0 }));

    expect(onNodeDragFinished).toHaveBeenCalledWith({
      nodeId: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
    });
  });

  it("should call on drag finished with touch", () => {
    const onNodeDragFinished = jest.fn();

    const element = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({
      element,
      onNodeDragFinished,
    });

    const nodeElement = createElement();

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    nodeElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchend", {
        touches: [],
      }),
    );

    expect(onNodeDragFinished).toHaveBeenCalledWith({
      nodeId: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
    });
  });

  it("should not start drag when mouse down validator not passed", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({
      element,
      mouseDownEventVerifier: (event: MouseEvent): boolean =>
        event.button === 0 && event.ctrlKey,
    });

    const nodeElement = createElement();

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    nodeElement.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    window.dispatchEvent(
      createMouseMoveEvent({ movementX: 100, movementY: 100 }),
    );

    const container = element.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.transform).toBe("translate(0px, 0px)");
  });

  it("should not stop drag when mouse up validator not passed", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({
      element,
      mouseUpEventVerifier: (event: MouseEvent): boolean =>
        event.button === 0 && event.ctrlKey,
    });

    const nodeElement = createElement();

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    nodeElement.dispatchEvent(
      new MouseEvent("mousedown", { button: 0, ctrlKey: true }),
    );

    window.dispatchEvent(createMouseMoveEvent({ clientX: 100, clientY: 100 }));

    window.dispatchEvent(new MouseEvent("mouseup", { button: 0 }));

    window.dispatchEvent(createMouseMoveEvent({ clientX: 200, clientY: 200 }));

    const container = element.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.transform).toBe("translate(200px, 200px)");
  });

  it("should unsubscribe before destroy", () => {
    const canvas = createCanvas();

    canvas.destroy();
  });

  it("should not move grabbed node with mouse after canvas destroy", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ element });
    const nodeElement = createElement();

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    nodeElement.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    canvas.destroy();

    window.dispatchEvent(
      createMouseMoveEvent({ movementX: 100, movementY: 100 }),
    );

    expect(nodeElement.style.transform).toBe("translate(0px, 0px)");
  });

  it("should not move grabbed node with touch after canvas destroy", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ element });
    const nodeElement = createElement();

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    nodeElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    canvas.destroy();

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: 100, clientY: 100 })],
      }),
    );

    expect(nodeElement.style.transform).toBe("translate(0px, 0px)");
  });
});
