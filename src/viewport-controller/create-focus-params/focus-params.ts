import { Identifier } from "@/identifier";

export interface FocusParams {
  readonly contentPadding: number;
  readonly nodes: Iterable<Identifier>;
  readonly minContentScale: number;
  readonly animationDuration: number;
}
