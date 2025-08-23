import { Canvas, Identifier } from "@html-graph/html-graph";

interface HeirarchicalLayoutParams {
  readonly startNodeId: Identifier;
  readonly layerSize: number;
  readonly layerSpace: number;
  readonly transformMatrix: {
    readonly a: number;
    readonly b: number;
    readonly c: number;
    readonly d: number;
    readonly e: number;
    readonly f: number;
  };
}

interface AvgEntry {
  readonly id: Identifier;
  readonly avg: number;
}

export class HeirarchicalLayout {
  public constructor(
    private readonly canvas: Canvas,
    private readonly params: HeirarchicalLayoutParams,
  ) {}

  public organize(): void {
    const layers = this.calculateLayers();
    const nodeY = this.calculateY(layers);
    const m = this.params.transformMatrix;

    layers.forEach((layer, depth) => {
      layer.forEach((nodeId) => {
        const x = this.params.layerSize * depth;
        const y = nodeY.get(nodeId)!;

        this.canvas.updateNode(nodeId, {
          x: m.a * x + m.b * y + m.c,
          y: m.d * x + m.e * y + m.f,
        });
      });
    });
  }

  private calculateY(
    layers: ReadonlyMap<number, ReadonlySet<Identifier>>,
  ): ReadonlyMap<Identifier, number> {
    const nodeY = new Map<Identifier, number>();

    layers.forEach((layer, depth) => {
      if (depth === 0) {
        nodeY.set(this.params.startNodeId, 0);
        return;
      }

      const layerAvg: AvgEntry[] = [];

      const layerHalfHeight = (this.params.layerSpace * (layer.size - 1)) / 2;

      layer.forEach((nodeId) => {
        const incomingEdges = this.canvas.graph.getNodeIncomingEdgeIds(nodeId)!;

        const incomingNodeIds = new Set<Identifier>();

        incomingEdges.forEach((edgeId) => {
          const edge = this.canvas.graph.getEdge(edgeId)!;
          const sourcePort = this.canvas.graph.getPort(edge.from)!;

          if (sourcePort.nodeId !== nodeId) {
            incomingNodeIds.add(sourcePort.nodeId);
          }
        });

        const prevLayer = layers.get(depth - 1)!;

        const prevLayerIncomingNodeIds = Array.from(incomingNodeIds).filter(
          (incomingNodeId) => prevLayer.has(incomingNodeId),
        );

        const sum = prevLayerIncomingNodeIds.reduce<number>(
          (acc, cur) => acc + nodeY.get(cur)!,
          0,
        );

        const avg = sum / prevLayerIncomingNodeIds.length;

        layerAvg.push({ id: nodeId, avg });
      });

      layerAvg.sort((a, b) => a.avg - b.avg);

      layerAvg.forEach((entry, index) => {
        const y = -layerHalfHeight + this.params.layerSpace * index;
        nodeY.set(entry.id, y);
      });
    });

    return nodeY;
  }

  private calculateLayers(): ReadonlyMap<number, ReadonlySet<Identifier>> {
    const layers = new Map<number, Set<Identifier>>();

    const visited = new Set<Identifier>([this.params.startNodeId]);
    let currentLayerStack: Identifier[] = [this.params.startNodeId];
    let layer = 0;

    while (currentLayerStack.length !== 0) {
      layers.set(layer, new Set(currentLayerStack));
      const nextLayerStack: Identifier[] = [];

      currentLayerStack.forEach((nodeId) => {
        const outgoingEdges = this.canvas.graph.getNodeOutgoingEdgeIds(nodeId);

        if (outgoingEdges !== null) {
          outgoingEdges.forEach((edgeId) => {
            const edge = this.canvas.graph.getEdge(edgeId)!;
            const port = this.canvas.graph.getPort(edge.to)!;

            if (!visited.has(port.nodeId)) {
              visited.add(port.nodeId);
              nextLayerStack.push(port.nodeId);
            }
          });
        }
      });

      currentLayerStack = nextLayerStack;
      layer++;
    }

    return layers;
  }
}
