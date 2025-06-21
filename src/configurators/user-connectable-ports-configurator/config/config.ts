import { ConnectionPreprocessor } from "./connection-preprocessor";
import { ConnectionTypeResolver } from "./connection-type-resolver";
import { MouseEventVerifier } from "../../shared";
import { AddEdgeRequest } from "@/canvas";

export interface Config {
  readonly connectionTypeResolver: ConnectionTypeResolver;
  readonly connectionPreprocessor: ConnectionPreprocessor;
  readonly mouseDownEventVerifier: MouseEventVerifier;
  readonly mouseUpEventVerifier: MouseEventVerifier;
  readonly onAfterEdgeCreated: (edgeId: unknown) => void;
  readonly onEdgeCreationInterrupted: (
    staticPortId: unknown,
    isDirect: boolean,
  ) => void;
  readonly onEdgeCreationPrevented: (request: AddEdgeRequest) => void;
  readonly dragPortDirection: number | undefined;
}
