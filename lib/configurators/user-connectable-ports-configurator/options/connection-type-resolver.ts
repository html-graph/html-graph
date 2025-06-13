export type ConnectionTypeResolver = (
  portId: unknown,
) => "direct" | "reverse" | null;
