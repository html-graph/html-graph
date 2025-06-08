export type ConnectionTypeResolver = (
  portId: unknown,
) => "begin" | "end" | null;
