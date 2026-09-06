export const createLayer = (zIndex: number): HTMLDivElement => {
  const host = document.createElement("div");

  host.style.position = "absolute";
  host.style.inset = "0";
  host.style.zIndex = `${zIndex}`;

  return host;
};
