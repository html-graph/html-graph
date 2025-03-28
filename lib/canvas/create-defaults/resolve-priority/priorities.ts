import { PriorityFn } from "@/priority";

export interface Priorities {
  readonly nodesPriorityFn: PriorityFn;
  readonly edgesPriorityFn: PriorityFn;
}
