export type DraggingPortDirectionConfig =
  | number
  | undefined
  /**
   * @deprecated
   * use "nearest-connectable-port" instead
   */
  | "closest-connectable-port"
  | "nearest-connectable-port";
