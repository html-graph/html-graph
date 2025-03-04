import {
  CanvasBuilder,
  HtmlGraphError,
  Canvas,
  AddNodeRequest,
  AddEdgeRequest,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

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
  ]);

  private grabbedNode: string | null = null;

  public constructor(private readonly element: HTMLElement) {
    const builder: CanvasBuilder = new CanvasBuilder();
    const canvas: Canvas = builder.build();
    const canvasElement: HTMLElement = document.getElementById("canvas")!;
    canvas.attach(canvasElement);

    this.nodes.forEach((value, key) => {
      const addNodeRequest: AddNodeRequest = createInOutNode({
        id: key,
        name: value.name,
        x: value.x,
        y: value.y,
        frontPortId: value.input,
        backPortId: value.output,
      });

      addNodeRequest.element.addEventListener("mousedown", () => {
        this.element.style.cursor = "grab";
        this.grabbedNode = key;
      });

      canvas.addNode(addNodeRequest);
    });

    const addEdgeRequest: AddEdgeRequest = {
      from: "port-1-2",
      to: "port-2-1",
    };

    canvas.addEdge(addEdgeRequest);

    element.addEventListener("mousemove", (event: MouseEvent) => {
      if (this.grabbedNode !== null) {
        const node = this.nodes.get(this.grabbedNode);

        if (node === undefined) {
          throw new HtmlGraphError("failed to drag nonexisting node");
        }

        const matrixContent = canvas.transformation.getContentMatrix();

        const xViewport = matrixContent.scale * node.x + matrixContent.x;
        const yViewport = matrixContent.scale * node.y + matrixContent.y;

        const newNodeX = xViewport + event.movementX;
        const newNodeY = yViewport + event.movementY;

        const matrixViewport = canvas.transformation.getViewportMatrix();
        node.x = matrixViewport.scale * newNodeX + matrixViewport.x;
        node.y = matrixViewport.scale * newNodeY + matrixViewport.y;

        canvas.updateNode(this.grabbedNode, { x: node.x, y: node.y });
      }
    });

    element.addEventListener("mouseup", () => {
      this.element.style.removeProperty("cursor");
      this.grabbedNode = null;
    });
  }
}

const canvasElement = document.getElementById("canvas")!;

new NodesDragHandler(canvasElement);
