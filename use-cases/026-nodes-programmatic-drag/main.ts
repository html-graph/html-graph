import {
  HtmlGraphBuilder,
  AddNodePorts,
  HtmlGraphError,
} from "@html-graph/html-graph";

class NodesDragHandler {
  private readonly nodes = new Map<
    string,
    {
      name: string;
      x: number;
      y: number;
      input: string;
      output: string;
    }
  >([
    [
      "node-1",
      {
        name: "Node 1",
        x: 200,
        y: 400,
        input: "port-1-1",
        output: "port-1-2",
      },
    ],
    [
      "node-2",
      {
        name: "Node 2",
        x: 600,
        y: 500,
        input: "port-2-1",
        output: "port-2-2",
      },
    ],
    [
      "node-3",
      {
        name: "Node 3",
        x: 200,
        y: 800,
        input: "port-3-1",
        output: "port-3-2",
      },
    ],
    [
      "node-4",
      {
        name: "Node 4",
        x: 1000,
        y: 600,
        input: "port-4-1",
        output: "port-4-2",
      },
    ],
  ]);

  private grabbedNode: string | null = null;

  public constructor(private readonly element: HTMLElement) {
    const canvas = new HtmlGraphBuilder()
      .setOptions({
        edges: {
          shape: {
            hasTargetArrow: true,
          },
        },
      })
      .build();

    canvas.attach(canvasElement);

    this.nodes.forEach((value, key) => {
      const [element, ports] = this.createNode(
        value.name,
        value.input,
        value.output,
      );

      element.addEventListener("mousedown", () => {
        this.element.style.cursor = "grab";
        this.grabbedNode = key;
      });

      canvas.addNode({
        id: key,
        element,
        x: value.x,
        y: value.y,
        ports,
      });
    });

    canvas
      .addEdge({ from: "port-1-2", to: "port-2-1" })
      .addEdge({ from: "port-3-2", to: "port-2-1" })
      .addEdge({ from: "port-2-2", to: "port-4-1" });

    element.addEventListener("mousemove", (event: MouseEvent) => {
      if (this.grabbedNode !== null) {
        const node = this.nodes.get(this.grabbedNode);

        if (node === undefined) {
          throw new HtmlGraphError("failed to drag nonexisting node");
        }

        const matrixContent = canvas.transformation.getContentMatrix();

        const xViewport = matrixContent.scale * node.x + matrixContent.dx;
        const yViewport = matrixContent.scale * node.y + matrixContent.dy;

        const newNodeX = xViewport + event.movementX;
        const newNodeY = yViewport + event.movementY;

        const matrixViewport = canvas.transformation.getViewportMatrix();
        node.x = matrixViewport.scale * newNodeX + matrixViewport.dx;
        node.y = matrixViewport.scale * newNodeY + matrixViewport.dy;

        canvas.updateNode(this.grabbedNode, { x: node.x, y: node.y });
      }
    });

    element.addEventListener("mouseup", () => {
      this.element.style.removeProperty("cursor");
      this.grabbedNode = null;
    });
  }

  public createNode(
    name: string,
    frontPortId: string,
    backPortId: string,
  ): [HTMLElement, AddNodePorts] {
    const node = document.createElement("div");
    node.classList.add("node");

    const frontPort = document.createElement("div");
    node.appendChild(frontPort);

    const text = document.createElement("div");
    text.innerText = name;
    node.appendChild(text);

    const backPort = document.createElement("div");
    node.appendChild(backPort);

    return [
      node,
      [
        { id: frontPortId, element: frontPort },
        { id: backPortId, element: backPort },
      ],
    ];
  }
}

const canvasElement = document.getElementById("canvas")!;

new NodesDragHandler(canvasElement);
