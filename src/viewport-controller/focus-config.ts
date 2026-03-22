import { Identifier } from "@/identifier";

export type FocusConfig =
  | {
      readonly contentOffset?: number | undefined;
      readonly nodes?: Iterable<Identifier> | undefined;
      readonly minContentScale?: number | undefined;
      readonly animationDuration?: number | undefined;
    }
  | Iterable<Identifier>;
