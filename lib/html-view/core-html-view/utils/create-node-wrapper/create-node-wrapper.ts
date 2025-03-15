export const createNodeWrapper = (): HTMLElement => {
  const wrapper = document.createElement("div");

  wrapper.style.position = "absolute";
  wrapper.style.top = "0";
  wrapper.style.left = "0";
  wrapper.style.visibility = "hidden";

  return wrapper;
};
