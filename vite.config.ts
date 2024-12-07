import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import checker from "vite-plugin-checker";

export default defineConfig({
  resolve: {
    alias: {
      "@html-graph/html-graph": resolve(__dirname, "./lib"),
      "@/*": resolve(__dirname, "./lib/*"),
    },
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
      name: "HTMLGraph",
    },
    copyPublicDir: false,
  },
});
