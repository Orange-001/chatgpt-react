import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import AutoImport from 'unplugin-auto-import/vite'
import { compression } from 'vite-plugin-compression2'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
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
      preprocessorOptions: {
        less: {
          modifyVars: {}
        }
      }
    },
    define: {}
  }
})
