import { Point } from "@/point";

export interface PathPort {
  readonly coords: Point;
  readonly dir: Point;
  readonly hasArrow: boolean;
}
