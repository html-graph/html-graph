import { Canvas } from "@/canvas";
import { Graph } from "@/graph";
import { GraphController } from "@/graph-controller";
import { GraphStore } from "@/graph-store";
import { CoreHtmlView } from "@/html-view";
import {
  createElement,
  createMouseMoveEvent,
  createTouch,
  defaultGraphControllerParams,
  defaultViewportControllerParams,
} from "@/mocks";
import { Viewport } from "@/viewport";
import { ViewportController } from "@/viewport-controller";
import { ViewportStore } from "@/viewport-store";
import { UserSelectableNodesConfigurator } from "./user-selectable-nodes-configurator";
import { Identifier } from "@/identifier";
import { PointInsideVerifier } from "../shared";

const createCanvas = (options?: {
  element?: HTMLElement;
  onNodeSelected?: (nodeId: Identifier) => void;
  mouseDownEventVerifier?: (event: MouseEvent) => boolean;
  mouseUpEventVerifier?: (event: MouseEvent) => boolean;
  movementThreshold?: number;
}): Canvas => {
  const graphStore = new GraphStore();
  const element = options?.element ?? document.createElement("div");
  const viewportStore = new ViewportStore(element);
  const htmlView = new CoreHtmlView(graphStore, viewportStore, element);
  const graph = new Graph(graphStore);
  const viewport = new Viewport(viewportStore);

  const graphController = new GraphController(
    graphStore,
    htmlView,
    defaultGraphControllerParams,
  );

  const viewportController = new ViewportController(
    graphStore,
    viewportStore,
    defaultViewportControllerParams,
    window,
  );

  const canvas = new Canvas(
    graph,
    viewport,
    graphController,
    viewportController,
  );

  const pointInsideVerifier = new PointInsideVerifier(element, window);

  UserSelectableNodesConfigurator.configure(
    canvas,
    window,
    pointInsideVerifier,
    {
      onNodeSelected: options?.onNodeSelected ?? ((): void => {}),
      mouseDownEventVerifier:
        options?.mouseDownEventVerifier ?? ((): boolean => true),
      mouseUpEventVerifier:
        options?.mouseUpEventVerifier ?? ((): boolean => true),
      movementThreshold: options?.movementThreshold ?? 10,
    },
  );

  return canvas;
};

describe("UserSelectableNodesConfigurator", () => {
  it("should call specified callback on node mouse grab and immediate release", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onNodeSelected = jest.fn();

    const canvas = createCanvas({ element, onNodeSelected });

    const nodeElement = createElement({ width: 100, height: 100 });

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 200,
      y: 200,
    });

    nodeElement.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 200,
        clientY: 200,
      }),
    );

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onNodeSelected).toHaveBeenCalledWith("node-1");
  });

  it("should not call specified callback after node removed", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onNodeSelected = jest.fn();

    const canvas = createCanvas({ element, onNodeSelected });

    const nodeElement = createElement({ width: 100, height: 100 });

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 200,
      y: 200,
    });

    canvas.removeNode("node-1");

    nodeElement.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 200,
        clientY: 200,
      }),
    );

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onNodeSelected).not.toHaveBeenCalled();
  });

  it("should not call specified callback after canvas destroy", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onNodeSelected = jest.fn();

    const canvas = createCanvas({ element, onNodeSelected });

    const nodeElement = createElement({ width: 100, height: 100 });

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 200,
      y: 200,
    });

    canvas.destroy();

    nodeElement.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 200,
        clientY: 200,
      }),
    );

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onNodeSelected).not.toHaveBeenCalled();
  });

  it("should prevent selection initiation process when mouse down verifier not passed", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onNodeSelected = jest.fn();

    const canvas = createCanvas({
      element,
      onNodeSelected,
      mouseDownEventVerifier: (event: MouseEvent): boolean => event.ctrlKey,
    });

    const nodeElement = createElement({ width: 100, height: 100 });

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 200,
      y: 200,
    });

    nodeElement.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 200,
        clientY: 200,
      }),
    );

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onNodeSelected).not.toHaveBeenCalled();
  });

  it("should prevent selection when mouse up verifier not passed", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onNodeSelected = jest.fn();

    const canvas = createCanvas({
      element,
      onNodeSelected,
      mouseUpEventVerifier: (event: MouseEvent): boolean => event.ctrlKey,
    });

    const nodeElement = createElement({ width: 100, height: 100 });

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 200,
      y: 200,
    });

    nodeElement.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 200,
        clientY: 200,
      }),
    );

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onNodeSelected).not.toHaveBeenCalled();
  });

  it("should emit selection once", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onNodeSelected = jest.fn();

    const canvas = createCanvas({ element, onNodeSelected });

    const node1Element = createElement({ width: 100, height: 100 });

    canvas.addNode({
      id: "node-1",
      element: node1Element,
      x: 200,
      y: 200,
    });

    node1Element.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 200,
        clientY: 200,
      }),
    );

    window.dispatchEvent(new MouseEvent("mouseup"));

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onNodeSelected).toHaveBeenCalledTimes(1);
  });

  it("should reset node element mouse event on node removal", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onNodeSelected = jest.fn();

    const canvas = createCanvas({ element, onNodeSelected });

    const nodeElement = createElement({ width: 100, height: 100 });

    const spy = jest.spyOn(nodeElement, "removeEventListener");

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 200,
      y: 200,
    });

    canvas.removeNode("node-1");

    expect(spy).toHaveBeenCalledWith("mousedown", expect.anything());
    spy.mockClear();
  });

  it("should reset node element mouse event on canvas clear", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onNodeSelected = jest.fn();

    const canvas = createCanvas({ element, onNodeSelected });

    const nodeElement = createElement({ width: 100, height: 100 });

    const spy = jest.spyOn(nodeElement, "removeEventListener");

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 200,
      y: 200,
    });

    canvas.clear();

    expect(spy).toHaveBeenCalledWith("mousedown", expect.anything());
    spy.mockClear();
  });

  it("should call specified callback on node touch grab and immediate release", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onNodeSelected = jest.fn();

    const canvas = createCanvas({ element, onNodeSelected });

    const nodeElement = createElement({ width: 100, height: 100 });

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 200,
      y: 200,
    });

    nodeElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 200, clientY: 200 })],
      }),
    );

    window.dispatchEvent(new MouseEvent("touchend"));

    expect(onNodeSelected).toHaveBeenCalledWith("node-1");
  });

  it("should not call specified callback on node touch grab after node removed", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onNodeSelected = jest.fn();

    const canvas = createCanvas({ element, onNodeSelected });

    const nodeElement = createElement({ width: 100, height: 100 });

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 200,
      y: 200,
    });

    canvas.removeNode("node-1");

    nodeElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 200, clientY: 200 })],
      }),
    );

    window.dispatchEvent(new MouseEvent("touchend"));

    expect(onNodeSelected).not.toHaveBeenCalled();
  });

  it("should not call specified callback on node touch grab after canvas destroy", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onNodeSelected = jest.fn();

    const canvas = createCanvas({ element, onNodeSelected });

    const nodeElement = createElement({ width: 100, height: 100 });

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 200,
      y: 200,
    });

    nodeElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 200, clientY: 200 })],
      }),
    );

    canvas.destroy();

    window.dispatchEvent(new MouseEvent("touchend"));

    expect(onNodeSelected).not.toHaveBeenCalled();
  });

  it("should prevent selection initiation process when touch start event doesnt fit", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onNodeSelected = jest.fn();

    const canvas = createCanvas({
      element,
      onNodeSelected,
      mouseDownEventVerifier: (event: MouseEvent): boolean => event.ctrlKey,
    });

    const nodeElement = createElement({ width: 100, height: 100 });

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 200,
      y: 200,
    });

    nodeElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [
          createTouch({ clientX: 200, clientY: 200 }),
          createTouch({ clientX: 200, clientY: 200 }),
        ],
      }),
    );

    window.dispatchEvent(new MouseEvent("touchend"));

    expect(onNodeSelected).not.toHaveBeenCalled();
  });

  it("should emit selection on touch once second", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onNodeSelected = jest.fn();

    const canvas = createCanvas({ element, onNodeSelected });

    const nodeElement = createElement({ width: 100, height: 100 });

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 200,
      y: 200,
    });

    nodeElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 200, clientY: 200 })],
      }),
    );

    window.dispatchEvent(new MouseEvent("touchend"));

    window.dispatchEvent(new MouseEvent("touchend"));

    expect(onNodeSelected).toHaveBeenCalledTimes(1);
  });

  it("should reset node element touch event on node removal", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onNodeSelected = jest.fn();

    const canvas = createCanvas({ element, onNodeSelected });

    const nodeElement = createElement({ width: 100, height: 100 });

    const spy = jest.spyOn(nodeElement, "removeEventListener");

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 200,
      y: 200,
    });

    canvas.removeNode("node-1");

    expect(spy).toHaveBeenCalledWith("touchstart", expect.anything());
    spy.mockClear();
  });

  it("should reset node element touch event on canvas clear", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onNodeSelected = jest.fn();

    const canvas = createCanvas({ element, onNodeSelected });

    const nodeElement = createElement({ width: 100, height: 100 });

    const spy = jest.spyOn(nodeElement, "removeEventListener");

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 200,
      y: 200,
    });

    canvas.clear();

    expect(spy).toHaveBeenCalledWith("touchstart", expect.anything());
    spy.mockClear();
  });

  it("should not call specified callback on touch grab cancelled", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onNodeSelected = jest.fn();

    const canvas = createCanvas({ element, onNodeSelected });

    const nodeElement = createElement({ width: 100, height: 100 });

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 200,
      y: 200,
    });

    nodeElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 200, clientY: 200 })],
      }),
    );

    window.dispatchEvent(new MouseEvent("touchcancel"));
    window.dispatchEvent(new MouseEvent("touchend"));

    expect(onNodeSelected).not.toHaveBeenCalled();
  });

  it("should reset touch state on selection cancellation", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ element });

    const nodeElement = createElement({ width: 100, height: 100 });

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 200,
      y: 200,
    });

    const spy = jest.spyOn(window, "removeEventListener");

    nodeElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 200, clientY: 200 })],
      }),
    );

    window.dispatchEvent(new MouseEvent("touchcancel"));

    expect(spy).toHaveBeenCalledWith("touchcancel", expect.anything());
    spy.mockClear();
  });

  it("should cancel selection when mouse move distance is more than specified threshold", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onNodeSelected = jest.fn();

    const canvas = createCanvas({
      element,
      onNodeSelected,
      movementThreshold: Math.sqrt(100) - 1,
    });

    const nodeElement = createElement({ width: 100, height: 100 });

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 200,
      y: 200,
    });

    nodeElement.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 200,
        clientY: 200,
      }),
    );

    window.dispatchEvent(createMouseMoveEvent({ clientX: 300, clientY: 300 }));

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onNodeSelected).not.toHaveBeenCalled();
  });

  it("should cancel selection when touch move distance is more than specified threshold", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onNodeSelected = jest.fn();

    const canvas = createCanvas({
      element,
      onNodeSelected,
      movementThreshold: Math.sqrt(100) - 1,
    });

    const nodeElement = createElement({ width: 100, height: 100 });

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 200,
      y: 200,
    });

    nodeElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 200, clientY: 200 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: 300, clientY: 300 })],
      }),
    );

    window.dispatchEvent(new MouseEvent("touchend"));

    expect(onNodeSelected).not.toHaveBeenCalled();
  });

  it("should cancel selection when mouse moved outside", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onNodeSelected = jest.fn();

    const canvas = createCanvas({
      element,
      onNodeSelected,
    });

    const nodeElement = createElement({ width: 100, height: 100 });

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
    });

    nodeElement.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 1,
        clientY: 1,
      }),
    );

    window.dispatchEvent(createMouseMoveEvent({ clientX: -1, clientY: -1 }));

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onNodeSelected).not.toHaveBeenCalled();
  });

  it("should cancel selection when touch moved outside", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onNodeSelected = jest.fn();

    const canvas = createCanvas({
      element,
      onNodeSelected,
    });

    const nodeElement = createElement({ width: 100, height: 100 });

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
    });

    nodeElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 1, clientY: 1 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: -2, clientY: -2 })],
      }),
    );

    window.dispatchEvent(new MouseEvent("touchend"));

    expect(onNodeSelected).not.toHaveBeenCalled();
  });

  it("should cancel selection when touched with more than one point", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onNodeSelected = jest.fn();

    const canvas = createCanvas({
      element,
      onNodeSelected,
    });

    const nodeElement = createElement({ width: 100, height: 100 });

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
    });

    nodeElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 1, clientY: 1 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [
          createTouch({ clientX: 2, clientY: 2 }),
          createTouch({ clientX: 2, clientY: 2 }),
        ],
      }),
    );

    window.dispatchEvent(new MouseEvent("touchend"));

    expect(onNodeSelected).not.toHaveBeenCalled();
  });

  it("should reset distance calculation on mouse selection start", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onNodeSelected = jest.fn();

    const canvas = createCanvas({
      element,
      onNodeSelected,
    });

    const nodeElement = createElement({ width: 100, height: 100 });

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
    });

    nodeElement.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 1,
        clientY: 1,
      }),
    );
    window.dispatchEvent(createMouseMoveEvent({ clientX: 100, clientY: 100 }));
    window.dispatchEvent(new MouseEvent("mouseup"));

    nodeElement.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 1,
        clientY: 1,
      }),
    );
    window.dispatchEvent(createMouseMoveEvent({ clientX: 2, clientY: 2 }));
    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onNodeSelected).toHaveBeenCalled();
  });

  it("should reset distance calculation on touch selection start", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onNodeSelected = jest.fn();

    const canvas = createCanvas({
      element,
      onNodeSelected,
    });

    const nodeElement = createElement({ width: 100, height: 100 });

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
    });

    nodeElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 1, clientY: 1 })],
      }),
    );
    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: 100, clientY: 100 })],
      }),
    );
    window.dispatchEvent(new MouseEvent("touchend"));

    nodeElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 1, clientY: 1 })],
      }),
    );
    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: 2, clientY: 2 })],
      }),
    );
    window.dispatchEvent(new MouseEvent("touchend"));

    expect(onNodeSelected).toHaveBeenCalled();
  });

  it("should reset touch movement on selection finish", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onNodeSelected = jest.fn();

    const canvas = createCanvas({
      element,
      onNodeSelected,
    });

    const nodeElement = createElement({ width: 100, height: 100 });

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
    });

    const spy = jest.spyOn(window, "removeEventListener");

    nodeElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 1, clientY: 1 })],
      }),
    );
    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: 2, clientY: 2 })],
      }),
    );
    window.dispatchEvent(new MouseEvent("touchend"));

    expect(spy).toHaveBeenCalledWith("touchmove", expect.anything());
    spy.mockClear();
  });

  it("should reset mouse movenent on selection finish", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onNodeSelected = jest.fn();

    const canvas = createCanvas({
      element,
      onNodeSelected,
    });

    const nodeElement = createElement({ width: 100, height: 100 });

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
    });

    const spy = jest.spyOn(window, "removeEventListener");

    nodeElement.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 1,
        clientY: 1,
      }),
    );
    window.dispatchEvent(createMouseMoveEvent({ clientX: 2, clientY: 2 }));
    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(spy).toHaveBeenCalledWith("mousemove", expect.anything());
    spy.mockClear();
  });
});
