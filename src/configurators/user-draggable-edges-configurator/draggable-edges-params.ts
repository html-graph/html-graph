import {
  ConnectionAllowedVerifier,
  ConnectionPreprocessor,
  DraggingPortDirectionResolver,
  MouseEventVerifier,
  PortIdResolver,
} from "../shared";
import { DraggingEdgeResolver } from "./dragging-edge-resolver";
import { Identifier } from "@/identifier";
import { GraphEdge } from "@/graph";
import { EdgeShapeFactory } from "@/graph-controller";

export interface DraggableEdgesParams {
  readonly connectionPreprocessor: ConnectionPreprocessor;
  readonly connectionAllowedVerifier: ConnectionAllowedVerifier;
  readonly mouseDownEventVerifier: MouseEventVerifier;
  readonly mouseUpEventVerifier: MouseEventVerifier;
  readonly draggingEdgeResolver: DraggingEdgeResolver;
  readonly draggingEdgeShapeFactory: EdgeShapeFactory | null;
  readonly onAfterEdgeReattached: (edgeId: Identifier) => void;
  readonly draggingPortDirectionResolver: DraggingPortDirectionResolver;
  readonly grabbedPortIdResolver: PortIdResolver;
  readonly releasedPortIdResolver: PortIdResolver;
  readonly onEdgeReattachInterrupted: (
    payload: GraphEdge & { readonly id: Identifier },
  ) => void;
  readonly onEdgeReattachPrevented: (
    payload: GraphEdge & { readonly id: Identifier },
  ) => void;
}
