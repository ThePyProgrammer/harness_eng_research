import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const componentSource = readFileSync(
  fileURLToPath(new URL('./AtlasConstellation.astro', import.meta.url)),
  'utf8',
);
const homepageSource = readFileSync(
  fileURLToPath(new URL('../content/docs/index.mdx', import.meta.url)),
  'utf8',
);

describe('AtlasConstellation homepage contract', () => {
  it('renders the atlas before the introductory essay', () => {
    expect(homepageSource).toContain('Scholarly atlas of harness architecture');
    expect(homepageSource).toContain('Harness Architecture Corpus Map');
    expect(homepageSource).toContain('Explore the corpus map');
    expect(homepageSource).toContain('A book/wiki for source-grounded harness research');
    expect(homepageSource.indexOf('<AtlasConstellation />')).toBeLessThan(
      homepageSource.indexOf('## A book/wiki for source-grounded harness research'),
    );
  });

  it('uses the shared book spine and source-detail links', () => {
    expect(componentSource).toContain("import { bookSpine }");
    expect(componentSource).not.toContain('const pillarArc');
    expect(componentSource).toContain("item.id === 'umbrella'");
    expect(componentSource).toContain('pillars = bookSpine.filter');
    expect(componentSource).toContain('Open umbrella framework');
    expect(componentSource).toContain('Open {pillar.title} source detail');
  });
});
