import { MarkNodePortRequest, HtmlGraphBuilder } from "@html-graph/html-graph";

const canvas = new HtmlGraphBuilder()
  .setOptions({
    background: { type: "dots" },
    edges: { hasTargetArrow: true },
  })
  .setUserDraggableNodes()
  .setUserTransformableCanvas()
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
  .addNode({
    id: "node-1",
    element: node1,
    x: 400,
    y: 450,
    ports: ports1,
    priority: 3,
  })
  .addNode({
    id: "node-2",
    element: node2,
    x: 450,
    y: 500,
    ports: ports2,
    priority: 2,
  })
  .addNode({
    id: "node-3",
    element: node3,
    x: 500,
    y: 550,
    ports: ports3,
    priority: 1,
  })
  .addNode({
    id: "node-4",
    element: node4,
    x: 550,
    y: 600,
    ports: ports4,
    priority: 0,
  })
  .addEdge({ from: "port-1-2", to: "port-2-1", priority: 4 })
  .addEdge({ from: "port-3-2", to: "port-4-1", priority: 4 })
  .addEdge({ from: "port-2-2", to: "port-3-1", priority: 4 });

let i = 0;

setInterval(() => {
  if (i % 2) {
    canvas
      .updateNode("node-1", { priority: 3 })
      .updateNode("node-2", { priority: 2 })
      .updateNode("node-3", { priority: 1 })
      .updateNode("node-4", { priority: 0 });
  } else {
    canvas
      .updateNode("node-1", { priority: 0 })
      .updateNode("node-2", { priority: 1 })
      .updateNode("node-3", { priority: 2 })
      .updateNode("node-4", { priority: 3 });
  }

  i++;
}, 1000);
