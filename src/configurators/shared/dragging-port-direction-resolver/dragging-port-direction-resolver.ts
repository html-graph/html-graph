import { DraggingPortDirectionResolverParams } from "./dragging-port-direction-resolver-params";

export interface DraggingPortDirectionResolver {
  resolve(params: DraggingPortDirectionResolverParams): number | undefined;
}
