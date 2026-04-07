import { AliasOptions, ResolveOptions } from "vite";
import { resolve } from "path";

export const resolveOptions: ResolveOptions & { alias: AliasOptions } = {
  alias: [
    { find: "@", replacement: resolve(__dirname, "../src") },
    {
      find: "@html-graph/html-graph",
      replacement: resolve(__dirname, "../src"),
    },
  ],
};
