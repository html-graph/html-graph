import { Point } from "@/point";

export interface DraggingPortDirectionResolver {
  resolve(cursor: Point): number | undefined;
}
