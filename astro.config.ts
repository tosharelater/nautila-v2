import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages: https://tosharelater.github.io/nautila-v2/
  site: 'https://tosharelater.github.io',
  base: '/nautila-v2/',
  output: 'static',
  compressHTML: true,
});
