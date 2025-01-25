import { defineConfig } from "vite";
import { resolve } from "path";
import checker from "vite-plugin-checker";
import { globSync } from "glob";
import path from "node:path";
import { fileURLToPath } from "node:url";

const inputs = Object.fromEntries(
  globSync("use-cases/**/*.html").map((file) => {
    return [
      path.relative(
        "use-cases",
        file.slice(0, file.length - path.extname(file).length),
      ),
      fileURLToPath(new URL(file, import.meta.url)),
    ];
  }),
);

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
  plugins: [checker({ typescript: true })],
  build: {
    outDir: "./dist-docs",
    rollupOptions: {
      input: {
        main: "index.html",
        ...inputs,
      },
    },
  },
});
