import { ApiPortsPayload, Canvas } from "../../lib/main";

const canvasElement = document.getElementById("canvas")!;

const canvas = new Canvas(canvasElement, {
  scale: { enabled: true },
  shift: { enabled: true },
  nodes: { draggable: true, centerFn: () => [0, 0] },
  background: { type: "dots" },
});

class HtmlBuilder {
  createNodeElement(
    name: string,
    frontPortId: string,
    ports: Record<string, string>,
    footerContent?: HTMLElement,
  ): [HTMLElement, Record<string, ApiPortsPayload>] {
    const node = document.createElement("div");
    node.classList.add("node");

    let portElements: Record<string, ApiPortsPayload> = {};

    const inputPort = this.createInputPort();
    node.appendChild(inputPort);
    portElements[frontPortId] = { element: inputPort, dir: 0 };

    const content = this.createContentElement();
    node.appendChild(content);

    const input = this.createInputElement(name);
    content.appendChild(input);

    if (Object.keys(ports).length > 0) {
      const [body, elements] = this.createBodyElement(ports);
      content.appendChild(body);
      portElements = { ...portElements, ...elements };
    }

    if (footerContent) {
      const footer = document.createElement("div");
      footer.classList.add("node-footer");
      footer.appendChild(footerContent);
      content.appendChild(footer);
    }

    return [node, portElements];
  }

  prepareNodeTextareaElement(element: HTMLElement): void {
    let hover = false;

    element.addEventListener("mouseover", () => {
      hover = true;
    });

    element.addEventListener("mouseleave", () => {
      hover = false;
    });

    element.addEventListener("pointermove", (event: Event) => {
      if (hover && document.activeElement === event.target) {
        event.stopPropagation();
      }
    });

    element.addEventListener("wheel", (event: Event) => {
      if (hover) {
        event.stopPropagation();
      }
    });
  }

  private createInputPort(): HTMLElement {
    const inputPort = document.createElement("div");
    inputPort.classList.add("node-port");

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
  ): [HTMLElement, Record<string, ApiPortsPayload>] {
    const body = document.createElement("div");
    body.classList.add("node-body");

    const portElements: Record<string, ApiPortsPayload> = {};

    Object.entries(ports).forEach(([key, value]) => {
      const portContent = document.createElement("div");
      portContent.classList.add("node-port-content");
      portContent.innerText = value;

      body.appendChild(portContent);
      portElements[key] = {
        element: portContent,
        centerFn: (w, h) => [w, h / 2],
        dir: 0,
      };
    });

    return [body, portElements];
  }

  private prepareNodeInputElement(element: HTMLElement): void {
    let hover = false;

    element.addEventListener("pointerover", () => {
      hover = true;
    });

    element.addEventListener("pointerleave", () => {
      hover = false;
    });

    element.addEventListener("pointermove", (event: Event) => {
      if (hover && document.activeElement === event.target) {
        event.stopPropagation();
      }
    });
  }
}

const builder = new HtmlBuilder();

const [node1, ports1] = builder.createNodeElement("Node 1", "input-1", {
  "output-1-1": "Port 1",
  "output-1-2": "Port 2",
});

const area = document.createElement("textarea");
area.classList.add("node-text");
area.value =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
builder.prepareNodeTextareaElement(area);

const [node2, ports2] = builder.createNodeElement(
  "Node 2",
  "input-2",
  {
    "output-2-1": "Port 1",
    "output-2-2": "Port 2",
    "output-2-3": "Port 3",
  },
  area,
);

canvas
  .addNode({ element: node1, x: 200, y: 400, ports: ports1 })
  .addNode({ element: node2, x: 600, y: 500, ports: ports2 })
  .addConnection({ from: "output-1-2", to: "input-2" });
