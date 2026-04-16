import { Identifier } from "@/identifier";

export interface EdgeCreationInProgressParams {
  readonly staticPortId: Identifier;
  readonly isDirect: boolean;
}
