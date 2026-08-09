import { Identifier } from "@/identifier";

export type PortIdResolver = (
  portIds: readonly Identifier[],
) => Identifier | null;
