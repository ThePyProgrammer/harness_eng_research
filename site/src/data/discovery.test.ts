import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { chapterRegistry } from './chapters';
import { conceptRegistry } from './concepts';
import { citations, formalRegistry } from './formal-registry';
import { parseReadingPaths } from './discovery.schema';
import { readingPaths } from './reading-paths';

const requiredSlugs = [
  'building-a-harness',
  'scaling-multi-agent-work',
  'cost-latency',
  'production-hardening',
  'ai-code-degradation',
] as const;

const chapterIds = new Set(chapterRegistry.map((chapter) => chapter.ownerId));
const conceptIds = new Set(conceptRegistry.map((concept) => concept.id));
const formalObjectIds = new Set(formalRegistry.map((object) => object.id));
const citationIds = new Set(citations.map((citation) => citation.id));
const readingPathIds = new Set(requiredSlugs);

function hasKnownTarget(type: string, id: string): boolean {
  if (type === 'chapter') return chapterIds.has(id as never);
  if (type === 'concept') return conceptIds.has(id);
  if (type === 'formal-object') return formalObjectIds.has(id);
  if (type === 'citation') return citationIds.has(id);
  if (type === 'reading-path') return readingPathIds.has(id as never);
  return false;
}

describe('reading path data contract', () => {
  it('parses the curated reading path registry with exactly the five required BOOK-04 themes', () => {
    expect(parseReadingPaths(readingPaths)).toEqual(readingPaths);
    expect(readingPaths.map((path) => path.slug)).toEqual([...requiredSlugs]);
  });

  it('renders each reading path as a branching route map with stops', () => {
    for (const path of readingPaths) {
      expect(path.branches.length, `${path.slug} branch count`).toBeGreaterThanOrEqual(2);
      expect(path.purpose, `${path.slug} purpose`).toEqual(expect.any(String));
      expect(path.purpose.length, `${path.slug} purpose length`).toBeGreaterThan(80);

      for (const branch of path.branches) {
        expect(branch.stops.length, `${path.slug}/${branch.id} stop count`).toBeGreaterThan(0);
        expect(branch.summary, `${path.slug}/${branch.id} summary`).toEqual(expect.any(String));
      }
    }
  });

  it('gives every stop guidance text plus a direct target reference and href', () => {
    for (const path of readingPaths) {
      for (const branch of path.branches) {
        for (const stop of branch.stops) {
          expect(stop.title.trim(), `${stop.id} title`).toBeTruthy();
          expect(stop.target.type, `${stop.id} target type`).toMatch(/^(chapter|concept|formal-object|citation|reading-path)$/u);
          expect(stop.target.id.trim(), `${stop.id} target id`).toBeTruthy();
          expect(stop.target.href, `${stop.id} target href`).toMatch(/^\//u);
          expect(stop.why, `${stop.id} why`).toEqual(expect.any(String));
          expect(stop.why.length, `${stop.id} why length`).toBeGreaterThan(60);
        }
      }
    }
  });

  it('resolves every stop target to a known chapter, concept, formal object, citation, or path id', () => {
    for (const path of readingPaths) {
      for (const branch of path.branches) {
        for (const stop of branch.stops) {
          expect(
            hasKnownTarget(stop.target.type, stop.target.id),
            `${path.slug}/${branch.id}/${stop.id} -> ${stop.target.type}:${stop.target.id}`,
          ).toBe(true);
        }
      }
    }
  });
});

describe('reading path page and component source contracts', () => {
  const pageSource = readFileSync(
    fileURLToPath(new URL('../pages/reading-paths/[slug].astro', import.meta.url)),
    'utf8',
  );
  const componentSource = readFileSync(
    fileURLToPath(new URL('../components/discovery/ReadingPathMap.astro', import.meta.url)),
    'utf8',
  );

  it('generates static route pages from the curated readingPaths registry', () => {
    expect(pageSource).toContain('export function getStaticPaths()');
    expect(pageSource).toMatch(/readingPaths\.map/u);
  });

  it('marks reading path content as local-search body content', () => {
    expect(pageSource).toContain('data-pagefind-body');
  });

  it('keeps required route-stop guidance and link labels visible in source', () => {
    expect(componentSource).toContain('Why this stop matters');
    expect(componentSource).toContain('Open stop');
  });

  it('marks decorative connector SVG as hidden and unfocusable', () => {
    expect(componentSource).toContain('aria-hidden="true"');
    expect(componentSource).toContain('focusable="false"');
  });
});
