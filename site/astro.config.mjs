import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

export default defineConfig({
  output: 'static',
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  integrations: [
    starlight({
      title: 'Harness Architecture Book Wiki',
      customCss: ['katex/dist/katex.min.css'],
      sidebar: [
        { label: 'Foundation', slug: 'index' },
        { label: 'Math Fixture', slug: 'math-fixture' },
        { label: 'Corpus Inventory', link: '/inventory/' },
      ],
    }),
  ],
});
