import { Graph, Identifier, Point } from "@html-graph/html-graph";

interface HeirarchicalLayoutAlgorithmParams {
  readonly startNodeId: Identifier;
  readonly layerSize: number;
  readonly layerSpace: number;
}

interface AvgEntry {
  readonly id: Identifier;
  readonly avg: number;
}

export interface LayoutAlgorithm {
  calculateCoordinates(): ReadonlyMap<Identifier, Point>;
}

export class HeirarchicalLayoutAlgorithm implements LayoutAlgorithm {
  public constructor(
    private readonly graph: Graph,
    private readonly params: HeirarchicalLayoutAlgorithmParams,
  ) {}

  public calculateCoordinates(): ReadonlyMap<Identifier, Point> {
    const layers = this.calculateLayers();
    const nodeY = this.calculateY(layers);
    const coords = new Map<Identifier, Point>();

    layers.forEach((layer, depth) => {
      layer.forEach((nodeId) => {
        const x = this.params.layerSize * depth;
        const y = nodeY.get(nodeId)!;

        coords.set(nodeId, { x, y });
      });
    });

    return coords;
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
        const incomingEdges = this.graph.getNodeIncomingEdgeIds(nodeId)!;

        const incomingNodeIds = new Set<Identifier>();

        incomingEdges.forEach((edgeId) => {
          const edge = this.graph.getEdge(edgeId)!;
          const sourcePort = this.graph.getPort(edge.from)!;

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
        const outgoingEdges = this.graph.getNodeOutgoingEdgeIds(nodeId);

        if (outgoingEdges !== null) {
          outgoingEdges.forEach((edgeId) => {
            const edge = this.graph.getEdge(edgeId)!;
            const port = this.graph.getPort(edge.to)!;

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
