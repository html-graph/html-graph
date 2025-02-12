import {
  BezierEdgeParams,
  BezierEdgeShape,
  HtmlGraphBuilder,
} from "@html-graph/html-graph";

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

const node1 = document.createElement("div");
node1.classList.add("node");
node1.innerText = "1";

const node2 = document.createElement("div");
node2.classList.add("node");
node2.innerText = "2";

const port1 = document.createElement("div");
port1.classList.add("port");
port1.style.right = "0";

const port2 = document.createElement("div");
port2.classList.add("port");
port2.style.left = "0";

node1.appendChild(port1);
node2.appendChild(port2);

const canvasElement = document.getElementById("canvas")!;

canvas
  .attach(canvasElement)
  .addNode({
    element: node1,
    x: 200,
    y: 300,
    ports: [{ id: "port-1", element: port1 }],
  })
  .addNode({
    element: node2,
    x: 600,
    y: 500,
    ports: [{ id: "port-2", element: port2 }],
  })
  .addEdge({ id: "con-1", from: "port-1", to: "port-2" });

let i = 0;

const redParams: BezierEdgeParams = {
  color: "red",
  width: 2,
  arrowLength: 15,
  arrowWidth: 4,
  curvature: 90,
  hasSourceArrow: true,
  hasTargetArrow: false,
  cycleRadius: 40,
  smallCycleRadius: 20,
  detourDistance: 100,
  detourDirection: -Math.PI / 2,
};

const greenParams: BezierEdgeParams = {
  color: "green",
  width: 2,
  arrowLength: 15,
  arrowWidth: 4,
  curvature: 90,
  hasSourceArrow: false,
  hasTargetArrow: true,
  cycleRadius: 40,
  smallCycleRadius: 20,
  detourDistance: 100,
  detourDirection: -Math.PI / 2,
};

const redController = new BezierEdgeShape(redParams);

const greenController = new BezierEdgeShape(greenParams);

setInterval(() => {
  if (i % 2) {
    canvas.updateEdge("con-1", {
      shape: { type: "custom", factory: () => redController },
    });
  } else {
    canvas.updateEdge("con-1", {
      shape: { type: "custom", factory: () => greenController },
    });
  }

  i++;
}, 1000);
