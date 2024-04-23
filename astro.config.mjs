import { defineConfig } from 'astro/config';

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: node({
    mode: "middleware"
  }),
  server: {
    port: 8000,
  },
});