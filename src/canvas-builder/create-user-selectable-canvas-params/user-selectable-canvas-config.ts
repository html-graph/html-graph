import { MouseEventVerifier } from "@/configurators";

export interface UserSelectableCanvasConfig {
  readonly onCanvasSelected: () => void;
  readonly mouseDownEventVerifier?: MouseEventVerifier | undefined;
  readonly mouseUpEventVerifier?: MouseEventVerifier | undefined;
  readonly movementThreshold?: number | undefined;
}
