import { CenterFn } from "../center-fn";

export const standardCenterFn: CenterFn = (w: number, h: number) => ({
  x: w / 2,
  y: h / 2,
});
