import { TouchState } from "./touch-state";

export const processTouch = (event: TouchEvent): TouchState => {
  const touches: [number, number][] = [];

  const cnt = event.touches.length;

  for (let i = 0; i < cnt; i++) {
    touches.push([event.touches[i].clientX, event.touches[i].clientY]);
  }

  const sum: [number, number] = touches.reduce(
    (acc, cur) => [acc[0] + cur[0], acc[1] + cur[1]],
    [0, 0],
  );

  const avg = [sum[0] / cnt, sum[1] / cnt];

  const distances = touches.map((cur) => [cur[0] - avg[0], cur[1] - avg[1]]);

  const distance = distances.reduce(
    (acc, cur) => acc + Math.sqrt(cur[0] * cur[0] + cur[1] * cur[1]),
    0,
  );

  return {
    x: avg[0],
    y: avg[1],
    scale: distance / cnt,
    touchesCnt: cnt,
    touches,
  };
};
