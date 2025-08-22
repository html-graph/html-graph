import { GraphStore } from "@/graph-store";
import { CoreHtmlView, HtmlView, LayoutHtmlView } from "@/html-view";
import { ViewportStore } from "@/viewport-store";
import { Canvas } from "./canvas";
import { createElement } from "@/mocks";
import { CenterFn, standardCenterFn } from "@/center-fn";
import { AddNodeRequest } from "./add-node-request";
import { MarkPortRequest } from "./mark-port-request";
import { BezierEdgeShape } from "@/edges";
import { PriorityFn } from "@/priority";
import { CanvasParams } from "./canvas-params";
import { EdgeShapeFactory } from "./edge-shape-factory";
import { CanvasError } from "./canvas-error";
import { Graph } from "@/graph";
import { Viewport } from "@/viewport";

const createCanvas = (options?: {
  element?: HTMLElement;
  nodesCenterFn?: CenterFn;
  nodesPriorityFn?: PriorityFn;
  portsDirection?: number;
  edgeShapeFactory?: EdgeShapeFactory;
  edgesPriorityFn?: PriorityFn;
}): Canvas => {
  const graphStore = new GraphStore();
  const viewportStore = new ViewportStore();
  const graph = new Graph(graphStore);
  const viewport = new Viewport(viewportStore);
  const element = options?.element ?? document.createElement("div");
  let htmlView: HtmlView = new CoreHtmlView(graphStore, viewportStore, element);
  htmlView = new LayoutHtmlView(htmlView, graphStore);

  const params: CanvasParams = {
    nodes: {
      centerFn: options?.nodesCenterFn ?? standardCenterFn,
      priorityFn: options?.nodesPriorityFn ?? ((): number => 0),
    },
    ports: {
      direction: options?.portsDirection ?? 0,
    },
    edges: {
      shapeFactory:
        options?.edgeShapeFactory ??
        ((): BezierEdgeShape => new BezierEdgeShape()),
      priorityFn: options?.edgesPriorityFn ?? ((): number => 0),
    },
  };

  const canvas = new Canvas(
    graph,
    viewport,
    graphStore,
    viewportStore,
    htmlView,
    params,
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
    }).toThrow(CanvasError);
  });

  it("should add node with specified default centerFn", () => {
    const element = document.createElement("div");
    const centerFn: CenterFn = () => ({ x: 0, y: 0 });

    const canvas = createCanvas({
      element,
      nodesCenterFn: centerFn,
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
      nodesPriorityFn: () => 10,
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

  it("should throw error when trying to update nonexistent node", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    expect(() => {
      canvas.updateNode("node-1");
    }).toThrow(CanvasError);
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

  it("should throw error when trying to remove nonexistent node", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    expect(() => {
      canvas.removeNode("node-1");
    }).toThrow(CanvasError);
  });

  it("should mark port", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    });

    canvas.markPort({
      nodeId: "node-1",
      element: createElement(),
    });

    expect(canvas.graph.getAllPortIds().length).toBe(1);
  });

  it("should mark port with specified id", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    });

    canvas.markPort({
      id: "port-1",
      nodeId: "node-1",
      element: createElement(),
    });

    expect(canvas.graph.getPort("port-1")).not.toBe(null);
  });

  it("should throw error when trying to mark port with existing id", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    });

    const markPortRequest: MarkPortRequest = {
      id: "port-1",
      nodeId: "node-1",
      element: createElement(),
    };

    canvas.markPort(markPortRequest);

    expect(() => {
      canvas.markPort(markPortRequest);
    }).toThrow(CanvasError);
  });

  it("should throw error when trying to mark port to nonexistent node", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    expect(() => {
      canvas.markPort({ nodeId: "node-1", element: createElement() });
    }).toThrow(CanvasError);
  });

  it("should mark port with specified default port direction", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({
      element,
      portsDirection: Math.PI,
    });

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    });

    canvas.markPort({
      id: "port-1",
      nodeId: "node-1",
      element: createElement(),
    });

    const port = canvas.graph.getPort("port-1")!;

    expect(port.direction).toBe(Math.PI);
  });

  it("should mark port with specified port direction", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    });

    canvas.markPort({
      id: "port-1",
      nodeId: "node-1",
      element: createElement(),
      direction: Math.PI,
    });

    const port = canvas.graph.getPort("port-1")!;

    expect(port.direction).toBe(Math.PI);
  });

  it("should update port direction", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    });

    canvas.markPort({
      id: "port-1",
      nodeId: "node-1",
      element: createElement(),
    });

    canvas.updatePort("port-1", { direction: Math.PI });

    const port = canvas.graph.getPort("port-1")!;

    expect(port.direction).toBe(Math.PI);
  });

  it("should throw error when trying to update nonexistent port", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    expect(() => {
      canvas.updatePort("port-1");
    }).toThrow(CanvasError);
  });

  it("should unmark port", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    });

    canvas.markPort({
      id: "port-1",
      nodeId: "node-1",
      element: createElement(),
    });

    canvas.unmarkPort("port-1");

    expect(canvas.graph.getAllPortIds().length).toBe(0);
  });

  it("should throw error when trying to unmark non marked port", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    expect(() => {
      canvas.unmarkPort("port-1");
    }).toThrow(CanvasError);
  });

  it("should add edge", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    });

    canvas.markPort({
      id: "port-1",
      nodeId: "node-1",
      element: createElement(),
    });

    canvas.addEdge({ from: "port-1", to: "port-1" });

    const container = element.children[0].children[0];

    expect(container.children.length).toBe(2);
  });

  it("should add edge with specified id", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    });

    canvas.markPort({
      id: "port-1",
      nodeId: "node-1",
      element: createElement(),
    });

    canvas.addEdge({ id: "edge-1", from: "port-1", to: "port-1" });

    expect(canvas.graph.getEdge("edge-1")).not.toBe(null);
  });

  it("should add edge with specified default shape", () => {
    const element = document.createElement("div");
    const shape = new BezierEdgeShape();
    const canvas = createCanvas({
      element,
      edgeShapeFactory: () => shape,
    });

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    });

    canvas.markPort({
      id: "port-1",
      nodeId: "node-1",
      element: createElement(),
    });

    canvas.addEdge({ id: "edge-1", from: "port-1", to: "port-1" });

    const container = element.children[0].children[0];
    const edgeSvg = container.children[1];

    expect(edgeSvg).toBe(shape.svg);
  });

  it("should add edge with specified shape", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    });

    canvas.markPort({
      id: "port-1",
      nodeId: "node-1",
      element: createElement(),
    });

    const shape = new BezierEdgeShape();

    canvas.addEdge({ id: "edge-1", from: "port-1", to: "port-1", shape });

    const container = element.children[0].children[0];
    const edgeSvg = container.children[1];

    expect(edgeSvg).toBe(shape.svg);
  });

  it("should add edge with specified default priority", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({
      element,
      edgesPriorityFn: () => 10,
    });

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    });

    canvas.markPort({
      id: "port-1",
      nodeId: "node-1",
      element: createElement(),
    });

    canvas.addEdge({ from: "port-1", to: "port-1" });

    const container = element.children[0].children[0];
    const edgeSvg = container.children[1] as SVGSVGElement;

    expect(edgeSvg.style.zIndex).toBe("10");
  });

  it("should add edge with specified priority", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    });

    canvas.markPort({
      id: "port-1",
      nodeId: "node-1",
      element: createElement(),
    });

    canvas.addEdge({
      id: "edge-1",
      from: "port-1",
      to: "port-1",
      priority: 10,
    });

    const container = element.children[0].children[0];
    const edgeSvg = container.children[1] as SVGSVGElement;

    expect(edgeSvg.style.zIndex).toBe("10");
  });

  it("should not add edge with existing id", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    });

    canvas.markPort({
      id: "port-1",
      nodeId: "node-1",
      element: createElement(),
    });

    canvas.addEdge({ id: "edge-1", from: "port-1", to: "port-1" });

    expect(() => {
      canvas.addEdge({ id: "edge-1", from: "port-1", to: "port-1" });
    }).toThrow(CanvasError);
  });

  it("should not add edge from nonexistent port", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    });

    canvas.markPort({
      id: "port-1",
      nodeId: "node-1",
      element: createElement(),
    });

    expect(() => {
      canvas.addEdge({ id: "edge-1", from: "port-2", to: "port-1" });
    }).toThrow(CanvasError);
  });

  it("should not add edge to nonexistent port", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    });

    canvas.markPort({
      id: "port-1",
      nodeId: "node-1",
      element: createElement(),
    });

    expect(() => {
      canvas.addEdge({ id: "edge-1", from: "port-1", to: "port-2" });
    }).toThrow(CanvasError);
  });

  it("should update edge without parameters", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    });

    const portElement = createElement();

    canvas.markPort({
      id: "port-1",
      nodeId: "node-1",
      element: portElement,
    });

    canvas.addEdge({ id: "edge-1", from: "port-1", to: "port-1" });

    portElement.getBoundingClientRect = (): DOMRect => {
      return new DOMRect(100, 100, 0, 0);
    };

    canvas.updateEdge("edge-1");

    const container = element.children[0].children[0];
    const edgeSvg = container.children[1] as SVGSVGElement;

    expect(edgeSvg.style.transform).toBe("translate(100px, 100px)");
  });

  it("should update edge source", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      ports: [
        {
          id: "port-1",
          element: createElement(),
        },
      ],
    });

    canvas.addNode({
      id: "node-2",
      element: createElement(),
      x: 0,
      y: 0,
      ports: [
        {
          id: "port-2",
          element: createElement(),
        },
      ],
    });

    canvas.addEdge({ id: "edge-1", from: "port-1", to: "port-2" });

    canvas.updateEdge("edge-1", { from: "port-2" });

    const edge = canvas.graph.getEdge("edge-1")!;

    expect(edge.from).toBe("port-2");
  });

  it("should update edge target", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      ports: [
        {
          id: "port-1",
          element: createElement(),
        },
      ],
    });

    canvas.addNode({
      id: "node-2",
      element: createElement(),
      x: 0,
      y: 0,
      ports: [
        {
          id: "port-2",
          element: createElement(),
        },
      ],
    });

    canvas.addEdge({ id: "edge-1", from: "port-1", to: "port-2" });

    canvas.updateEdge("edge-1", { to: "port-1" });

    const edge = canvas.graph.getEdge("edge-1")!;

    expect(edge.to).toBe("port-1");
  });

  it("should update edge priority", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      ports: [
        {
          id: "port-1",
          element: createElement(),
        },
      ],
    });

    canvas.addEdge({ id: "edge-1", from: "port-1", to: "port-1" });

    canvas.updateEdge("edge-1", { priority: 10 });

    const container = element.children[0].children[0];
    const edgeSvg = container.children[1] as SVGSVGElement;

    expect(edgeSvg.style.zIndex).toBe("10");
  });

  it("should update edge shape", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      ports: [
        {
          id: "port-1",
          element: createElement(),
        },
      ],
    });

    const newShape = new BezierEdgeShape();

    canvas.addEdge({ id: "edge-1", from: "port-1", to: "port-1" });

    canvas.updateEdge("edge-1", { shape: newShape });

    const container = element.children[0].children[0];
    const edgeSvg = container.children[1] as SVGSVGElement;

    expect(edgeSvg).toBe(newShape.svg);
  });

  it("should throw error when trying to update nonexistent edge", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    expect(() => {
      canvas.updateEdge("edge-1");
    }).toThrow(CanvasError);
  });

  it("should remove edge", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      ports: [
        {
          id: "port-1",
          element: createElement(),
        },
      ],
    });

    canvas.addEdge({ id: "edge-1", from: "port-1", to: "port-1" });
    canvas.removeEdge("edge-1");

    const container = element.children[0].children[0];

    expect(container.children.length).toBe(1);
  });

  it("should throw error when trying to remove nonexistent edge", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    expect(() => {
      canvas.removeEdge("edge-1");
    }).toThrow(CanvasError);
  });

  it("should patch viewport matrix", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    canvas.patchViewportMatrix({ scale: 2, x: 3, y: 4 });

    const container = element.children[0].children[0] as HTMLElement;

    expect(container.style.transform).toBe("matrix(0.5, 0, 0, 0.5, -1.5, -2)");
  });

  it("should patch content matrix", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    canvas.patchContentMatrix({ scale: 2, x: 3, y: 4 });

    const container = element.children[0].children[0] as HTMLElement;

    expect(container.style.transform).toBe("matrix(2, 0, 0, 2, 3, 4)");
  });

  it("should clear canvas from elements", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    });

    canvas.clear();

    const container = element.children[0].children[0];

    expect(container.children.length).toBe(0);
  });

  it("should reset node id generator", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    canvas.addNode({
      element: createElement(),
      x: 0,
      y: 0,
    });
    canvas.addNode({
      element: createElement(),
      x: 0,
      y: 0,
    });

    canvas.clear();

    canvas.addNode({
      element: createElement(),
      x: 0,
      y: 0,
    });

    expect(canvas.graph.getAllNodeIds()).toEqual([0]);
  });

  it("should reset port id generator", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    const addNode = (): void => {
      canvas.addNode({
        element: createElement(),
        x: 0,
        y: 0,
        ports: [
          {
            element: createElement(),
          },
        ],
      });
    };

    addNode();
    addNode();
    canvas.clear();
    addNode();

    expect(canvas.graph.getAllPortIds()).toEqual([0]);
  });

  it("should reset edge id generator", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    const addElements = (): void => {
      canvas.addNode({
        element: createElement(),
        x: 0,
        y: 0,
        ports: [
          {
            id: "port-1",
            element: createElement(),
          },
        ],
      });

      canvas.addEdge({ from: "port-1", to: "port-1" });
    };

    addElements();
    canvas.addEdge({ from: "port-1", to: "port-1" });
    canvas.clear();
    addElements();

    expect(canvas.graph.getAllEdgeIds()).toEqual([0]);
  });

  it("should clear before destroy", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    const spy = jest.spyOn(canvas, "clear");

    canvas.destroy();

    expect(spy).toHaveBeenCalled();
  });

  it("should clear html on destroy", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    canvas.destroy();

    expect(element.children.length).toBe(0);
  });

  it("should emit event before destroy", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    const onBeforeDestroy = jest.fn();

    canvas.onBeforeDestroy.subscribe(onBeforeDestroy);

    canvas.destroy();

    expect(onBeforeDestroy).toHaveBeenCalled();
  });

  it("should not emit destroy event twice", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });

    const onBeforeDestroy = jest.fn();

    canvas.onBeforeDestroy.subscribe(onBeforeDestroy);

    canvas.destroy();
    canvas.destroy();

    expect(onBeforeDestroy).toHaveBeenCalledTimes(1);
  });

  it("should render adjacent edges when updating node", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });
    const nodeElement = createElement();

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      ports: [
        {
          id: "port-1",
          element: createElement(),
        },
      ],
    });

    const shape = new BezierEdgeShape();
    const spy = jest.spyOn(shape, "render");

    canvas.addEdge({ from: "port-1", to: "port-1", shape });
    canvas.updateNode("node-1");

    expect(spy).toHaveBeenCalled();
  });

  it("should unmark ports before node removal", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });
    const nodeElement = createElement();

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      ports: [
        {
          id: "port-1",
          element: createElement(),
        },
      ],
    });

    const spy = jest.spyOn(canvas, "unmarkPort");

    canvas.removeNode("node-1");

    expect(spy).toHaveBeenCalledWith("port-1");
  });

  it("should render adjacent edges when updating port", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });
    const nodeElement = createElement();

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      ports: [
        {
          id: "port-1",
          element: createElement(),
        },
      ],
    });

    const shape = new BezierEdgeShape();
    const spy = jest.spyOn(shape, "render");

    canvas.addEdge({ from: "port-1", to: "port-1", shape });
    canvas.updatePort("port-1");

    expect(spy).toHaveBeenCalled();
  });

  it("should remove adjacent edges before port unmark", () => {
    const element = document.createElement("div");
    const canvas = createCanvas({ element });
    const nodeElement = createElement();

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      ports: [
        {
          id: "port-1",
          element: createElement(),
        },
      ],
    });

    canvas.addEdge({ id: "edge-1", from: "port-1", to: "port-1" });

    const spy = jest.spyOn(canvas, "removeEdge");

    canvas.unmarkPort("port-1");

    expect(spy).toHaveBeenCalledWith("edge-1");
  });

  it("should throw error when trying to add node with existing element", () => {
    const canvas = createCanvas();

    const nodeElement = createElement();

    canvas.addNode({
      element: nodeElement,
      x: 0,
      y: 0,
    });

    expect(() => {
      canvas.addNode({
        element: nodeElement,
        x: 0,
        y: 0,
      });
    }).toThrow(CanvasError);
  });
});
