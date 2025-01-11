import { HtmlGraphBuilder } from "@html-graph/html-graph";

const canvas = new HtmlGraphBuilder()
  .setOptions({
    background: { type: "dots" },
    edges: {
      shape: {
        hasTargetArrow: true,
      },
    },
  })
  .setUserDraggableNodes()
  .setUserTransformableCanvas()
  .build();

const node1 = document.createElement("div");
node1.classList.add("node");

const node2 = document.createElement("div");
node2.classList.add("node");

const port1 = document.createElement("div");
port1.classList.add("port");
port1.style.right = "0";

const port2 = document.createElement("div");
port2.classList.add("port");
port2.style.left = "0";

node1.appendChild(port1);
node2.appendChild(port2);

const canvasElement = document.getElementById("canvas")!;

/**
 * s2 - scale
 * cx - scale pivot x
 * cy - scale pivot y
 *
 *  s1  0   dx1     s2  0   (1 - s2) * cx
 *  0   s1  dy1     0   s2  (1 - s2) * cy
 *  0   0   1       0   0   1
 *
 * [s, dx, dy] = [s1 * s2, s1 * (1 - s2) * cx + dx1, s1 * (1 - s2) * cy + dy1]
 */
const s2 = 1 / 3;
const cx = -100;
const cy = -100;
const s1 = 1;
const dx1 = 200;
const dy1 = 300;
const s = s1 * s2;
const x = s1 * (1 - s2) * cx + dx1;
const y = s1 * (1 - s2) * cy + dy1;

canvas
  .attach(canvasElement)
  .addNode({ id: "node-1", element: node1, x: 200, y: 300 })
  .markPort({ nodeId: "node-1", element: port1, id: "port-1" })
  .addNode({ id: "node-2", element: node2, x: 600, y: 500 })
  .markPort({ nodeId: "node-2", element: port2, id: "port-2" })
  .addEdge({ id: "con-1", from: "port-1", to: "port-2" })
  .patchViewportState({ scale: s, x, y });
