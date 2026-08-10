export const createHost = (): HTMLElement => {
  const element = document.createElement("div");

  element.style.width = "100%";
  element.style.height = "100%";
  element.style.position = "relative";

  return element;
};
