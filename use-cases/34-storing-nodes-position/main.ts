import { HtmlGraphBuilder, AddNodePorts } from "@html-graph/html-graph";

const nodes = new Map<
  unknown,
  { name: string; x: number; y: number; input: string; output: string }
>([
  [
    "node-1",
    { name: "Node 1", x: 200, y: 400, input: "port-1-1", output: "port-1-2" },
  ],
  [
    "node-2",
    { name: "Node 2", x: 600, y: 500, input: "port-2-1", output: "port-2-2" },
  ],
  [
    "node-3",
    { name: "Node 3", x: 200, y: 800, input: "port-3-1", output: "port-3-2" },
  ],
  [
    "node-4",
    { name: "Node 4", x: 1000, y: 600, input: "port-4-1", output: "port-4-2" },
  ],
]);

const canvas = new HtmlGraphBuilder()
  .setOptions({
    edges: {
      shape: {
        hasTargetArrow: true,
      },
    },
  })
  .setUserDraggableNodes({
    events: {
      onNodeDrag: (payload) => {
        const node = nodes.get(payload.nodeId)!;

        node.x = payload.x;
        node.y = payload.y;

        console.log(nodes);
      },
    },
  })
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

const canvasElement = document.getElementById("canvas")!;

canvas.attach(canvasElement);

nodes.forEach((value, key) => {
  const [node, ports] = createNode(value.name, value.input, value.output);

  canvas.addNode({ id: key, element: node, x: value.x, y: value.y, ports });
});

canvas
  .addEdge({ from: "port-1-2", to: "port-2-1" })
  .addEdge({ from: "port-3-2", to: "port-2-1" })
  .addEdge({ from: "port-2-2", to: "port-4-1" });
