import { MouseEventVerifier } from "../mouse-event-verifier";

export interface UserSelectableElementsParams {
  readonly onSelected: (element: Element, event: Event) => void;
  readonly mouseDownEventVerifier: MouseEventVerifier;
  readonly mouseUpEventVerifier: MouseEventVerifier;
  readonly movementThreshold: number;
}
