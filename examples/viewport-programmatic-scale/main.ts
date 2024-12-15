import {
  Canvas,
  HtmlGraphBuilder,
  MarkNodePortRequest,
} from "@html-graph/html-graph";

const canvas = new HtmlGraphBuilder()
  .setOptions({
    background: { type: "dots" },
    connections: { hasTargetArrow: true },
  })
  .setUserDraggableNodes()
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
const [node3, ports3] = createNode("Node 3", "port-3-1", "port-3-2");
const [node4, ports4] = createNode("Node 4", "port-4-1", "port-4-2");

const canvasElement = document.getElementById("canvas")!;

canvas
  .attach(canvasElement)
  .addNode({ element: node1, x: 200, y: 400, ports: ports1 })
  .addNode({ element: node2, x: 600, y: 500, ports: ports2 })
  .addNode({ element: node3, x: 200, y: 800, ports: ports3 })
  .addNode({ element: node4, x: 1000, y: 600, ports: ports4 })
  .addConnection({ from: "port-1-2", to: "port-2-1" })
  .addConnection({ from: "port-3-2", to: "port-2-1" })
  .addConnection({ from: "port-2-2", to: "port-4-1" });

class ViewportTransformer {
  private readonly scaleVelocity = 1.2;

  public constructor(
    private readonly element: HTMLElement,
    private readonly canvas: Canvas,
  ) {
    this.element.addEventListener("wheel", (event) => {
      const { left, top } = this.element.getBoundingClientRect();
      const centerX = event.clientX - left;
      const centerY = event.clientY - top;

      const velocity =
        event.deltaY > 0 ? this.scaleVelocity : 1 / this.scaleVelocity;
      this.scaleViewport(velocity, centerX, centerY);
    });
  }

  private scaleViewport(s2: number, cx: number, cy: number): void {
    const [dx1, dy1] = this.canvas.transformation.getAbsCoords(0, 0);
    const s1 = this.canvas.transformation.getAbsScale();

    const scale = s1 * s2;
    const x = s1 * (1 - s2) * cx + dx1;
    const y = s1 * (1 - s2) * cy + dy1;

    this.canvas.patchViewportState({ scale, x, y });
  }
}

new ViewportTransformer(canvasElement, canvas);
