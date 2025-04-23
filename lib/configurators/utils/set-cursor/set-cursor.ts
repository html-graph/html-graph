export const setCursor: (element: HTMLElement, type: string | null) => void = (
  element: HTMLElement,
  type: string | null,
) => {
  if (type !== null) {
    element.style.cursor = type;
  } else {
    element.style.removeProperty("cursor");
  }
};
