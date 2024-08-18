import { PublicViewportTransformer } from "@/components/public-viewport-transformer/public-viewport-transformer";

const defaultBackgroundDrawingFn = (
    ctx: CanvasRenderingContext2D,
    transformer: PublicViewportTransformer,
    color: string,
    gap: number,
    radius: number,
) => {
    const zeroViewCoords = transformer.getViewCoords(0, 0);
    const viewScale = transformer.getViewScale();
    const viewGap = gap * viewScale;

    const zeroOffsetX = zeroViewCoords[0] - Math.floor(zeroViewCoords[0] / viewGap) * viewGap;
    const zeroOffsetY = zeroViewCoords[1] - Math.floor(zeroViewCoords[1] / viewGap) * viewGap;

    const r = radius * viewScale;
    const pi2 = 2 * Math.PI;

    const xTo = ctx.canvas.width + zeroOffsetX;
    const yTo = ctx.canvas.height + zeroOffsetY;

    ctx.fillStyle = color;

    const xFrom = zeroOffsetX - viewGap;
    const yFrom = zeroOffsetY - viewGap;

    for (let x = xFrom; x <= xTo; x+= viewGap) {
        for (let y = yFrom; y <= yTo; y+= viewGap) {
            ctx.beginPath();
            ctx.arc(x, y, r, 0, pi2);
            ctx.closePath();

            ctx.fill();
        }
    }
};

export const createBackgroundDrawingFn = (
    color: string,
    gap: number,
    radius: number
) => {
    return (ctx: CanvasRenderingContext2D,transformer: PublicViewportTransformer,
    ) => {
        defaultBackgroundDrawingFn(ctx, transformer, color, gap, radius);
    }
}
