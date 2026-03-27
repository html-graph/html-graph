import { Canvas } from "@/canvas";
import { Graph } from "@/graph";
import { GraphController } from "@/graph-controller";
import { GraphStore } from "@/graph-store";
import { CoreHtmlView } from "@/html-view";
import {
  createElement,
  createTouch,
  defaultGraphControllerParams,
  defaultViewportControllerParams,
} from "@/mocks";
import { Viewport } from "@/viewport";
import { ViewportController } from "@/viewport-controller";
import { ViewportStore } from "@/viewport-store";
import { UserSelectableNodesConfigurator } from "./user-selectable-nodes-configurator";
import { Identifier } from "@/identifier";

const createCanvas = (options?: {
  element?: HTMLElement;
  onSelectionChange?: (nodeIds: ReadonlySet<Identifier>) => void;
  mouseDownEventVerifier?: (event: MouseEvent) => boolean;
  mouseUpEventVerifier?: (event: MouseEvent) => boolean;
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

  UserSelectableNodesConfigurator.configure({
    canvas,
    window,
    onSelectionChange: options?.onSelectionChange ?? ((): void => {}),
    mouseDownEventVerifier:
      options?.mouseDownEventVerifier ?? ((): boolean => true),
    mouseUpEventVerifier:
      options?.mouseUpEventVerifier ?? ((): boolean => true),
  });

  return canvas;
};

describe("UserSelectableNodesConfigurator", () => {
  it("should call specified callback on node mouse grab and immediate release", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onSelectionChange = jest.fn();

    const canvas = createCanvas({ element, onSelectionChange });

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

    expect(onSelectionChange).toHaveBeenCalledWith(new Set(["node-1"]));
  });

  it("should not call specified callback after node removed", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onSelectionChange = jest.fn();

    const canvas = createCanvas({ element, onSelectionChange });

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

    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it("should not call specified callback after canvas destroy", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onSelectionChange = jest.fn();

    const canvas = createCanvas({ element, onSelectionChange });

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

    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it("should prevent selection initiation process when mouse down verifier not passed", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onSelectionChange = jest.fn();

    const canvas = createCanvas({
      element,
      onSelectionChange,
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

    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it("should prevent selection when mouse up verifier not passed", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onSelectionChange = jest.fn();

    const canvas = createCanvas({
      element,
      onSelectionChange,
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

    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it("should emit selection once", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onSelectionChange = jest.fn();

    const canvas = createCanvas({ element, onSelectionChange });

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

    expect(onSelectionChange).toHaveBeenCalledTimes(1);
  });

  it("should reset node element mouse event on node removal", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onSelectionChange = jest.fn();

    const canvas = createCanvas({ element, onSelectionChange });

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
  });

  it("should reset node element mouse event on canvas clear", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onSelectionChange = jest.fn();

    const canvas = createCanvas({ element, onSelectionChange });

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
  });

  it("should call specified callback on node touch grab and immediate release", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onSelectionChange = jest.fn();

    const canvas = createCanvas({ element, onSelectionChange });

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

    expect(onSelectionChange).toHaveBeenCalledWith(new Set(["node-1"]));
  });

  it("should not call specified callback on node touch grab after node removed", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onSelectionChange = jest.fn();

    const canvas = createCanvas({ element, onSelectionChange });

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

    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it("should not call specified callback on node touch grab after canvas destroy", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onSelectionChange = jest.fn();

    const canvas = createCanvas({ element, onSelectionChange });

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

    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it("should prevent selection initiation process when touch start event doesnt fit", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onSelectionChange = jest.fn();

    const canvas = createCanvas({
      element,
      onSelectionChange,
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

    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it("should emit selection on touch once second", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onSelectionChange = jest.fn();

    const canvas = createCanvas({ element, onSelectionChange });

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

    expect(onSelectionChange).toHaveBeenCalledTimes(1);
  });

  it("should reset node element touch event on node removal", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onSelectionChange = jest.fn();

    const canvas = createCanvas({ element, onSelectionChange });

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
  });

  it("should reset node element touch event on canvas clear", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onSelectionChange = jest.fn();

    const canvas = createCanvas({ element, onSelectionChange });

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
  });
});
