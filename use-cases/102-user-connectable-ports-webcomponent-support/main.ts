import {
  AddNodeRequest,
  Canvas,
  CanvasBuilder,
  Identifier,
} from "@html-graph/html-graph";
import { MyNode } from "./my-node";

const canvasElement: HTMLElement = document.getElementById("canvas")!;

const canvas: Canvas = new CanvasBuilder(canvasElement)
  .setDefaults({
    edges: {
      shape: {
        hasTargetArrow: true,
      },
    },
  })
  .enableUserDraggableNodes()
  .enableUserConnectablePorts({
    connectionTypeResolver: (portId: Identifier) => {
      const idStr = portId as string;

      return idStr.endsWith("-out") ? "direct" : "reverse";
    },
    connectionPreprocessor: (request) => {
      const existingEdge = canvas.graph.getAllEdgeIds().find((edgeId) => {
        const edge = canvas.graph.getEdge(edgeId)!;

        return edge.from === request.from && edge.to === request.to;
      });

      if (existingEdge !== undefined) {
        return null;
      }

      const strFrom = request.from as string;
      const strTo = request.to as string;

      if (strFrom.endsWith("-out") && strTo.endsWith("-in")) {
        return request;
      }

      return null;
    },
  })
  .enableUserTransformableViewport()
  .enableBackground()
  .build();

customElements.define("my-node", MyNode);

function createInOutNode(params: {
  name: string;
  x: number;
  y: number;
  frontPortId: string;
  backPortId: string;
}): AddNodeRequest {
  const node = document.createElement("my-node") as MyNode;

  const frontPort = node.shadowRoot!.querySelector(
    "[data-front-port]",
  ) as HTMLElement;
  const backPort = node.shadowRoot!.querySelector(
    "[data-back-port]",
  ) as HTMLElement;

  return {
    element: node,
    x: params.x,
    y: params.y,
    ports: [
      { id: params.frontPortId, element: frontPort },
      { id: params.backPortId, element: backPort },
    ],
  };
}

const addNode1Request: AddNodeRequest = createInOutNode({
  name: "Node 1",
  x: 200,
  y: 400,
  frontPortId: "node-1-in",
  backPortId: "node-1-out",
});

const addNode2Request: AddNodeRequest = createInOutNode({
  name: "Node 2",
  x: 500,
  y: 500,
  frontPortId: "node-2-in",
  backPortId: "node-2-out",
});

canvas.addNode(addNode2Request).addNode(addNode1Request);
