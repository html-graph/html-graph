import { AddNodeRequest, Canvas, CanvasBuilder } from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";
import {
  HeirarchicalLayoutAlgorithm,
  LayoutAlgorithm,
} from "./heirarchical-layout-algorithm";
import graphData from "./graph.json";

interface TransformationMatrix {
  readonly a: number;
  readonly b: number;
  readonly c: number;
  readonly d: number;
  readonly e: number;
  readonly f: number;
}

interface TopologyChangeLayoutApplicationStrategyParams {
  readonly layoutAlgorithm: LayoutAlgorithm;
  readonly transformationMatrix?: TransformationMatrix;
}

class TopologyChangeLayoutApplicationStrategy {
  private applyScheduled = false;

  private readonly defaultTransformationMatrix: TransformationMatrix = {
    a: 1,
    b: 0,
    c: 0,
    d: 0,
    e: 1,
    f: 0,
  };

  private constructor(
    private readonly canvas: Canvas,
    private readonly params: TopologyChangeLayoutApplicationStrategyParams,
  ) {
    this.canvas.graph.onAfterNodeAdded.subscribe(() => {
      this.scheduleApply();
    });

    this.canvas.graph.onBeforeNodeRemoved.subscribe(() => {
      this.scheduleApply();
    });

    this.canvas.graph.onAfterEdgeAdded.subscribe(() => {
      this.scheduleApply();
    });

    this.canvas.graph.onBeforeEdgeRemoved.subscribe(() => {
      this.scheduleApply();
    });
  }

  public static configure(
    canvas: Canvas,
    params: TopologyChangeLayoutApplicationStrategyParams,
  ): void {
    new TopologyChangeLayoutApplicationStrategy(canvas, params);
  }

  private scheduleApply(): void {
    if (this.applyScheduled) {
      return;
    }

    this.applyScheduled = true;

    setTimeout(() => {
      this.applyScheduled = false;
      this.applyLayout();
    });
  }

  private applyLayout(): void {
    const coords = this.params.layoutAlgorithm.calculateCoordinates();
    const m =
      this.params.transformationMatrix ?? this.defaultTransformationMatrix;

    coords.forEach(({ x, y }, nodeId) => {
      canvas.updateNode(nodeId, {
        x: m.a * x + m.b * y + m.c,
        y: m.d * x + m.e * y + m.f,
      });
    });
  }
}

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);
const canvas: Canvas = builder
  .enableUserTransformableViewport()
  .enableBackground()
  .build();

const layout = new HeirarchicalLayoutAlgorithm(canvas.graph, {
  startNodeId: 0,
  layerSize: 300,
  layerSpace: 200,
});

TopologyChangeLayoutApplicationStrategy.configure(canvas, {
  layoutAlgorithm: layout,
  transformationMatrix: {
    a: 1,
    b: 0,
    c: 200,
    d: 0,
    e: 1,
    f: 400,
  },
});

graphData.nodes.forEach((nodeId) => {
  const addNodeRequest: AddNodeRequest = createInOutNode({
    id: nodeId,
    name: `Node ${nodeId}`,
    frontPortId: `node-${nodeId}-in`,
    backPortId: `node-${nodeId}-out`,
  });

  canvas.addNode(addNodeRequest);
});

graphData.edges.forEach((edge) => {
  const from = `node-${edge.from}-out`;
  const to = `node-${edge.to}-in`;

  canvas.addEdge({ id: edge.id, from, to });
});
