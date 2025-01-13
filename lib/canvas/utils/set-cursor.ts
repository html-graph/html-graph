export const setCursor: (
  element: HTMLElement | null,
  type: string | null,
) => void = (element: HTMLElement | null, type: string | null) => {
  if (element === null) {
    return;
  }

  if (type !== null) {
    element.style.cursor = type;
  } else {
    element.style.removeProperty("cursor");
  }
};
