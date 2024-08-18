import { PublicViewportTransformer } from "@/components/public-viewport-transformer/public-viewport-transformer";

const gap = 100;

export const defaultBackgroundDrawingFn = (
    ctx: CanvasRenderingContext2D,
    transformer: PublicViewportTransformer,
) => {
    const topLeftAbsCoords = transformer.getAbsCoords(0, 0);
    const bottomRightAbsCoords = transformer.getAbsCoords(ctx.canvas.width, ctx.canvas.height);
    const zeroViewCoords = transformer.getViewCoords(0, 0);
    const viewScale = transformer.getViewScale();
    const scaledGap = gap * viewScale;

    const absWidth = bottomRightAbsCoords[0] - topLeftAbsCoords[0];
    const absHeight = bottomRightAbsCoords[1] - topLeftAbsCoords[1];

    const xFrom = zeroViewCoords[1] % scaledGap;
    const yFrom = zeroViewCoords[1] % scaledGap;

    const r = 5 * viewScale;
    const pi2 = 2 * Math.PI;

    const xTo = absWidth + xFrom;
    const yTo = absHeight + yFrom;

    ctx.fillStyle = "#c9c9c9";

    let cnt = 0;

    for (let x = xFrom; x <= xTo; x+= scaledGap) {
        for (let y = yFrom; y <= yTo; y+= scaledGap) {
            ctx.beginPath();
            ctx.arc(x, y, r, 0, pi2);
            ctx.closePath();

            ctx.fill();
            cnt++;
        }
    }

    console.log(cnt);



    // const entries = ([
    //     [0, 0],
    //     [100, 0],
    //     [-100, 0],
    //     [0, 100],
    //     [0, -100],
    // ] as const)

    // entries.forEach(entry => {
    //     const [x1, y1] = transformer.getViewCoords(entry[0], entry[1]);

    //     ctx.beginPath();
    //     ctx.arc(x1, y1, r, 0, pi2);
    //     ctx.closePath();

    //     ctx.fill();
    // });
};
