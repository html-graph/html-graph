import { AddEdgeRequest } from "@/graph-controller";

export const defaults = Object.freeze({
  connectionTypeResolver: () => "direct",
  connectionPreprocessor: (request: AddEdgeRequest) => request,
  mouseEventVerifier: (event: MouseEvent): boolean => event.button === 0,
  onAfterEdgeCreated: () => {},
  onEdgeCreationPrevented: () => {},
  onEdgeCreationInterrupted: () => {},
});
