import { Identifier } from "@/identifier";

export interface FocusConfig {
  readonly contentOffset?: number | undefined;
  readonly nodes?: Iterable<Identifier> | undefined;
  readonly minContentScale?: number | undefined;
}
