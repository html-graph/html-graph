import {
  ConnectionPreprocessor,
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
  readonly edgeShape?: EdgeShapeConfig;
  readonly events?: {
    readonly onAfterEdgeReattached?: (edgeId: unknown) => void;
    readonly onEdgeReattachInterrupted?: (
      staticPortId: unknown,
      isDirect: boolean,
    ) => void;
    readonly onEdgeReattachPrevented?: (request: AddEdgeRequest) => void;
  };
}
