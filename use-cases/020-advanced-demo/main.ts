import {
  AddEdgeRequest,
  AddNodeRequest,
  CoreOptions,
  HtmlGraphBuilder,
  MarkNodePortRequest,
  TransformOptions,
} from "@html-graph/html-graph";
import { backgroundDrawingFn } from "../shared/background-drawing-fn";

export class AdvancedDemoHelper {
  public createNode(
    name: string,
    x: number,
    y: number,
    frontPortId: string | null,
    ports: Record<string, string>,
    footerContent?: HTMLElement,
  ): AddNodeRequest {
    const node = document.createElement("div");
    node.classList.add("node");

    const portElements: MarkNodePortRequest[] = [];

    if (frontPortId !== null) {
      const inputPort = this.createInputPort();
      node.appendChild(inputPort);
      portElements.push({ id: frontPortId, element: inputPort });
    }

    const content = this.createContentElement();
    node.appendChild(content);

    const input = this.createInputElement(name);
    content.appendChild(input);

    if (Object.keys(ports).length > 0) {
      const [body, elements] = this.createBodyElement(ports);
      content.appendChild(body);
      elements.forEach((value) => {
        portElements.push(value);
      });
    }

    if (footerContent) {
      const footer = document.createElement("div");
      footer.classList.add("node-footer");
      footer.appendChild(footerContent);
      content.appendChild(footer);
    }

    return {
      element: node,
      x,
      y,
      ports: portElements,
    };
  }

  public createTextArea(): HTMLElement {
    const area = document.createElement("textarea");
    area.classList.add("node-text");
    area.value =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    this.prepareNodeTextareaElement(area);

    return area;
  }

  private createInputPort(): HTMLElement {
    const inputPort = document.createElement("div");
    inputPort.classList.add("node-port");
    inputPort.classList.add("node-port-input");

    return inputPort;
  }

  private createContentElement(): HTMLElement {
    const content = document.createElement("div");
    content.classList.add("node-content");

    return content;
  }

  private createInputElement(name: string): HTMLElement {
    const input = document.createElement("input");
    input.classList.add("node-input");
    input.placeholder = "Enter node name";
    input.value = name;
    this.prepareNodeInputElement(input);

    return input;
  }

  private createBodyElement(
    ports: Record<string, string>,
  ): [HTMLElement, MarkNodePortRequest[]] {
    const body = document.createElement("div");
    body.classList.add("node-body");

    const portElements: MarkNodePortRequest[] = [];

    Object.entries(ports).forEach(([key, value]) => {
      const portContent = document.createElement("div");
      portContent.classList.add("node-port-content");
      portContent.innerText = value;

      const port = document.createElement("div");
      port.classList.add("node-port");
      port.classList.add("node-port-output");
      portContent.appendChild(port);

      body.appendChild(portContent);
      portElements.push({ id: key, element: port });
    });

    return [body, portElements];
  }

  private prepareNodeInputElement(element: HTMLElement): void {
    element.addEventListener("mousemove", (event: Event) => {
      if (document.activeElement === event.target) {
        event.stopPropagation();
      }
    });
  }

  private prepareNodeTextareaElement(element: HTMLElement): void {
    let hover = false;

    element.addEventListener("mouseover", () => {
      hover = true;
    });

    element.addEventListener("mouseleave", () => {
      hover = false;
    });

    element.addEventListener("mousemove", (event: Event) => {
      if (document.activeElement === event.target) {
        event.stopPropagation();
      }
    });

    element.addEventListener("wheel", (event: Event) => {
      if (hover) {
        event.stopPropagation();
      }
    });
  }
}

const canvasElement = document.getElementById("canvas")!;

const backgroundElement = document.getElementById(
  "background",
)! as HTMLCanvasElement;

const ctx = backgroundElement.getContext("2d")!;

new ResizeObserver(() => {
  const { width, height } = canvasElement.getBoundingClientRect();

  ctx.canvas.width = width;
  ctx.canvas.height = height;

  backgroundDrawingFn(ctx, canvas.transformation);
}).observe(canvasElement);

const coreOptions: CoreOptions = {
  nodes: {
    centerFn: () => ({ x: 0, y: 0 }),
  },
  edges: {
    shape: {
      color: "var(--color-edge)",
      hasTargetArrow: true,
    },
  },
};

const transformOptions: TransformOptions = {
  events: {
    onTransformFinished: () => {
      backgroundDrawingFn(ctx, canvas.transformation);
    },
  },
};

const builder = new HtmlGraphBuilder();

const canvas = builder
  .setOptions(coreOptions)
  .setUserDraggableNodes()
  .setUserTransformableCanvas(transformOptions)
  .setResizeReactiveNodes()
  .build();

const helper = new AdvancedDemoHelper();

const addNode1Request: AddNodeRequest = helper.createNode(
  "Node 1",
  200,
  400,
  null,
  {
    "output-1-1": "Port 1",
    "output-1-2": "Port 2",
  },
);

const addNode2Request: AddNodeRequest = helper.createNode(
  "Node 2",
  600,
  500,
  "input-2",
  {
    "output-2-1": "Port 1",
    "output-2-2": "Port 2",
    "output-2-3": "Port 3",
  },
  helper.createTextArea(),
);

const addNode3Request: AddNodeRequest = helper.createNode(
  "Node 3",
  600,
  200,
  "input-3",
  {
    "output-3-1": "Port 1",
    "output-3-2": "Port 2",
    "output-3-3": "Port 3",
  },
);

const addNode4Request: AddNodeRequest = helper.createNode(
  "Node 4",
  1100,
  400,
  "input-4",
  {
    "output-4-1": "Port 1",
  },
);

const addNode5Request: AddNodeRequest = helper.createNode(
  "Node 5",
  1100,
  550,
  "input-5",
  {
    "output-5-1": "Port 1",
    "output-5-2": "Port 2",
  },
);

const addEdge1Request: AddEdgeRequest = {
  from: "output-1-1",
  to: "input-3",
};

const addEdge2Request: AddEdgeRequest = {
  from: "output-1-2",
  to: "input-2",
};

const addEdge3Request: AddEdgeRequest = {
  from: "output-2-1",
  to: "input-4",
};

const addEdge4Request: AddEdgeRequest = {
  from: "output-3-1",
  to: "input-4",
};

const addEdge5Request: AddEdgeRequest = {
  from: "output-2-2",
  to: "input-5",
};

canvas
  .attach(canvasElement)
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addNode(addNode3Request)
  .addNode(addNode4Request)
  .addNode(addNode5Request)
  .addEdge(addEdge1Request)
  .addEdge(addEdge2Request)
  .addEdge(addEdge3Request)
  .addEdge(addEdge4Request)
  .addEdge(addEdge5Request);
