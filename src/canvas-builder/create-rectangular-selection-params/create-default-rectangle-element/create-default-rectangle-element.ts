export const createDefaultRectangleElement: () => HTMLDivElement = () => {
  const element = document.createElement("div");

  element.style.width = "100%";
  element.style.height = "100%";
  element.style.background = "rgba(174, 238, 255, 0.34)";
  element.style.border = "1px dashed rgba(96, 96, 96, 0.47)";

  return element;
};
