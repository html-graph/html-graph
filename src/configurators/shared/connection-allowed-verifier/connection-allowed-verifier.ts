import { ConnectionAllowedVerifierRequest } from "./connection-allowed-verifier-request";

export type ConnectionAllowedVerifier = (
  request: ConnectionAllowedVerifierRequest,
) => boolean;
