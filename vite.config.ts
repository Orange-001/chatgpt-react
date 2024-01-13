import { fileURLToPath, URL } from 'node:url'

import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig, loadEnv } from 'vite'
import { compression } from 'vite-plugin-compression2'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isBuild = mode === 'production'
  const isVisualizer = mode === 'visualizer'

  return {
    plugins: [
      react(),
      UnoCSS(),
      AutoImport({
        include: [/\.[tj]sx?$/],
        imports: ['react', 'react-router', 'react-router-dom']
      }),
      (isBuild || isVisualizer) && compression(),

      // put it the last one
      isVisualizer &&
        visualizer({
          open: true,
          gzipSize: true,
          filename: 'visualizer.html'
        })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    css: {
      preprocessorOptions: {}
    },
    define: {}
  }
})
