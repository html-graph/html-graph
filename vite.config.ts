import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import checker from "vite-plugin-checker";

export default defineConfig({
  resolve: {
    alias: [
      { find: "@", replacement: resolve(__dirname, "src") },
      {
        find: "@html-graph/html-graph",
        replacement: resolve(__dirname, "src"),
      },
    ],
  },
  plugins: [
    dts({
      include: ["src"],
      rollupTypes: true,
    }),
    checker({ typescript: true }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "umd"],
      fileName: "html-graph",
      name: "HtmlGraph",
    },
    copyPublicDir: false,
  },
});
