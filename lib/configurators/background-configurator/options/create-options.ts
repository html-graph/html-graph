import { BackgroundOptions } from "./background-options";
import { Options } from "./options";
import { resolveRenderer } from "./resolve-renderer";

export const createOptions = (
  backgroundOptions: BackgroundOptions,
): Options => {
  const dimensions = backgroundOptions.tileDimensions;
  const width = dimensions?.width ?? 25;
  const height = dimensions?.height ?? 25;
  const renderer = resolveRenderer(
    backgroundOptions.renderer ?? { type: "dots" },
  );

  return {
    tileWidth: width,
    tileHeight: height,
    renderer,
    maxViewportScale: backgroundOptions.maxViewportScale ?? 10,
  };
};
