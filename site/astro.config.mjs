import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { bookSidebar } from './src/data/book-spine';

export default defineConfig({
  output: 'static',
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  integrations: [
    starlight({
      title: 'Harness Architecture Book Wiki',
      customCss: ['katex/dist/katex.min.css', './src/styles/atlas.css'],
      sidebar: bookSidebar,
    }),
  ],
});
