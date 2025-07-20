import {
  ConnectionPreprocessor,
  DraggingEdgeReattachInterruptedPayload,
  DraggingEdgeResolver,
  MouseEventVerifier,
} from "@/configurators";
import { EdgeShapeConfig } from "../resolve-edge-shape-factory";
import { AddEdgeRequest } from "@/canvas";

export interface DraggableEdgesConfig {
  readonly connectionPreprocessor?: ConnectionPreprocessor;
  readonly mouseDownEventVerifier?: MouseEventVerifier;
  readonly mouseUpEventVerifier?: MouseEventVerifier;
  readonly draggingEdgeResolver?: DraggingEdgeResolver;
  readonly draggingEdgeShape?: EdgeShapeConfig;
  readonly events?: {
    readonly onAfterEdgeReattached?: (edgeId: unknown) => void;
    readonly onEdgeReattachInterrupted?: (
      payload: DraggingEdgeReattachInterruptedPayload,
    ) => void;
    readonly onEdgeReattachPrevented?: (request: AddEdgeRequest) => void;
  };
}
