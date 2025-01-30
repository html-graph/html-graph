import { HtmlGraphBuilder, AddNodePorts } from "@html-graph/html-graph";

const canvas = new HtmlGraphBuilder()
  .setOptions({
    edges: {
      shape: {
        type: "straight",
        arrowOffset: 0,
        roundness: 0,
        arrowLength: 0,
      },
      priority: 1,
    },
    nodes: {
      priority: 0,
    },
  })
  .setUserDraggableNodes({
    grabPriorityStrategy: "freeze",
  })
  .setUserTransformableCanvas()
  .build();

function createNode(portId: string): [HTMLElement, AddNodePorts] {
  const node = document.createElement("div");

  node.classList.add("node");

  return [node, [{ id: portId, element: node }]];
}

const [node1, ports1] = createNode("port-1");
const [node2, ports2] = createNode("port-2");

const canvasElement = document.getElementById("canvas")!;

canvas
  .attach(canvasElement)
  .addNode({ element: node1, x: 200, y: 400, ports: ports1 })
  .addNode({ element: node2, x: 600, y: 500, ports: ports2 })
  .addEdge({ from: "port-1", to: "port-2" });
