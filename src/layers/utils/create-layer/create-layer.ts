export const createLayer: () => HTMLDivElement = () => {
  const host = document.createElement("div");

  host.style.position = "absolute";
  host.style.inset = "0";

  return host;
};
