import { Canvas } from "@/canvas";
import { GraphStore } from "@/graph-store";
import { CoreHtmlView } from "@/html-view";
import { ViewportStore } from "@/viewport-store";
import { UserConnectablePortsConfigurator } from "./user-connectable-ports-configurator";
import { createElement, createTouch } from "@/mocks";
import { ConnectablePortsOptions } from "./options";

const createCanvas = (params?: {
  mainElement?: HTMLElement;
  overlayElement?: HTMLElement;
  connectOptions?: ConnectablePortsOptions;
}): Canvas => {
  const graphStore = new GraphStore();
  const viewportStore = new ViewportStore();
  const mainElement =
    params?.mainElement ?? createElement({ width: 1000, height: 1000 });
  const overlayElement =
    params?.overlayElement ?? createElement({ width: 1000, height: 1000 });
  const htmlView = new CoreHtmlView(graphStore, viewportStore, mainElement);

  const canvas = new Canvas(
    mainElement,
    graphStore,
    viewportStore,
    htmlView,
    {},
  );

  UserConnectablePortsConfigurator.configure(
    canvas,
    overlayElement,
    viewportStore,
    window,
    {},
    params?.connectOptions ?? {},
  );

  return canvas;
};

const createNode = (canvas: Canvas, portElement: HTMLElement): void => {
  const nodeElement = document.createElement("div");

  canvas.addNode({
    element: nodeElement,
    x: 0,
    y: 0,
    ports: [{ element: portElement }],
  });
};

describe("UserConnectablePortsConfigurator", () => {
  it("should create overlay graph on port mouse grab", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ overlayElement });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(new MouseEvent("mousedown"));

    expect(overlayElement.children[0].children[0].children.length).toBe(3);
  });

  it("should not create overlay graph when event verifier not matched", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({
      overlayElement,
      connectOptions: {
        mouseDownEventVerifier: (event: MouseEvent) => event.button === 0,
      },
    });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(new MouseEvent("mousedown", { button: 1 }));

    expect(overlayElement.children[0].children[0].children.length).toBe(0);
  });

  it("should not create overlay graph connection type is null", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({
      overlayElement,
      connectOptions: {
        connectionTypeResolver: () => null,
      },
    });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(new MouseEvent("mousedown"));

    expect(overlayElement.children[0].children[0].children.length).toBe(0);
  });

  it("should create overlay graph on touch start", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ overlayElement });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    expect(overlayElement.children[0].children[0].children.length).toBe(3);
  });
});
