export const createContainer = (): HTMLElement => {
  const element = document.createElement("div");

  element.style.position = "absolute";
  element.style.left = "0";
  element.style.top = "0";
  element.style.width = "0";
  element.style.height = "0";

  return element;
};
