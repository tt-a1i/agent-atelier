// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

// https://astro.build/config
// GitHub project Pages: https://tt-a1i.github.io/agent-atelier/
export default defineConfig({
  site: 'https://tt-a1i.github.io',
  base: '/agent-atelier/',
  integrations: [mdx()],
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
