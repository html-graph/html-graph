import {
  AddNodeRequest,
  Canvas,
  CanvasBuilder,
  CanvasDefaults,
  Identifier,
  ViewportTransformConfig,
  VirtualScrollConfig,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";
import { executeMacrotask } from "../shared/execute-macrotask";

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
};

const canvas: Canvas = new CanvasBuilder(canvasElement)
  .setDefaults(defaults)
  .enableUserTransformableViewport(transformConfig)
  .enableVirtualScroll(virtualScrollConfig)
  .enableBackground()
  .build();

document.getElementById("start")!.addEventListener("click", async () => {
  document.getElementById("start")!.style.display = "none";
  document.getElementById("spinner")!.style.display = "block";

  await initiateGraph();

  document.getElementById("loader")!.style.display = "none";
});

const initiateGraph = async (): Promise<void> => {
  let prevPortId: Identifier | null = null;

  const total = 100_000;
  const layer = total / 10;
  const collection = Array.from({ length: total }).map((_, i) => i);

  const iterator = collection.values();
  let current = iterator.next();
  let processedTotal = 0;

  while (!current.done) {
    await executeMacrotask(() => {
      let processed = 0;

      while (!current.done && processed < 1000) {
        const iter = current.value;
        const frontPortId = `node-${iter}-in`;
        const backPortId = `node-${iter}-out`;

        const i = iter % layer;
        const j = Math.floor(iter / layer);

        const request: AddNodeRequest = createInOutNode({
          name: `Node ${iter}`,
          x: i * 300,
          y: j * 300,
          frontPortId,
          backPortId,
        });

        canvas.addNode(request);

        if (prevPortId !== null) {
          const nodeFromId = canvas.graph.getPort(prevPortId).nodeId;
          const nodeFrom = canvas.graph.getNode(nodeFromId);
          const nodeToId = canvas.graph.getPort(frontPortId).nodeId;
          const nodeTo = canvas.graph.getNode(nodeToId);

          if (nodeFrom.y === nodeTo.y) {
            canvas.addEdge({ from: prevPortId, to: frontPortId });
          }
        }

        prevPortId = backPortId;
        current = iterator.next();
        processed++;
      }

      processedTotal += processed;

      const percent = (processedTotal / total) * 100;

      document.getElementById("status")!.innerText = `${Math.floor(percent)}%`;
    });
  }
};
