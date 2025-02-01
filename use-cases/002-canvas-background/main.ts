import { HtmlGraphBuilder, AddNodePorts } from "@html-graph/html-graph";
import { backgroundDrawingFn } from "../shared/background-drawing-fn";

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

const canvas = new HtmlGraphBuilder()
  .setOptions({
    edges: {
      shape: {
        hasTargetArrow: true,
      },
    },
  })
  .setUserDraggableNodes()
  .setUserTransformableCanvas({
    events: {
      onTransformFinished: () => {
        backgroundDrawingFn(ctx, canvas.transformation);
      },
    },
  })
  .build();

function createNode(
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

const [node1, ports1] = createNode("Node 1", "node-1-in", "node-1-out");
const [node2, ports2] = createNode("Node 2", "node-2-in", "node-2-out");
const [node3, ports3] = createNode("Node 3", "node-3-in", "node-3-out");
const [node4, ports4] = createNode("Node 4", "node-4-in", "node-4-out");

canvas
  .attach(canvasElement)
  .addNode({ element: node1, x: 200, y: 400, ports: ports1 })
  .addNode({ element: node2, x: 600, y: 500, ports: ports2 })
  .addNode({ element: node3, x: 200, y: 800, ports: ports3 })
  .addNode({ element: node4, x: 1000, y: 600, ports: ports4 })
  .addEdge({ from: "node-1-out", to: "node-2-in" })
  .addEdge({ from: "node-3-out", to: "node-2-in" })
  .addEdge({ from: "node-2-out", to: "node-4-in" });
