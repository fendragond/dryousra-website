import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://dryousra.ma',
  output: 'static',
  integrations: [sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },

  build: {
    format: 'directory',
  },

  trailingSlash: 'never',

  devToolbar: {
    enabled: false,
  },

  adapter: cloudflare(),
});