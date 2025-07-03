export const resetNodeElement = (element: HTMLElement): void => {
  element.style.removeProperty("position");
  element.style.removeProperty("top");
  element.style.removeProperty("left");
  element.style.removeProperty("visibility");
};
