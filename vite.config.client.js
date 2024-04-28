import { defineConfig } from 'vite'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { plugins, build } from './vite.config.js'
import SSR from './server/server-utils.js'

const dir = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  plugins,
  build: {
    ...build,
    outDir: SSR.outDirClient,
    rollupOptions: {
      input: {
        client: resolve(dir, 'index.html'),
        // We'll never actually use this JS bundle, but need it to build assets that are only referenced by SSR pages
        ssrAssetCollector: resolve(dir, 'src/entry-server.jsx')
      }
    }
  }
})
