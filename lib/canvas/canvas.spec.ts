import { GraphStore } from "@/graph-store";
import { CoreHtmlView } from "@/html-view";
import { ViewportStore } from "@/viewport-store";
import { Canvas } from "./canvas";
import { CanvasDefaults } from "./create-defaults";
import { createElement } from "@/mocks";
import { CenterFn } from "@/center-fn";
import { HtmlGraphError } from "@/error";
import { AddNodeRequest } from "./add-node-request";

const createCanvas = (params?: {
  options?: CanvasDefaults;
  element?: HTMLElement;
}): Canvas => {
  const graphStore = new GraphStore();
  const viewportStore = new ViewportStore();
  const element = params?.element ?? document.createElement("div");
  const htmlView = new CoreHtmlView(graphStore, viewportStore, element);

  const canvas = new Canvas(
    element,
    graphStore,
    viewportStore,
    htmlView,
    params?.options ?? {},
  );

  return canvas;
};

describe("Canvas", () => {
  it("should add node", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    canvas.addNode({
      element: createElement(),
      x: 0,
      y: 0,
    });

    const container = element.children[0].children[0];

    expect(container.children.length).toBe(1);
  });

  it("should add node with specified id", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    });

    const node = canvas.graph.getNode("node-1")!;

    expect(node).not.toBe(null);
  });

  it("should throw error when trying to add node with existing id", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    const addNodeRequest: AddNodeRequest = {
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    };

    canvas.addNode(addNodeRequest);

    expect(() => {
      canvas.addNode(addNodeRequest);
    }).toThrow(HtmlGraphError);
  });

  it("should add node with specified default centerFn", () => {
    const element = document.createElement("div");
    const centerFn: CenterFn = () => ({ x: 0, y: 0 });

    const canvas = createCanvas({
      element,
      options: {
        nodes: {
          centerFn,
        },
      },
    });

    canvas.addNode({
      id: "node-1",
      element: createElement({ width: 100, height: 100 }),
      x: 0,
      y: 0,
    });

    const container = element.children[0].children[0];
    const nodeElement = container.children[0] as HTMLElement;

    expect(nodeElement.style.transform).toBe("translate(0px, 0px)");
  });

  it("should add node with specified centerFn", () => {
    const element = document.createElement("div");
    const centerFn: CenterFn = () => ({ x: 0, y: 0 });

    const canvas = createCanvas({ element });

    canvas.addNode({
      id: "node-1",
      element: createElement({ width: 100, height: 100 }),
      x: 0,
      y: 0,
      centerFn,
    });

    const container = element.children[0].children[0];
    const nodeElement = container.children[0] as HTMLElement;

    expect(nodeElement.style.transform).toBe("translate(0px, 0px)");
  });

  it("should add node with specified default priority", () => {
    const element = document.createElement("div");

    const canvas = createCanvas({
      element,
      options: {
        nodes: {
          priority: 10,
        },
      },
    });

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    });

    const container = element.children[0].children[0];
    const nodeElement = container.children[0] as HTMLElement;

    expect(nodeElement.style.zIndex).toBe("10");
  });

  it("should add node with specified priority", () => {
    const element = document.createElement("div");

    const canvas = createCanvas({ element });

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      priority: 10,
    });

    const container = element.children[0].children[0];
    const nodeElement = container.children[0] as HTMLElement;

    expect(nodeElement.style.zIndex).toBe("10");
  });

  it("should mark specified ports when adding node", () => {
    const element = document.createElement("div");

    const canvas = createCanvas({ element });

    const spy = jest.spyOn(canvas, "markPort");

    const portElement = createElement();

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      ports: [
        {
          id: "port-1",
          element: portElement,
        },
      ],
    });

    expect(spy).toHaveBeenCalledWith({
      id: "port-1",
      nodeId: "node-1",
      element: portElement,
    });
  });

  it("should update node without arguments", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });
    const nodeElement = createElement();

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
    });

    nodeElement.getBoundingClientRect = (): DOMRect => {
      return new DOMRect(0, 0, 100, 100);
    };

    canvas.updateNode("node-1");

    const container = element.children[0].children[0];
    const nodeElementWrapper = container.children[0] as HTMLElement;

    expect(nodeElementWrapper.style.transform).toBe("translate(-50px, -50px)");
  });

  it("should update node coordinates", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    });

    canvas.updateNode("node-1", { x: 100, y: 100 });

    const container = element.children[0].children[0];
    const nodeElement = container.children[0] as HTMLElement;

    expect(nodeElement.style.transform).toBe("translate(100px, 100px)");
  });

  it("should update node centerFn", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    canvas.addNode({
      id: "node-1",
      element: createElement({ width: 100, height: 100 }),
      x: 0,
      y: 0,
    });

    canvas.updateNode("node-1", { centerFn: () => ({ x: 0, y: 0 }) });

    const container = element.children[0].children[0];
    const nodeElement = container.children[0] as HTMLElement;

    expect(nodeElement.style.transform).toBe("translate(0px, 0px)");
  });

  it("should update node priority", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    });

    canvas.updateNode("node-1", { priority: 10 });

    const container = element.children[0].children[0];
    const nodeElement = container.children[0] as HTMLElement;

    expect(nodeElement.style.zIndex).toBe("10");
  });

  it("should throw error when trying to update nonexisting node", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    expect(() => {
      canvas.updateNode("node-1");
    }).toThrow(HtmlGraphError);
  });

  it("should remove node", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    });

    canvas.removeNode("node-1");

    const container = element.children[0].children[0];

    expect(container.children.length).toBe(0);
  });

  it("should throw error when trying to remove nonexisting node", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    expect(() => {
      canvas.removeNode("node-1");
    }).toThrow(HtmlGraphError);
  });
});
