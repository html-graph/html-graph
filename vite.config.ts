import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import checker from "vite-plugin-checker";

export default defineConfig({
  plugins: [
    dts({
      include: ["lib"],
      rollupTypes: true,
    }),
    checker({ typescript: true }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "lib/main.ts"),
      formats: ["es", "umd"],
      fileName: "main",
      name: "HTMLGraph",
    },
    copyPublicDir: false,
  },
});
