import { resolve } from "path";
import { BuildOptions } from "vite";

export const buildMinify: BuildOptions = {
  lib: {
    entry: resolve(__dirname, "../src/index.ts"),
    formats: ["es", "umd"],
    fileName: "html-graph.min",
    name: "HtmlGraph",
  },
  copyPublicDir: false,
  minify: true,
  emptyOutDir: false,
};
