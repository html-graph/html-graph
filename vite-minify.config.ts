import { defineConfig } from "vite";
import { resolveOptions } from "./configs/resolve-options";
import { pluginOptions } from "./configs/plugin-options";
import { buildMinify } from "./configs/build-minify";

export default defineConfig({
  resolve: resolveOptions,
  plugins: pluginOptions,
  build: buildMinify,
});
