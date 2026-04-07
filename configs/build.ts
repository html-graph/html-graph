import { resolve } from "path";
import { BuildOptions } from "vite";

export const build: BuildOptions = {
  lib: {
    entry: resolve(__dirname, "../src/index.ts"),
    formats: ["es", "umd"],
    fileName: "html-graph",
    name: "HtmlGraph",
  },
  copyPublicDir: false,
  minify: false,
};
