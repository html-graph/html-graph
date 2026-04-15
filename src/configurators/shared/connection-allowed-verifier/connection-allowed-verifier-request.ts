import { Identifier } from "@/identifier";

export interface ConnectionAllowedVerifierRequest {
  readonly from: Identifier;
  readonly to: Identifier;
}
