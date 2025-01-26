import { BackgroundDrawingFn } from "../background-drawing-fn";

export const createNoopBackgroundDrawingFn: () => BackgroundDrawingFn = () => {
  return () => {
    // no actions should be performed
  };
};
