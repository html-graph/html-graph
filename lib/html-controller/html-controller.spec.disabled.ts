import {
  AbstractGraphStore,
  EdgePayload,
  GraphStoreMock,
  NodePayload,
  PortPayload,
} from "@/graph-store";
import { HtmlController } from "./html-controller";
import {
  AbstractViewportTransformer,
  ViewportTransformerMock,
} from "@/viewport-transformer";
import { HtmlGraphError } from "@/error";
import { EdgeShapeMock } from "@/edges";
import { Point } from "@/point";

let getContext = null;

let getBoundingRect = null;

const createController = (params?: {
  transformer?: AbstractViewportTransformer;
  store?: AbstractGraphStore;
}): HtmlController => {
  return new HtmlController(
    window.ResizeObserver,
    Element.prototype.getBoundingClientRect,
    params?.store ?? new GraphStoreMock(),
    params?.transformer ?? new ViewportTransformerMock(),
  );
};

const centerFn = (): Point => ({ x: 0, y: 0 });

const createNode = (): NodePayload => {
  return {
    element: document.createElement("div"),
    x: 0,
    y: 0,
    centerFn,
    priority: 0,
  };
};

const createPort = (): PortPayload => {
  return {
    element: document.createElement("div"),
    centerFn,
    direction: 0,
  };
};

const createEdge = (): EdgePayload => {
  return {
    from: 1,
    to: 2,
    shape: new EdgeShapeMock(),
    priority: 0,
  };
};

describe("HtmlController", () => {
  it("should throw error when unable to get canvas content", () => {
    getContext = HTMLCanvasElement.prototype.getContext;

    HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue(null);

    expect(createController).toThrow(HtmlGraphError);

    HTMLCanvasElement.prototype.getContext = getContext;
  });

  it("should attach host to wrapper element", () => {
    const controller = createController();

    const div = document.createElement("div");
    controller.attach(div);

    expect(div.children.length).toBe(1);
  });

  it("should detach host to wrapper element", () => {
    const controller = createController();

    const div = document.createElement("div");
    controller.attach(div);
    controller.detach();

    expect(div.children.length).toBe(0);
  });

  it("should detach before attaching", () => {
    const controller = createController();

    const spy = jest.spyOn(controller, "detach");

    const div = document.createElement("div");
    controller.attach(div);

    expect(spy).toHaveBeenCalled();
  });

  it("should apply transform to container", () => {
    const transformer = new ViewportTransformerMock();

    jest.spyOn(transformer, "getContentMatrix").mockReturnValue({
      scale: 2,
      dx: 3,
      dy: 4,
    });

    const controller = createController({ transformer });
    const div = document.createElement("div");
    controller.attach(div);

    controller.applyTransform();

    const container = div.children[0].children[1] as HTMLDivElement;

    expect(container.style.transform).toBe("matrix(2, 0, 0, 2, 3, 4)");
  });

  it("should attach node", () => {
    const transformer = new ViewportTransformerMock();
    const store = new GraphStoreMock();

    jest.spyOn(store, "getNode").mockReturnValue(createNode());

    const controller = createController({ transformer, store });
    const div = document.createElement("div");
    controller.attach(div);

    controller.attachNode(1);

    const container = div.children[0].children[1];

    expect(container.children[0] instanceof HTMLDivElement).toBe(true);
  });

  it("should detach node", () => {
    const transformer = new ViewportTransformerMock();
    const store = new GraphStoreMock();

    jest.spyOn(store, "getNode").mockReturnValue(createNode());

    const controller = createController({ transformer, store });
    const div = document.createElement("div");
    controller.attach(div);

    controller.attachNode(1);
    controller.detachNode(1);

    const container = div.children[0].children[1];

    expect(container.children[0]).toBe(undefined);
  });

  it("should attach edge", () => {
    const transformer = new ViewportTransformerMock();
    const store: AbstractGraphStore = new GraphStoreMock();

    const nodes = new Map<unknown, NodePayload>([
      [1, createNode()],
      [2, createNode()],
    ]);

    const ports = new Map<unknown, PortPayload>([
      [1, createPort()],
      [2, createPort()],
    ]);

    const edge = createEdge();

    jest.spyOn(store, "getNode").mockImplementation((nodeId) => {
      return nodes.get(nodeId);
    });

    jest.spyOn(store, "getPort").mockImplementation((portId) => {
      return ports.get(portId);
    });

    jest.spyOn(store, "getPortNodeId").mockImplementation((portId) => {
      return portId;
    });

    jest.spyOn(store, "getEdge").mockImplementation(() => {
      return edge;
    });

    const controller = createController({ transformer, store });
    const div = document.createElement("div");
    controller.attach(div);

    controller.attachNode(1);
    controller.attachNode(2);
    controller.attachEdge(1);

    const container = div.children[0].children[1];

    expect(container.children[2]).toBe(edge.shape.svg);
  });

  it("should detach edge", () => {
    const transformer = new ViewportTransformerMock();
    const store: AbstractGraphStore = new GraphStoreMock();

    const nodes = new Map<unknown, NodePayload>([
      [1, createNode()],
      [2, createNode()],
    ]);

    const ports = new Map<unknown, PortPayload>([
      [1, createPort()],
      [2, createPort()],
    ]);

    const edge = createEdge();

    jest.spyOn(store, "getNode").mockImplementation((nodeId) => {
      return nodes.get(nodeId);
    });

    jest.spyOn(store, "getPort").mockImplementation((portId) => {
      return ports.get(portId);
    });

    jest.spyOn(store, "getPortNodeId").mockImplementation((portId) => {
      return portId;
    });

    jest.spyOn(store, "getEdge").mockImplementation(() => {
      return edge;
    });

    const controller = createController({ transformer, store });
    const div = document.createElement("div");
    controller.attach(div);

    controller.attachNode(1);
    controller.attachNode(2);
    controller.attachEdge(1);
    controller.detachEdge(1);

    const container = div.children[0].children[1];

    expect(container.children[2]).toBe(undefined);
  });

  it("should clear nodes and edges", () => {
    const transformer = new ViewportTransformerMock();
    const store: AbstractGraphStore = new GraphStoreMock();

    const nodes = new Map<unknown, NodePayload>([
      [1, createNode()],
      [2, createNode()],
    ]);

    const ports = new Map<unknown, PortPayload>([
      [1, createPort()],
      [2, createPort()],
    ]);

    const edge = createEdge();

    jest.spyOn(store, "getNode").mockImplementation((nodeId) => {
      return nodes.get(nodeId);
    });

    jest.spyOn(store, "getPort").mockImplementation((portId) => {
      return ports.get(portId);
    });

    jest.spyOn(store, "getPortNodeId").mockImplementation((portId) => {
      return portId;
    });

    jest.spyOn(store, "getEdge").mockImplementation(() => {
      return edge;
    });

    const controller = createController({ transformer, store });
    const div = document.createElement("div");
    controller.attach(div);

    controller.attachNode(1);
    controller.attachNode(2);
    controller.attachEdge(1);
    controller.clear();

    const container = div.children[0].children[1];

    expect(container.children.length).toBe(0);
  });

  it("should detach edge", () => {
    const transformer = new ViewportTransformerMock();
    const store: AbstractGraphStore = new GraphStoreMock();

    const nodes = new Map<unknown, NodePayload>([
      [1, createNode()],
      [2, createNode()],
    ]);

    const ports = new Map<unknown, PortPayload>([
      [1, createPort()],
      [2, createPort()],
    ]);

    const edge = createEdge();

    jest.spyOn(store, "getNode").mockImplementation((nodeId) => {
      return nodes.get(nodeId);
    });

    jest.spyOn(store, "getPort").mockImplementation((portId) => {
      return ports.get(portId);
    });

    jest.spyOn(store, "getPortNodeId").mockImplementation((portId) => {
      return portId;
    });

    jest.spyOn(store, "getEdge").mockImplementation(() => {
      return edge;
    });

    const controller = createController({ transformer, store });
    const div = document.createElement("div");
    controller.attach(div);

    controller.attachNode(1);
    controller.attachNode(2);
    controller.attachEdge(1);
    controller.detachEdge(1);

    const container = div.children[0].children[1];

    expect(container.children[2]).toBe(undefined);
  });

  it("should remove subelements on destroy", () => {
    const controller = createController();

    const div = document.createElement("div");
    controller.attach(div);
    controller.destroy();

    expect(div.children.length).toBe(0);
  });

  it("should clear on destroy", () => {
    const controller = createController();

    const spy = jest.spyOn(controller, "clear");

    controller.destroy();

    expect(spy).toHaveBeenCalled();
  });

  it("should detach on destroy", () => {
    const controller = createController();

    const spy = jest.spyOn(controller, "detach");

    controller.destroy();

    expect(spy).toHaveBeenCalled();
  });

  it("should update node coordinates", () => {
    const transformer = new ViewportTransformerMock();
    const store = new GraphStoreMock();

    const node = createNode();
    jest.spyOn(store, "getNode").mockReturnValue(node);

    const controller = createController({ transformer, store });
    const div = document.createElement("div");
    controller.attach(div);

    controller.attachNode(1);

    node.x = 100;
    node.y = 100;
    controller.updateNodeCoordinates(1);

    const container = div.children[0].children[1];
    const nodeWrapper = container.children[0] as HTMLDivElement;

    expect(nodeWrapper.style.transform).toBe("matrix(1, 0, 0, 1, 100, 100)");
  });

  it("should update adjacent edges coordinates when updating node coordinates", () => {
    const transformer = new ViewportTransformerMock();
    const store: AbstractGraphStore = new GraphStoreMock();

    const nodes = new Map<unknown, NodePayload>([
      [1, createNode()],
      [2, createNode()],
    ]);

    const ports = new Map<unknown, PortPayload>([
      [1, createPort()],
      [2, createPort()],
    ]);

    const edge = createEdge();

    jest.spyOn(store, "getNode").mockImplementation((nodeId) => {
      return nodes.get(nodeId);
    });

    jest.spyOn(store, "getPort").mockImplementation((portId) => {
      return ports.get(portId);
    });

    jest.spyOn(store, "getPortNodeId").mockImplementation((portId) => {
      return portId;
    });

    jest.spyOn(store, "getEdge").mockImplementation(() => {
      return edge;
    });

    jest.spyOn(store, "getNodeAdjacentEdgeIds").mockImplementation(() => {
      return [1];
    });

    const controller = createController({ transformer, store });
    const div = document.createElement("div");
    controller.attach(div);

    controller.attachNode(1);
    controller.attachNode(2);
    controller.attachEdge(1);
    const node = nodes.get(1)!;
    node.x = 100;
    node.y = 100;

    const spy = jest.spyOn(edge.shape, "update");

    controller.updateNodeCoordinates(1);

    expect(spy).toHaveBeenCalled();
  });

  it("should update node priority", () => {
    const transformer = new ViewportTransformerMock();
    const store = new GraphStoreMock();

    const node = createNode();
    jest.spyOn(store, "getNode").mockReturnValue(node);

    const controller = createController({ transformer, store });
    const div = document.createElement("div");
    controller.attach(div);

    controller.attachNode(1);

    const container = div.children[0].children[1];
    const nodeWrapper = container.children[0] as HTMLDivElement;

    node.priority = 10;
    controller.updateNodePriority(1);

    expect(nodeWrapper.style.zIndex).toBe("10");
  });

  it("should update edge coordinates", () => {
    const transformer = new ViewportTransformerMock();
    const store: AbstractGraphStore = new GraphStoreMock();

    const nodes = new Map<unknown, NodePayload>([
      [1, createNode()],
      [2, createNode()],
    ]);

    const ports = new Map<unknown, PortPayload>([
      [1, createPort()],
      [2, createPort()],
    ]);

    const edge = createEdge();

    jest.spyOn(store, "getNode").mockImplementation((nodeId) => {
      return nodes.get(nodeId);
    });

    jest.spyOn(store, "getPort").mockImplementation((portId) => {
      return ports.get(portId);
    });

    jest.spyOn(store, "getEdge").mockImplementation(() => {
      return edge;
    });

    const controller = createController({ transformer, store });
    const div = document.createElement("div");
    controller.attach(div);

    controller.attachNode(1);
    controller.attachNode(2);
    controller.attachEdge(1);

    const spy = jest.spyOn(edge.shape, "update");

    controller.updateEdgeShape(1);

    expect(spy).toHaveBeenCalled();
  });

  it("should update edge priority", () => {
    const transformer = new ViewportTransformerMock();
    const store: AbstractGraphStore = new GraphStoreMock();

    const nodes = new Map<unknown, NodePayload>([
      [1, createNode()],
      [2, createNode()],
    ]);

    const ports = new Map<unknown, PortPayload>([
      [1, createPort()],
      [2, createPort()],
    ]);

    const edge = createEdge();

    jest.spyOn(store, "getNode").mockImplementation((nodeId) => {
      return nodes.get(nodeId);
    });

    jest.spyOn(store, "getPort").mockImplementation((portId) => {
      return ports.get(portId);
    });

    jest.spyOn(store, "getEdge").mockImplementation(() => {
      return edge;
    });

    const controller = createController({ transformer, store });
    const div = document.createElement("div");
    controller.attach(div);

    controller.attachNode(1);
    controller.attachNode(2);
    controller.attachEdge(1);

    edge.priority = 10;
    controller.updateEdgePriority(1);

    const container = div.children[0].children[1];
    const edgeSvg = container.children[2] as SVGSVGElement;

    expect(edgeSvg.style.zIndex).toBe("10");
  });

  it("should update port edges", () => {
    const transformer = new ViewportTransformerMock();
    const store: AbstractGraphStore = new GraphStoreMock();

    const nodes = new Map<unknown, NodePayload>([
      [1, createNode()],
      [2, createNode()],
    ]);

    const ports = new Map<unknown, PortPayload>([
      [1, createPort()],
      [2, createPort()],
    ]);

    const edge = createEdge();

    jest.spyOn(store, "getNode").mockImplementation((nodeId) => {
      return nodes.get(nodeId);
    });

    jest.spyOn(store, "getPort").mockImplementation((portId) => {
      return ports.get(portId);
    });

    jest.spyOn(store, "getPortAdjacentEdgeIds").mockImplementation(() => {
      return [1];
    });

    jest.spyOn(store, "getEdge").mockImplementation(() => {
      return edge;
    });

    const controller = createController({ transformer, store });
    const div = document.createElement("div");
    controller.attach(div);

    controller.attachNode(1);
    controller.attachNode(2);
    controller.attachEdge(1);

    const spy = jest.spyOn(edge.shape, "update");
    controller.updatePortEdges(1);

    expect(spy).toHaveBeenCalled();
  });

  it("should update canvas dimensions", () => {
    getBoundingRect = HTMLElement.prototype.getBoundingClientRect;

    window.ResizeObserver = class {
      public constructor(private readonly callback: ResizeObserverCallback) {}

      public disconnect(): void {}

      public observe(element: HTMLElement): void {
        this.callback(
          [
            {
              borderBoxSize: [],
              contentBoxSize: [],
              contentRect: new DOMRect(),
              devicePixelContentBoxSize: [],
              target: element,
            },
          ],
          this,
        );
      }

      public unobserve(): void {}
    };

    HTMLElement.prototype.getBoundingClientRect = (): DOMRect => {
      return new DOMRect(0, 0, 1000, 1000);
    };

    const controller = createController();
    const div = document.createElement("div");
    controller.attach(div);

    const canvas = div.children[0].children[0] as HTMLCanvasElement;

    expect({ width: canvas.width, height: canvas.height }).toStrictEqual({
      width: 1000,
      height: 1000,
    });

    HTMLElement.prototype.getBoundingClientRect = getBoundingRect;
  });

  it("should update adjacent edges on node resize", () => {
    getBoundingRect = HTMLElement.prototype.getBoundingClientRect;

    HTMLElement.prototype.getBoundingClientRect = (): DOMRect => {
      return new DOMRect(0, 0, 100, 100);
    };

    const transformer = new ViewportTransformerMock();
    const store: AbstractGraphStore = new GraphStoreMock();

    const nodes = new Map<unknown, NodePayload>([
      [1, createNode()],
      [2, createNode()],
    ]);

    const ports = new Map<unknown, PortPayload>([
      [1, createPort()],
      [2, createPort()],
    ]);

    const edge = createEdge();

    jest.spyOn(store, "getNode").mockImplementation((nodeId) => {
      return nodes.get(nodeId);
    });

    jest.spyOn(store, "getPort").mockImplementation((portId) => {
      return ports.get(portId);
    });

    jest.spyOn(store, "getPortAdjacentEdgeIds").mockImplementation(() => {
      return [1];
    });

    jest.spyOn(store, "getEdge").mockImplementation(() => {
      return edge;
    });

    const controller = createController({ transformer, store });
    const div = document.createElement("div");
    controller.attach(div);

    controller.attachNode(1);
    controller.attachNode(2);
    controller.attachEdge(1);

    const spy = jest.spyOn(edge.shape, "update");
    const container = div.children[0].children[1];
    const nodeWrapper = container.children[0] as HTMLDivElement;

    // trigger resize here
    nodeWrapper.dispatchEvent(new CustomEvent("custom_resize"));

    expect(spy).toHaveBeenCalled();
    HTMLElement.prototype.getBoundingClientRect = getBoundingRect;
  });
});
