import { HtmlGraphBuilder, AddNodePorts } from "@html-graph/html-graph";

const canvas = new HtmlGraphBuilder()
  .setOptions({
    edges: {
      shape: {
        hasTargetArrow: true,
      },
    },
  })
  .setUserDraggableNodes()
  .setUserTransformableCanvas()
  .build();

function createNode(
  name: string,
  frontPortId: string,
  backPortId: string,
): [HTMLElement, AddNodePorts] {
  const node = document.createElement("div");
  node.classList.add("node");

  const frontPort = document.createElement("div");
  frontPort.classList.add("front-port");
  node.appendChild(frontPort);

  const text = document.createElement("div");
  text.innerText = name;
  node.appendChild(text);

  const backPort = document.createElement("div");
  backPort.classList.add("back-port");
  node.appendChild(backPort);

  return [
    node,
    [
      { id: frontPortId, element: frontPort },
      { id: backPortId, element: backPort },
    ],
  ];
}

const [node1, ports1] = createNode("Node 1", "port-1-1", "port-1-2");
const canvasElement = document.getElementById("canvas")!;

canvas
  .attach(canvasElement)
  .addNode({ element: node1, x: 200, y: 400, ports: ports1 })
  .addEdge({ from: "port-1-2", to: "port-1-1" });
