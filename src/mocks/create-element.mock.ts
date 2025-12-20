export const createElement = (params?: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  tag?: string;
}): HTMLElement => {
  const div = document.createElement(params?.tag ?? "div");

  div.getBoundingClientRect = (): DOMRect => {
    return new DOMRect(
      params?.x ?? 0,
      params?.y ?? 0,
      params?.width ?? 0,
      params?.height ?? 0,
    );
  };

  return div;
};
