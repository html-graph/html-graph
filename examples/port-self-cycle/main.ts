import { ApiPortsPayload, CanvasBuilder } from "../../lib/main";

const canvas = new CanvasBuilder()
  .options({
    background: { type: "dots" },
    connections: {
      type: "bezier",
      hasTargetArrow: true,
    },
  })
  .draggableNodes()
  .transformableCanvas()
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
const canvasElement = document.getElementById("canvas")!;

canvas
  .attach(canvasElement)
  .addNode({ element: node1, x: 200, y: 400, ports: ports1 })
  .addConnection({ from: "port-1-2", to: "port-1-2" });
