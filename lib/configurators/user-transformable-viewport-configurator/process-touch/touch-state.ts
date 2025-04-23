export interface TouchState {
  readonly x: number;
  readonly y: number;
  readonly scale: number;
  readonly touchesCnt: number;
  readonly touches: ReadonlyArray<readonly [number, number]>;
}
