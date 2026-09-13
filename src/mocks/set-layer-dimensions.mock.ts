export const setLayersDimensions = (element: HTMLElement): void => {
  for (const child of element.children[0].children) {
    child.getBoundingClientRect = element.getBoundingClientRect;
  }
};
