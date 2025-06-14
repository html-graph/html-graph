export const createHost: () => HTMLDivElement = () => {
  const host = document.createElement("div");

  host.style.width = "100%";
  host.style.height = "100%";
  host.style.position = "relative";

  return host;
};
