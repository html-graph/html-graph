import { CenterFn } from "../center/center-fn";

export type ApiPortsPayload =
  | HTMLElement
  | {
      readonly element: HTMLElement;
      readonly centerFn?: CenterFn;
      readonly dir?: number | null;
    };
