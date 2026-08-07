import { Identifier } from "@/identifier";

export type FocusConfig =
  | {
      readonly contentPadding?: number | undefined;
      readonly nodes?: Iterable<Identifier> | undefined;
      readonly minContentScale?: number | undefined;
      readonly animationDuration?: number | undefined;
    }
  | Iterable<Identifier>;
