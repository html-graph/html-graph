export interface LayersController {
  readonly create: () => void;
  readonly update: (sv: number, xv: number, yv: number) => void;
  readonly moveOnTop: (nodeId: string) => void;
}
