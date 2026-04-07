import dts from "vite-plugin-dts";
import checker from "vite-plugin-checker";
import { PluginOption } from "vite";

export const pluginOptions: PluginOption[] = [
  dts({
    include: ["src"],
    rollupTypes: true,
  }),
  checker({ typescript: true }),
];
