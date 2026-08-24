import { defineConfig } from 'vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
  plugins: [cssInjectedByJsPlugin()],
  build: {
    outDir: '../custom_components/opendisplay_studio/frontend',
    emptyOutDir: true,
    lib: {
      entry: 'src/odx-app.ts',
      formats: ['es'],
      fileName: () => 'opendisplay-studio.js',
    },
    codeSplitting: false,
  },
})
