export const createSelectionRectangleWrapper = (): HTMLElement => {
  const element = document.createElement("div");

  element.style.position = "absolute";

  return element;
};
