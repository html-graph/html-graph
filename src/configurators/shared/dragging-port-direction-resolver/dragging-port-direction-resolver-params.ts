import { Point } from "@/point";
import { EdgeCreationInProgressParams } from "../edge-creation-in-progress";

export type DraggingPortDirectionResolverParams = {
  readonly cursor: Point;
} & EdgeCreationInProgressParams;
