import { BackgroundConfig } from "./background-config";
import { Config } from "./config";
import { resolveRenderer } from "./resolve-renderer";

export const createConfig = (backgroundConfig: BackgroundConfig): Config => {
  const dimensions = backgroundConfig.tileDimensions;
  const width = dimensions?.width ?? 25;
  const height = dimensions?.height ?? 25;
  const renderer = resolveRenderer(backgroundConfig.renderer ?? {});

  return {
    tileWidth: width,
    tileHeight: height,
    renderer,
    maxViewportScale: backgroundConfig.maxViewportScale ?? 10,
  };
};
