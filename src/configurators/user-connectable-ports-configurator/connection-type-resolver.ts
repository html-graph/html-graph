import { Identifier } from "@/identifier";

export type ConnectionTypeResolver = (
  portId: Identifier,
) => "direct" | "reverse" | null;
