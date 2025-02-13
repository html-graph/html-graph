import { EdgeShape } from "../edge-shape";
import { EdgeRenderParams } from "../edge-render-params";
import {
  createArrowPath,
  createFlipDirectionVector,
  createEdgeArrow,
  createEdgeSvg,
  createEdgeLine,
  createEdgeRectangle,
} from "../utils";
import { zero } from "@/point";
import { createCycleSquareLinePath } from "../utils/create-cycle-square-line-path";

export class CycleSquareEdgeShape implements EdgeShape {
  public readonly svg = createEdgeSvg();

  private readonly line: SVGPathElement;

  private readonly arrow: SVGPathElement | null = null;

  private readonly roundness: number;

  public constructor(
    color: string,
    width: number,
    private readonly arrowLength: number,
    private readonly arrowWidth: number,
    hasArrow: boolean,
    private readonly side: number,
    private readonly minPortOffset: number,
    roundness: number,
  ) {
    this.roundness = Math.min(roundness, this.minPortOffset, this.side / 2);

    this.line = createEdgeLine(color, width);
    this.svg.appendChild(this.line);

    if (hasArrow) {
      this.arrow = createEdgeArrow(color);
      this.svg.appendChild(this.arrow);
    }
  }

  public render(params: EdgeRenderParams): void {
    const { x, y, width, height, flipX, flipY } = createEdgeRectangle(
      params.source,
      params.target,
    );

    this.svg.style.width = `${width}px`;
    this.svg.style.height = `${height}px`;
    this.svg.style.transform = `translate(${x}px, ${y}px)`;

    const fromVect = createFlipDirectionVector(
      params.source.direction,
      flipX,
      flipY,
    );

    const linePath = createCycleSquareLinePath(
      fromVect,
      this.arrowLength,
      this.side,
      this.minPortOffset,
      this.roundness,
      this.arrow !== null,
      this.arrow !== null,
    );

    this.line.setAttribute("d", linePath);

    if (this.arrow) {
      const arrowPath = createArrowPath(
        fromVect,
        zero,
        this.arrowLength,
        this.arrowWidth,
      );

      this.arrow.setAttribute("d", arrowPath);
    }
  }
}
