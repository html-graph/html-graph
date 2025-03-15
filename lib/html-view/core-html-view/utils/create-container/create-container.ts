export const createContainer: () => HTMLDivElement = () => {
  const container = document.createElement("div");

  container.style.position = "absolute";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "0";
  container.style.height = "0";

  return container;
};
