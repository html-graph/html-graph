import {
  AddNodeRequest,
  Canvas,
  CanvasBuilder,
  CanvasDefaults,
  Identifier,
  ViewportTransformConfig,
  VirtualScrollConfig,
} from "@html-graph/html-graph";

const canvasElement: HTMLElement = document.getElementById("canvas")!;

const defaults: CanvasDefaults = {
  edges: {
    shape: {
      type: "horizontal",
      hasTargetArrow: true,
    },
  },
};

const transformConfig: ViewportTransformConfig = {
  transformPreprocessor: {
    type: "scale-limit",
    minContentScale: 0.3,
  },
};

const virtualScrollConfig: VirtualScrollConfig = {
  nodeContainingRadius: {
    horizontal: 25,
    vertical: 25,
  },
  events: {
    onBeforeNodeAttached: (nodeId) => {
      const element = canvas.graph.getNode(nodeId).element
        .children[1] as HTMLElement;

      element.innerText = `Node ${nodeId}`;
    },
    onAfterNodeDetached: (nodeId) => {
      const element = canvas.graph.getNode(nodeId).element
        .children[1] as HTMLElement;

      element.innerText = "";
    },
  },
};

function createInOutNode(params: {
  id?: Identifier;
  x: number;
  y: number;
  frontPortId: string;
  backPortId: string;
  priority?: number;
}): AddNodeRequest {
  const node = document.createElement("div");
  node.classList.add("node");

  const frontPort = document.createElement("div");
  frontPort.classList.add("node-port");
  node.appendChild(frontPort);

  const text = document.createElement("div");
  node.appendChild(text);

  const backPort = document.createElement("div");
  backPort.classList.add("node-port");
  node.appendChild(backPort);

  return {
    id: params.id,
    element: node,
    x: params.x,
    y: params.y,
    ports: [
      { id: params.frontPortId, element: frontPort },
      { id: params.backPortId, element: backPort },
    ],
    priority: params.priority,
  };
}

const canvas: Canvas = new CanvasBuilder(canvasElement)
  .setDefaults(defaults)
  .enableUserTransformableViewport(transformConfig)
  .enableVirtualScroll(virtualScrollConfig)
  .build();

let cnt = 0;

let prevPortId: Identifier | null = null;

for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10000; j++) {
    const frontPortId = `node-${cnt}-in`;
    const backPortId = `node-${cnt}-out`;

    canvas.addNode(
      createInOutNode({
        x: j * 300,
        y: i * 300,
        frontPortId,
        backPortId,
      }),
    );

    if (prevPortId !== null) {
      canvas.addEdge({ from: prevPortId, to: frontPortId });
    }

    prevPortId = backPortId;
    cnt++;
  }
}
