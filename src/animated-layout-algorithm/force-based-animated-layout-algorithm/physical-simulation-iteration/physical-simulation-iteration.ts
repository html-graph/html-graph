import { Graph } from "@/graph";
import { Identifier } from "@/identifier";
import { Point } from "@/point";
import { PhysicalSimulationParams } from "./physical-sumulation-params";

export class PhysicalSimulationIteration {
  private readonly dtSec: number;

  private readonly nodeCharge: number;

  private readonly xFallbackResolver: (nodeId: Identifier) => number;

  private readonly yFallbackResolver: (nodeId: Identifier) => number;

  public constructor(
    private readonly graph: Graph,
    private readonly params: PhysicalSimulationParams,
  ) {
    this.dtSec = this.params.dtSec;
    this.nodeCharge = this.params.nodeCharge;
    this.xFallbackResolver = this.params.xFallbackResolver;
    this.yFallbackResolver = this.params.yFallbackResolver;
  }

  public calculateNextCoordinates(): ReadonlyMap<Identifier, Point> {
    const currentCoords = new Map<Identifier, Point>();

    this.graph.getAllNodeIds().forEach((nodeId) => {
      const node = this.graph.getNode(nodeId)!;

      currentCoords.set(nodeId, {
        x: node.x ?? this.xFallbackResolver(nodeId),
        y: node.y ?? this.yFallbackResolver(nodeId),
      });
    });

    console.log(this.dtSec, this.nodeCharge);

    return currentCoords;
  }
}
