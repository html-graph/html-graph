import { Identifier } from "@/identifier";

export type PortSearchResult =
  | {
      readonly status: "portFound";
      readonly portId: Identifier;
    }
  | {
      readonly status: "nodeEncountered";
    }
  | {
      readonly status: "notFound";
    };
