import { Point } from "@/point";
import { DiContainer } from "./di-container";
import { CenterFn } from "@/center-fn";
import { AddNodeRequest, MarkNodePortRequest } from "@/canvas-controller";
import { EdgeShapeMock } from "@/edges";

const nodesCenterFn: CenterFn = (width, height): Point => ({
  x: width / 2,
  y: height / 2,
});
const nodesPriorityFn = (): number => 10;
const portsCenterFn: CenterFn = (width, height): Point => ({
  x: width / 2,
  y: height / 2,
});
const portsDirection = Math.PI;
const edgesPriorityFn = (): number => 20;

const createElement = (params?: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}): HTMLElement => {
  const div = document.createElement("div");

  div.getBoundingClientRect = (): DOMRect => {
    return new DOMRect(
      params?.x ?? 0,
      params?.y ?? 0,
      params?.width ?? 0,
      params?.height ?? 0,
    );
  };

  return div;
};

describe("DiContainer", () => {
  it("should set nodes center fn as default", () => {
    const container = new DiContainer({
      nodesCenterFn,
      nodesPriorityFn,
      portsCenterFn,
      portsDirection,
      edgesPriorityFn,
    });

    container.canvasController.addNode({
      nodeId: "node-1",
      element: createElement({ width: 100, height: 100 }),
      x: 0,
      y: 0,
      ports: undefined,
      centerFn: undefined,
      priority: undefined,
    });

    const div = document.createElement("div");
    container.canvasController.attach(div);

    const containerElement = div.children[0].children[0];
    const element = containerElement.children[0] as HTMLElement;

    expect(element.style.transform).toBe(`translate(-50px, -50px)`);
  });

  it("should set ports center fn as default", () => {
    const container = new DiContainer({
      nodesCenterFn,
      nodesPriorityFn,
      portsCenterFn,
      portsDirection,
      edgesPriorityFn,
    });

    const div = document.createElement("div");
    container.canvasController.attach(div);

    const markPortRequest1: MarkNodePortRequest = {
      id: "port-1",
      element: createElement({ width: 100, height: 100 }),
      centerFn: undefined,
      direction: undefined,
    };

    container.canvasController.addNode({
      nodeId: undefined,
      element: createElement({ x: 100, y: 100, width: 100, height: 100 }),
      x: 0,
      y: 0,
      ports: [markPortRequest1],
      centerFn: undefined,
      priority: undefined,
    });

    const markPortRequest2: MarkNodePortRequest = {
      id: "port-2",
      element: createElement({ x: 100, y: 100 }),
      centerFn: undefined,
      direction: undefined,
    };

    container.canvasController.addNode({
      nodeId: undefined,
      element: createElement(),
      x: 0,
      y: 0,
      ports: [markPortRequest2],
      centerFn: undefined,
      priority: undefined,
    });

    const edgeShape = new EdgeShapeMock();

    container.canvasController.addEdge({
      edgeId: undefined,
      from: "port-1",
      to: "port-2",
      shapeFactory: () => edgeShape,
      priority: undefined,
    });

    const containerElement = div.children[0].children[0];
    const element = containerElement.children[2] as SVGSVGElement;

    expect(element.style.transform).toBe(`translate(50px, 50px)`);
  });

  it("should set ports direction as default", () => {
    const container = new DiContainer({
      nodesCenterFn,
      nodesPriorityFn,
      portsCenterFn,
      portsDirection,
      edgesPriorityFn,
    });

    const div = document.createElement("div");
    container.canvasController.attach(div);

    const markPortRequest1: MarkNodePortRequest = {
      id: "port-1",
      element: createElement(),
      centerFn: undefined,
      direction: undefined,
    };

    container.canvasController.addNode({
      nodeId: undefined,
      element: createElement(),
      x: 0,
      y: 0,
      ports: [markPortRequest1],
      centerFn: undefined,
      priority: undefined,
    });

    const markPortRequest2: MarkNodePortRequest = {
      id: "port-2",
      element: createElement({ x: 100, y: 100 }),
      centerFn: undefined,
      direction: undefined,
    };

    container.canvasController.addNode({
      nodeId: undefined,
      element: createElement(),
      x: 0,
      y: 0,
      ports: [markPortRequest2],
      centerFn: undefined,
      priority: undefined,
    });

    const edgeShape = new EdgeShapeMock();

    const spy = jest.spyOn(edgeShape, "update");

    container.canvasController.addEdge({
      edgeId: undefined,
      from: "port-1",
      to: "port-2",
      shapeFactory: () => edgeShape,
      priority: undefined,
    });

    expect(spy).toHaveBeenCalledWith(
      { x: 100, y: 100 },
      1,
      1,
      Math.PI,
      Math.PI,
    );
  });

  it("should set nodes priority as default", () => {
    const container = new DiContainer({
      nodesCenterFn,
      nodesPriorityFn,
      portsCenterFn,
      portsDirection,
      edgesPriorityFn,
    });

    container.canvasController.addNode({
      nodeId: "node-1",
      element: createElement({ width: 100, height: 100 }),
      x: 0,
      y: 0,
      ports: undefined,
      centerFn: undefined,
      priority: undefined,
    });

    const div = document.createElement("div");
    container.canvasController.attach(div);

    const containerElement = div.children[0].children[0];
    const element = containerElement.children[0] as HTMLElement;

    expect(element.style.zIndex).toBe("10");
  });

  it("should set edges priority fn as default", () => {
    const container = new DiContainer({
      nodesCenterFn,
      nodesPriorityFn,
      portsCenterFn,
      portsDirection,
      edgesPriorityFn,
    });

    const markPortRequest1: MarkNodePortRequest = {
      id: "port-1",
      element: document.createElement("div"),
      centerFn: undefined,
      direction: undefined,
    };

    const addNodeRequest1: AddNodeRequest = {
      nodeId: undefined,
      element: createElement(),
      x: 0,
      y: 0,
      ports: [markPortRequest1],
      centerFn: undefined,
      priority: undefined,
    };

    container.canvasController.addNode(addNodeRequest1);

    const markPortRequest2: MarkNodePortRequest = {
      id: "port-2",
      element: document.createElement("div"),
      centerFn: undefined,
      direction: undefined,
    };

    const addNodeRequest2: AddNodeRequest = {
      nodeId: undefined,
      element: createElement(),
      x: 0,
      y: 0,
      ports: [markPortRequest2],
      centerFn: undefined,
      priority: undefined,
    };

    container.canvasController.addNode(addNodeRequest2);

    container.canvasController.addEdge({
      edgeId: undefined,
      from: markPortRequest1.id,
      to: markPortRequest2.id,
      shapeFactory: () => new EdgeShapeMock(),
      priority: undefined,
    });

    const div = document.createElement("div");
    container.canvasController.attach(div);

    const containerElement = div.children[0].children[0];
    const edgeSvg = containerElement.children[2] as HTMLElement;

    expect(edgeSvg.style.zIndex).toBe("20");
  });
});
