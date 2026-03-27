// vite.config.ts
import { defineConfig } from "file:///home/md/repos/html-graph/node_modules/vite/dist/node/index.js";
import { resolve } from "path";
import dts from "file:///home/md/repos/html-graph/node_modules/vite-plugin-dts/dist/index.mjs";
import checker from "file:///home/md/repos/html-graph/node_modules/vite-plugin-checker/dist/esm/main.js";
var __vite_injected_original_dirname = "/home/md/repos/html-graph";
var vite_config_default = defineConfig({
  resolve: {
    alias: [
      { find: "@", replacement: resolve(__vite_injected_original_dirname, "src") },
      {
        find: "@html-graph/html-graph",
        replacement: resolve(__vite_injected_original_dirname, "src")
      }
    ]
  },
  plugins: [
    dts({
      include: ["src"],
      rollupTypes: true
    }),
    checker({ typescript: true })
  ],
  build: {
    lib: {
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      formats: ["es", "umd"],
      fileName: "html-graph",
      name: "HtmlGraph"
    },
    copyPublicDir: false
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9tZC9yZXBvcy9odG1sLWdyYXBoXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9tZC9yZXBvcy9odG1sLWdyYXBoL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL21kL3JlcG9zL2h0bWwtZ3JhcGgvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgZHRzIGZyb20gXCJ2aXRlLXBsdWdpbi1kdHNcIjtcbmltcG9ydCBjaGVja2VyIGZyb20gXCJ2aXRlLXBsdWdpbi1jaGVja2VyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczogW1xuICAgICAgeyBmaW5kOiBcIkBcIiwgcmVwbGFjZW1lbnQ6IHJlc29sdmUoX19kaXJuYW1lLCBcInNyY1wiKSB9LFxuICAgICAge1xuICAgICAgICBmaW5kOiBcIkBodG1sLWdyYXBoL2h0bWwtZ3JhcGhcIixcbiAgICAgICAgcmVwbGFjZW1lbnQ6IHJlc29sdmUoX19kaXJuYW1lLCBcInNyY1wiKSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIGR0cyh7XG4gICAgICBpbmNsdWRlOiBbXCJzcmNcIl0sXG4gICAgICByb2xsdXBUeXBlczogdHJ1ZSxcbiAgICB9KSxcbiAgICBjaGVja2VyKHsgdHlwZXNjcmlwdDogdHJ1ZSB9KSxcbiAgXSxcbiAgYnVpbGQ6IHtcbiAgICBsaWI6IHtcbiAgICAgIGVudHJ5OiByZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvaW5kZXgudHNcIiksXG4gICAgICBmb3JtYXRzOiBbXCJlc1wiLCBcInVtZFwiXSxcbiAgICAgIGZpbGVOYW1lOiBcImh0bWwtZ3JhcGhcIixcbiAgICAgIG5hbWU6IFwiSHRtbEdyYXBoXCIsXG4gICAgfSxcbiAgICBjb3B5UHVibGljRGlyOiBmYWxzZSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE2UCxTQUFTLG9CQUFvQjtBQUMxUixTQUFTLGVBQWU7QUFDeEIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sYUFBYTtBQUhwQixJQUFNLG1DQUFtQztBQUt6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxFQUFFLE1BQU0sS0FBSyxhQUFhLFFBQVEsa0NBQVcsS0FBSyxFQUFFO0FBQUEsTUFDcEQ7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLGFBQWEsUUFBUSxrQ0FBVyxLQUFLO0FBQUEsTUFDdkM7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLE1BQ0YsU0FBUyxDQUFDLEtBQUs7QUFBQSxNQUNmLGFBQWE7QUFBQSxJQUNmLENBQUM7QUFBQSxJQUNELFFBQVEsRUFBRSxZQUFZLEtBQUssQ0FBQztBQUFBLEVBQzlCO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxLQUFLO0FBQUEsTUFDSCxPQUFPLFFBQVEsa0NBQVcsY0FBYztBQUFBLE1BQ3hDLFNBQVMsQ0FBQyxNQUFNLEtBQUs7QUFBQSxNQUNyQixVQUFVO0FBQUEsTUFDVixNQUFNO0FBQUEsSUFDUjtBQUFBLElBQ0EsZUFBZTtBQUFBLEVBQ2pCO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
