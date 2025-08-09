export const setSvgRectangle = (
  svg: SVGSVGElement,
  params: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  },
): void => {
  svg.style.transform = `translate(${params.x}px, ${params.y}px)`;
  svg.style.width = `${Math.max(params.width, 1)}px`;
  svg.style.height = `${Math.max(params.height, 1)}px`;
};
