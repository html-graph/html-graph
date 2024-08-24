import { defineConfig } from 'vite'
import { resolve } from 'path'
import tsconfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    dts({
      include: ['lib'],
      rollupTypes: true
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      formats: ['es', 'umd'],
      fileName: "main",
      name: "GraphFlow"
    },
    copyPublicDir: false,
  },
})
