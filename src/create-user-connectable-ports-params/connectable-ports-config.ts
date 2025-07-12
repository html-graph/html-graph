import { AddEdgeRequest, EdgeShapeFactory } from "@/canvas";
import {
  ConnectionPreprocessor,
  ConnectionTypeResolver,
  MouseEventVerifier,
} from "@/configurators";

export interface ConnectablePortsConfig {
  readonly edgeShapeFactory?: EdgeShapeFactory;
  readonly connectionTypeResolver?: ConnectionTypeResolver;
  readonly connectionPreprocessor?: ConnectionPreprocessor;
  readonly mouseDownEventVerifier?: MouseEventVerifier;
  readonly mouseUpEventVerifier?: MouseEventVerifier;
  readonly dragPortDirection?: number | undefined;
  readonly events?: {
    readonly onAfterEdgeCreated?: (edgeId: unknown) => void;
    readonly onEdgeCreationInterrupted?: (
      staticPortId: unknown,
      isDirect: boolean,
    ) => void;
    readonly onEdgeCreationPrevented?: (request: AddEdgeRequest) => void;
  };
}
