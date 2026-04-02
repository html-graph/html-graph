import { MouseEventVerifier } from "../shared";

export interface UserSelectableCanvasParams {
  readonly onCanvasSelected: () => void;
  readonly mouseDownEventVerifier: MouseEventVerifier;
  readonly mouseUpEventVerifier: MouseEventVerifier;
  readonly movementThreshold: number;
}
