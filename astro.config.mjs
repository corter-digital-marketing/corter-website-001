// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://corterdigital.com',
  // Pages build to /websites/index.html etc., so URLs are /websites (no .html)
  build: { format: 'directory' },
  integrations: [sitemap()],
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
});
