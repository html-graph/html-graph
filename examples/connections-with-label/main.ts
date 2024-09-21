import {
  ApiPortsPayload,
  BezierConnectionController,
  Canvas,
  PortPayload,
} from "../../lib/main";
import { ConnectionController } from "../../lib/models/connection/connection-controller";

const canvasElement = document.getElementById("canvas")!;

const canvas = new Canvas(canvasElement, {
  scale: { enabled: true },
  shift: { enabled: true },
  nodes: { draggable: true },
  background: { type: "dots" },
});

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

class CustomConnectionController implements ConnectionController {
  private controller = new BezierConnectionController(
    "#5c5c5c",
    1,
    90,
    15,
    4,
    false,
    true,
  );

  readonly svg = this.controller.svg;

  constructor(readonly name: string) {}

  update(
    width: number,
    height: number,
    x: number,
    y: number,
    from: PortPayload,
    to: PortPayload,
  ): void {
    this.controller.update(width, height, x, y, from, to);
  }
}

canvas
  .addNode({ element: node1, x: 200, y: 400, ports: ports1 })
  .addNode({ element: node2, x: 600, y: 500, ports: ports2 })
  .addConnection({
    from: "port-1-2",
    to: "port-2-1",
    options: {
      type: "custom",
      controllerFactory: () => new CustomConnectionController("Connection 1"),
    },
  });
