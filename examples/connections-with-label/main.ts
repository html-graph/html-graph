import {
  MarkNodePortRequest,
  BezierConnectionController,
  HtmlGraphBuilder,
  PortPayload,
  ConnectionController,
} from "@html-graph/html-graph";

const canvas = new HtmlGraphBuilder()
  .setOptions({
    background: { type: "dots" },
    connections: { hasTargetArrow: true },
  })
  .setDraggableNodes()
  .setTransformableCanvas()
  .build();

function createNode(
  name: string,
  frontPortId: string,
  backPortId: string,
): [HTMLElement, Record<string, MarkNodePortRequest>] {
  const node = document.createElement("div");
  node.classList.add("node");

  const frontPort = document.createElement("div");
  node.appendChild(frontPort);

  const text = document.createElement("div");
  text.innerText = name;
  node.appendChild(text);

  const backPort = document.createElement("div");
  node.appendChild(backPort);

  return [node, { [frontPortId]: frontPort, [backPortId]: backPort }];
}

const [node1, ports1] = createNode("Node 1", "port-1-1", "port-1-2");
const [node2, ports2] = createNode("Node 2", "port-2-1", "port-2-2");

class CustomConnectionController implements ConnectionController {
  private controller = new BezierConnectionController(
    "#5c5c5c",
    1,
    90,
    15,
    4,
    false,
    true,
  );

  public readonly svg = this.controller.svg;

  private readonly text = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text",
  );

  private readonly rect = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect",
  );

  private readonly radius = 5;

  public constructor(name: string) {
    this.text.textContent = name;

    this.rect.setAttribute("fill", "#fff");
    this.rect.setAttribute("stroke", "#5c5c5c");
    this.rect.setAttribute("rx", `${this.radius}`);
    this.text.setAttribute("dominant-baseline", "middle");
    this.text.setAttribute("text-anchor", "middle");
    this.svg.appendChild(this.rect);
    this.svg.appendChild(this.text);
  }

  public update(
    x: number,
    y: number,
    width: number,
    height: number,
    from: PortPayload,
    to: PortPayload,
  ): void {
    this.controller.update(x, y, width, height, from, to);

    const box = this.text.getBBox();

    this.rect.setAttribute("x", `${(width - box.width) / 2 - this.radius}`);
    this.rect.setAttribute("y", `${(height - box.height) / 2 - this.radius}`);
    this.rect.setAttribute("width", `${box.width + 2 * this.radius}`);
    this.rect.setAttribute("height", `${box.height + 2 * this.radius}`);

    this.text.setAttribute("x", `${width / 2}`);
    this.text.setAttribute("y", `${height / 2}`);
  }
}

const canvasElement = document.getElementById("canvas")!;

canvas
  .attach(canvasElement)
  .addNode({ element: node1, x: 200, y: 400, ports: ports1 })
  .addNode({ element: node2, x: 470, y: 600, ports: ports2 })
  .addConnection({
    from: "port-1-2",
    to: "port-2-1",
    options: {
      type: "custom",
      controllerFactory: () => new CustomConnectionController("Connection 1"),
    },
  });
