import { GraphStore } from "@/graph-store";
import { ViewportStore } from "@/viewport-store";
import { CoreHtmlView } from "@/html-view";
import { Canvas, CanvasParams } from "@/canvas";
import { BackgroundConfigurator } from "./background-configurator";
import { createElement } from "@/mocks";
import { BackgroundParams } from "./background-params";
import { standardCenterFn } from "@/center-fn";
import { BezierEdgeShape } from "@/edges";

const createCanvas = (): { canvas: Canvas; backgroundElement: HTMLElement } => {
  const graphStore = new GraphStore();
  const viewportStore = new ViewportStore();
  const element = createElement({ width: 2500, height: 1000 });
  const backgroundElement = createElement({ width: 2500, height: 1000 });
  const htmlView = new CoreHtmlView(graphStore, viewportStore, element);

  const canvasParams: CanvasParams = {
    nodes: {
      centerFn: standardCenterFn,
      priorityFn: (): number => 0,
    },
    ports: {
      direction: 0,
    },
    edges: {
      shapeFactory: (): BezierEdgeShape => new BezierEdgeShape(),
      priorityFn: (): number => 0,
    },
  };

  const canvas = new Canvas(
    element,
    graphStore,
    viewportStore,
    htmlView,
    canvasParams,
  );

  const params: BackgroundParams = {
    tileWidth: 10,
    tileHeight: 10,
    renderer: document.createElementNS("http://www.w3.org/2000/svg", "circle"),
    maxViewportScale: 10,
  };

  BackgroundConfigurator.configure(canvas, params, backgroundElement);

  return { canvas, backgroundElement };
};

describe("BackgroundConfigurator", () => {
  it("should create svg on background element", () => {
    const { backgroundElement } = createCanvas();

    expect(backgroundElement.children[0].tagName).toBe("svg");
  });

  it("should set svg dimensions from canvas element", () => {
    const { backgroundElement } = createCanvas();
    const svg = backgroundElement.children[0] as SVGSVGElement;
    const width = svg.getAttribute("width");
    const height = svg.getAttribute("height");

    expect({ width, height }).toEqual({ width: "2500", height: "1000" });
  });

  it("should create svg defs element", () => {
    const { backgroundElement } = createCanvas();
    const svg = backgroundElement.children[0] as SVGSVGElement;
    const defs = svg.children[0];

    expect(defs.tagName).toBe("defs");
  });

  it("should create svg pattern rendering rectangle element", () => {
    const { backgroundElement } = createCanvas();
    const svg = backgroundElement.children[0] as SVGSVGElement;
    const rect = svg.children[1];

    expect(rect.tagName).toBe("rect");
  });

  it("should set pattern rendering rectangle dimensions from canvas element", () => {
    const { backgroundElement } = createCanvas();
    const svg = backgroundElement.children[0] as SVGSVGElement;
    const rect = svg.children[1];
    const width = rect.getAttribute("width");
    const height = rect.getAttribute("height");

    expect({ width, height }).toEqual({ width: "2500", height: "1000" });
  });

  it("should create pattern element", () => {
    const { backgroundElement } = createCanvas();
    const svg = backgroundElement.children[0] as SVGSVGElement;
    const defs = svg.children[0];
    const pattern = defs.children[0];

    expect(pattern.tagName).toBe("pattern");
  });

  it("should pattern element dimensions", () => {
    const { backgroundElement } = createCanvas();
    const svg = backgroundElement.children[0] as SVGSVGElement;
    const defs = svg.children[0];
    const pattern = defs.children[0];
    const width = pattern.getAttribute("width");
    const height = pattern.getAttribute("height");

    expect({ width, height }).toEqual({ width: "0.004", height: "0.01" });
  });

  it("should transform pattern content to center", () => {
    const { backgroundElement } = createCanvas();
    const svg = backgroundElement.children[0] as SVGSVGElement;
    const defs = svg.children[0];
    const pattern = defs.children[0];
    const patternContent = pattern.children[0] as SVGElement;
    const transform = patternContent.getAttribute("transform");

    expect(transform).toBe("translate(5, 5)");
  });

  it("should set initial patternTransform", () => {
    const { backgroundElement } = createCanvas();
    const svg = backgroundElement.children[0] as SVGSVGElement;
    const defs = svg.children[0];
    const pattern = defs.children[0];
    const transform = pattern.getAttribute("patternTransform");

    expect(transform).toBe("matrix(1, 0, 0, 1, -5, -5)");
  });

  it("should update patternTransform after viewport transform", () => {
    const { backgroundElement, canvas } = createCanvas();
    const svg = backgroundElement.children[0] as SVGSVGElement;
    const defs = svg.children[0];
    const pattern = defs.children[0];
    canvas.patchViewportMatrix({ scale: 2, x: 100, y: 100 });

    const transform = pattern.getAttribute("patternTransform");

    expect(transform).toBe("matrix(0.5, 0, 0, 0.5, -52.5, -52.5)");
  });

  it("should hide svg when scale is too large", () => {
    const { backgroundElement, canvas } = createCanvas();
    canvas.patchViewportMatrix({ scale: 100 });

    const svg = backgroundElement.children[0];

    expect(svg).toBe(undefined);
  });

  it("should show svg when scale goes back below top boundary", () => {
    const { backgroundElement, canvas } = createCanvas();
    canvas.patchViewportMatrix({ scale: 100 });
    canvas.patchViewportMatrix({ scale: 5 });

    const svg = backgroundElement.children[0];

    expect(svg).not.toBe(undefined);
  });

  it("should destroy configuaration", () => {
    const { canvas } = createCanvas();

    canvas.destroy();
  });
});
