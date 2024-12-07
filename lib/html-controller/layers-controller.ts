export interface LayersController {
  create: () => void;
  update: (sv: number, xv: number, yv: number) => void;
  moveOnTop: (nodeId: string) => void;
}
