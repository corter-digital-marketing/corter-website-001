// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://corterdigital.com',
  // Pages build to /websites/index.html etc., so URLs are /websites (no .html)
  build: { format: 'directory' },
  // Keep the post-purchase page out of the sitemap
  integrations: [sitemap({ filter: (page) => !page.includes('/thank-you') })],
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
});
