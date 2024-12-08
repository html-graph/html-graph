import { MarkNodePortRequest, HtmlGraphBuilder } from "@html-graph/html-graph";

class NodesDragHandler {
  private readonly nodes = new Map<string, HTMLElement>();

  private grabbedNode: string | null = null;

  public constructor(private readonly element: HTMLElement) {
    const canvas = new HtmlGraphBuilder()
      .setOptions({
        background: { type: "dots" },
        connections: { hasTargetArrow: true },
      })
      .build();

    const [node1, ports1] = this.createNode("Node 1", "port-1-1", "port-1-2");
    const [node2, ports2] = this.createNode("Node 2", "port-2-1", "port-2-2");
    const [node3, ports3] = this.createNode("Node 3", "port-3-1", "port-3-2");
    const [node4, ports4] = this.createNode("Node 4", "port-4-1", "port-4-2");

    this.nodes.set("node-1", node1);
    this.nodes.set("node-2", node2);
    this.nodes.set("node-3", node3);
    this.nodes.set("node-4", node4);

    canvas
      .attach(canvasElement)
      .addNode({ id: "node-1", element: node1, x: 200, y: 400, ports: ports1 })
      .addNode({ id: "node-2", element: node2, x: 600, y: 500, ports: ports2 })
      .addNode({ id: "node-3", element: node3, x: 200, y: 800, ports: ports3 })
      .addNode({ id: "node-4", element: node4, x: 1000, y: 600, ports: ports4 })
      .addConnection({ from: "port-1-2", to: "port-2-1" })
      .addConnection({ from: "port-3-2", to: "port-2-1" })
      .addConnection({ from: "port-2-2", to: "port-4-1" });

    this.nodes.forEach((value, key) => {
      value.addEventListener("mousedown", () => {
        this.element.style.cursor = "grab";
        this.grabbedNode = key;
      });

      value.addEventListener("mouseup", () => {
        this.element.style.removeProperty("cursor");
        this.grabbedNode = null;
      });
    });

    element.addEventListener("mousemove", (event: MouseEvent) => {
      if (this.grabbedNode !== null) {
        canvas.dragNode(this.grabbedNode, event.movementX, event.movementY);
      }
    });
  }

  public createNode(
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
}

const canvasElement = document.getElementById("canvas")!;

new NodesDragHandler(canvasElement);
