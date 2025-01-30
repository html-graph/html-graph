import { HtmlGraphBuilder } from "@html-graph/html-graph";
import { GraphHtmlHelper } from "./graph-html-helper";
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
    nodes: {
      centerFn: () => ({ x: 0, y: 0 }),
    },
    edges: {
      shape: {
        color: "var(--color-1)",
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

const helper = new GraphHtmlHelper();

const [node1, ports1] = helper.createNodeElement("Node 1", null, {
  "output-1-1": "Port 1",
  "output-1-2": "Port 2",
});

const [node2, ports2] = helper.createNodeElement(
  "Node 2",
  "input-2",
  {
    "output-2-1": "Port 1",
    "output-2-2": "Port 2",
    "output-2-3": "Port 3",
  },
  helper.createTextArea(),
);

const [node3, ports3] = helper.createNodeElement("Node 3", "input-3", {
  "output-3-1": "Port 1",
  "output-3-2": "Port 2",
  "output-3-3": "Port 3",
});

const [node4, ports4] = helper.createNodeElement("Node 4", "input-4", {
  "output-4-1": "Port 1",
});

const [node5, ports5] = helper.createNodeElement("Node 5", "input-5", {
  "output-5-1": "Port 1",
  "output-5-2": "Port 2",
});

canvas
  .attach(canvasElement)
  .addNode({ element: node1, x: 200, y: 400, ports: ports1 })
  .addNode({ element: node2, x: 600, y: 500, ports: ports2 })
  .addNode({ element: node3, x: 600, y: 200, ports: ports3 })
  .addNode({ element: node4, x: 1100, y: 400, ports: ports4 })
  .addNode({ element: node5, x: 1100, y: 550, ports: ports5 })
  .addEdge({ from: "output-1-1", to: "input-3" })
  .addEdge({ from: "output-1-2", to: "input-2" })
  .addEdge({ from: "output-2-1", to: "input-4" })
  .addEdge({ from: "output-3-1", to: "input-4" })
  .addEdge({ from: "output-2-2", to: "input-5" });
