import { Identifier } from "@/identifier";
import { ConnectionAllowedVerifierRequest } from "../connection-allowed-verifier";
import { EdgeCreationInProgressParams } from "../edge-creation-in-progress";

export const resolveCreateEdgeRequest = (
  params: EdgeCreationInProgressParams,
  targetPortId: Identifier,
): ConnectionAllowedVerifierRequest => {
  return {
    from: params.isDirect ? params.staticPortId : targetPortId,
    to: params.isDirect ? targetPortId : params.staticPortId,
  };
};
