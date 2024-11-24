import { ApiPortsPayload, CanvasBuilder } from "../../lib/main";

const canvasElement = document.getElementById("canvas")!;

const canvas = new CanvasBuilder()
  .options({
    background: { type: "dots" },
    layers: { mode: "nodes-on-top" },
  })
  .draggable()
  .transformable()
  .build();

function createNode(
  name: string,
  frontPortId: string,
  backPortId: string,
): [HTMLElement, Record<string, ApiPortsPayload>] {
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

canvas
  .attach(canvasElement)
  .addNode({ element: node1, x: 600, y: 400, ports: ports1 })
  .addNode({ element: node2, x: 200, y: 500, ports: ports2 })
  .addConnection({ from: "port-1-2", to: "port-2-1" })
  .addNode({ element: node3, x: 400, y: 450, ports: ports3 });
