import {
  AddNodeRequest,
  Canvas,
  CanvasBuilder,
  Identifier,
  NodeElement,
} from "@html-graph/html-graph";

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);
const canvas: Canvas = builder
  .enableUserTransformableViewport()
  .enableUserDraggableNodes()
  .enableBackground()
  .build();

const createNode = (params: {
  x: number;
  y: number;
  inPortId: Identifier;
  outPortId: Identifier;
}): AddNodeRequest => {
  const svg: NodeElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg",
  );

  svg.classList.add("node");

  const polygon: SVGPathElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path",
  );

  polygon.setAttribute(
    "d",
    "M200,100 L150,186.6 L50,186.6 L0,100 L50,13.4 L150,13.4 Z",
  );
  polygon.setAttribute("fill", "var(--color-node-background)");
  polygon.setAttribute("stroke", "var(--color-node-border)");
  polygon.classList.add("shape");

  svg.appendChild(polygon);

  const circleOut: SVGCircleElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle",
  );

  circleOut.setAttribute("r", "5");
  circleOut.setAttribute("cx", "200");
  circleOut.setAttribute("cy", "100");
  circleOut.setAttribute("fill", "var(--color-edge)");

  svg.appendChild(circleOut);

  const circleIn: SVGCircleElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle",
  );

  circleIn.setAttribute("r", "5");
  circleIn.setAttribute("cx", "0");
  circleIn.setAttribute("cy", "100");
  circleIn.setAttribute("fill", "var(--color-edge)");

  svg.appendChild(circleIn);

  return {
    element: svg,
    x: params.x,
    y: params.y,
    ports: [
      { id: params.outPortId, element: circleOut },
      { id: params.inPortId, element: circleIn },
    ],
  };
};

canvas
  .addNode(createNode({ x: 200, y: 200, inPortId: "1-in", outPortId: "1-out" }))
  .addNode(createNode({ x: 500, y: 300, inPortId: "2-in", outPortId: "2-out" }))
  .addEdge({ from: "1-out", to: "2-in" });
