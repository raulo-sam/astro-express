import { defineConfig } from 'vite'
import { plugins, build } from './vite.config.js'
import SSR from './server/server-utils.js'

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  plugins,
  build: {
    ...build,
    outDir: SSR.outDirServer,
  }
  // ssr: {
  //   noExternal: ['react-syntax-highlighter'] // TODO: Open an issue to explain this
  // }
})
