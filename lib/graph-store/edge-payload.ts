import { EdgeController } from "@/edges";

export interface EdgePayload {
  from: string;
  to: string;
  controller: EdgeController;
  priority: number;
}
