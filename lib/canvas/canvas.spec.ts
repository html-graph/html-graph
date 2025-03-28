import { CanvasController, CoreCanvasController } from "@/canvas-controller";
import { GraphStore } from "@/graph-store";
import { CoreHtmlView } from "@/html-view";
import { ViewportTransformer } from "@/viewport-transformer";
import { Canvas } from "./canvas";
import { AddNodeRequest } from "./add-node-request";
import { CanvasOptions } from "./options";
import { CenterFn } from "@/center-fn";
import { HtmlGraphError } from "@/error";
import { UpdateNodeRequest } from "./update-node-request";
import { MarkPortRequest } from "./mark-port-request";

const createCanvas = (
  options: CanvasOptions,
): {
  canvas: Canvas;
  controller: CanvasController;
} => {
  const graphStore = new GraphStore();
  const viewportTransformer = new ViewportTransformer();

  const controller = new CoreCanvasController(
    graphStore,
    viewportTransformer,
    new CoreHtmlView(graphStore, viewportTransformer),
  );

  const canvas = new Canvas(controller, options);

  return { canvas, controller };
};

describe("Canvas", () => {
  it("should attach controller", () => {
    const { canvas, controller } = createCanvas({});

    const spy = jest.spyOn(controller, "attach");

    canvas.attach(document.createElement("div"));

    expect(spy).toHaveBeenCalled();
  });

  it("should detach controller", () => {
    const { canvas, controller } = createCanvas({});

    const spy = jest.spyOn(controller, "detach");

    canvas.detach();

    expect(spy).toHaveBeenCalled();
  });

  it("should add node on controller with specified element", () => {
    const { canvas, controller } = createCanvas({});

    const spy = jest.spyOn(controller, "addNode");

    const element = document.createElement("div");

    const addNodeRequest: AddNodeRequest = {
      element,
      x: 0,
      y: 0,
    };

    canvas.addNode(addNodeRequest);

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ element }));
  });

  it("should add node on controller with specified coordinates", () => {
    const { canvas, controller } = createCanvas({});

    const spy = jest.spyOn(controller, "addNode");

    const addNodeRequest: AddNodeRequest = {
      element: document.createElement("div"),
      x: 10,
      y: 20,
    };

    canvas.addNode(addNodeRequest);

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ x: 10, y: 20 }));
  });

  it("should add node on controller with specified id", () => {
    const { canvas, controller } = createCanvas({});

    const spy = jest.spyOn(controller, "addNode");

    const addNodeRequest: AddNodeRequest = {
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
    };

    canvas.addNode(addNodeRequest);

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ id: "node-1" }));
  });

  it("should add node on controller with default center fn when none specified", () => {
    const centerFn: CenterFn = () => ({ x: 0, y: 0 });

    const { canvas, controller } = createCanvas({ nodes: { centerFn } });

    const spy = jest.spyOn(controller, "addNode");

    const addNodeRequest: AddNodeRequest = {
      element: document.createElement("div"),
      x: 0,
      y: 0,
    };

    canvas.addNode(addNodeRequest);

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ centerFn }));
  });

  it("should add node on controller with specified center fn", () => {
    const centerFn: CenterFn = () => ({ x: 0, y: 0 });

    const { canvas, controller } = createCanvas({});

    const spy = jest.spyOn(controller, "addNode");

    const addNodeRequest: AddNodeRequest = {
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn,
    };

    canvas.addNode(addNodeRequest);

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ centerFn }));
  });

  it("should add node on controller with default priority when none specified", () => {
    const { canvas, controller } = createCanvas({ nodes: { priority: 10 } });

    const spy = jest.spyOn(controller, "addNode");

    const addNodeRequest: AddNodeRequest = {
      element: document.createElement("div"),
      x: 0,
      y: 0,
    };

    canvas.addNode(addNodeRequest);

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ priority: 10 }));
  });

  it("should add node on controller with specified priority", () => {
    const { canvas, controller } = createCanvas({});

    const spy = jest.spyOn(controller, "addNode");

    const addNodeRequest: AddNodeRequest = {
      element: document.createElement("div"),
      x: 0,
      y: 0,
      priority: 10,
    };

    canvas.addNode(addNodeRequest);

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ priority: 10 }));
  });

  it("should throw error when trying to add node with existing id", () => {
    const { canvas } = createCanvas({});

    const addNodeRequest: AddNodeRequest = {
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
    };

    canvas.addNode(addNodeRequest);

    expect(() => {
      canvas.addNode(addNodeRequest);
    }).toThrow(HtmlGraphError);
  });

  it("should update node without parameters", () => {
    const { canvas, controller } = createCanvas({});

    const addNodeRequest: AddNodeRequest = {
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
    };

    canvas.addNode(addNodeRequest);

    const spy = jest.spyOn(controller, "updateNode");

    canvas.updateNode("node-1");

    expect(spy).toHaveBeenCalledWith("node-1", {});
  });

  it("should update node with spcified parameters", () => {
    const { canvas, controller } = createCanvas({});

    const addNodeRequest: AddNodeRequest = {
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
    };

    canvas.addNode(addNodeRequest);

    const spy = jest.spyOn(controller, "updateNode");

    const updateNodeRequest: UpdateNodeRequest = {
      x: 10,
      y: 20,
      centerFn: () => ({ x: 0, y: 0 }),
      priority: 10,
    };

    canvas.updateNode("node-1", updateNodeRequest);

    expect(spy).toHaveBeenCalledWith("node-1", updateNodeRequest);
  });

  it("should throw error when trying to update nonexisting node", () => {
    const { canvas } = createCanvas({});

    expect(() => {
      canvas.updateNode("node-1");
    }).toThrow(HtmlGraphError);
  });

  it("should remove node", () => {
    const { canvas, controller } = createCanvas({});

    const addNodeRequest: AddNodeRequest = {
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
    };

    canvas.addNode(addNodeRequest);

    const spy = jest.spyOn(controller, "removeNode");

    canvas.removeNode("node-1");

    expect(spy).toHaveBeenCalledWith("node-1");
  });

  it("should throw error when trying to remove nonexisting node", () => {
    const { canvas } = createCanvas({});

    expect(() => {
      canvas.removeNode("node-1");
    }).toThrow(HtmlGraphError);
  });

  it("should mark specified port on controller", () => {
    const { canvas, controller } = createCanvas({});

    const portElement = document.createElement("div");

    const addNodeRequest: AddNodeRequest = {
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
    };

    const markPortRequest: MarkPortRequest = {
      nodeId: "node-1",
      element: portElement,
    };

    canvas.addNode(addNodeRequest);

    const spy = jest.spyOn(controller, "markPort");

    canvas.markPort(markPortRequest);

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ nodeId: "node-1", element: portElement }),
    );
  });

  it("should mark specified port with default direction when none specified", () => {
    const { canvas, controller } = createCanvas({
      ports: { direction: Math.PI },
    });

    const portElement = document.createElement("div");

    const addNodeRequest: AddNodeRequest = {
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
    };

    const markPortRequest: MarkPortRequest = {
      nodeId: "node-1",
      element: portElement,
    };

    canvas.addNode(addNodeRequest);

    const spy = jest.spyOn(controller, "markPort");

    canvas.markPort(markPortRequest);

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ direction: Math.PI }),
    );
  });

  it("should throw error when trying to add port with existing id", () => {
    const { canvas } = createCanvas({});

    const portElement = document.createElement("div");

    const addNodeRequest: AddNodeRequest = {
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
    };

    const markPortRequest: MarkPortRequest = {
      id: "port-1",
      nodeId: "node-1",
      element: portElement,
    };

    canvas.addNode(addNodeRequest);
    canvas.markPort(markPortRequest);

    expect(() => {
      canvas.markPort(markPortRequest);
    }).toThrow(HtmlGraphError);
  });

  it("should throw error when trying to add port to nonexisting node", () => {
    const { canvas } = createCanvas({});

    const portElement = document.createElement("div");

    const markPortRequest: MarkPortRequest = {
      nodeId: "node-1",
      element: portElement,
    };

    expect(() => {
      canvas.markPort(markPortRequest);
    }).toThrow(HtmlGraphError);
  });

  it("should mark specified ports when adding node", () => {
    const { canvas } = createCanvas({});

    const portElement = document.createElement("div");

    const addNodeRequest: AddNodeRequest = {
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      ports: [
        {
          id: "port-1",
          element: portElement,
          direction: Math.PI,
        },
      ],
    };

    const spy = jest.spyOn(canvas, "markPort");

    canvas.addNode(addNodeRequest);

    expect(spy).toHaveBeenCalledWith({
      id: "port-1",
      element: portElement,
      nodeId: "node-1",
      direction: Math.PI,
    });
  });
});
