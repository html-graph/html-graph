import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import checker from "vite-plugin-checker";

export default defineConfig({
  resolve: {
    alias: [
      { find: "@", replacement: resolve(__dirname, "lib") },
      {
        find: "@html-graph/html-graph",
        replacement: resolve(__dirname, "lib"),
      },
    ],
  },
  plugins: [
    dts({
      include: ["lib"],
      rollupTypes: true,
    }),
    checker({ typescript: true }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "lib/index.ts"),
      formats: ["es", "umd"],
      fileName: "main",
      name: "HtmlGraph",
    },
    copyPublicDir: false,
  },
});
