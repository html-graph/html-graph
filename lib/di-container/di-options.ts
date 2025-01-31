import { CenterFn } from "@/center-fn";
import { PriorityFn } from "@/priority";

export interface DiOptions {
  readonly nodesCenterFn: CenterFn;
  readonly nodesPriorityFn: PriorityFn;
  readonly portsCenterFn: CenterFn;
  readonly portsDirection: number;
  readonly edgesPriorityFn: PriorityFn;
}
