import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chapterRegistry } from '../data/chapters';
import { conceptRegistry } from '../data/concepts';
import { corpusEntries } from '../data/corpus';
import type { CorpusEntry } from '../data/corpus.schema';
import { parseDiscoverySearchIndex, type DiscoverySearchIndex, type DiscoverySearchRecord, type SearchResultType } from '../data/discovery.schema';
import { citations, formalRegistry } from '../data/formal-registry';
import { readingPaths } from '../data/reading-paths';

export interface CorpusIndex {
  generatedBy: 'site/src/scripts/generate-local-indexes.ts';
  entryCount: number;
  entries: CorpusEntry[];
}

export interface WriteCorpusIndexOptions {
  outputDir?: string;
}

const generatedBy = 'site/src/scripts/generate-local-indexes.ts' as const;
const outputFileName = 'corpus-index.json';
const searchOutputFileName = 'search-index.json';
const resultClasses: SearchResultType[] = ['Pages', 'Formal Objects', 'Concepts', 'Citations', 'Reading Paths'];

function siteRoot(): string {
  return resolve(dirname(fileURLToPath(import.meta.url)), '../..');
}

function assertInsideSite(outputDir: string, root: string): string {
  const resolvedOutputDir = isAbsolute(outputDir) ? resolve(outputDir) : resolve(root, outputDir);
  const relativePath = relative(root, resolvedOutputDir);

  if (relativePath === '..' || relativePath.startsWith(`..${sep}`) || isAbsolute(relativePath)) {
    throw new Error('Output directory must stay inside site/');
  }

  return resolvedOutputDir;
}

export function buildCorpusIndex(entries: CorpusEntry[] = corpusEntries): CorpusIndex {
  return {
    generatedBy,
    entryCount: entries.length,
    entries: entries.map((entry) => ({ ...entry })),
  };
}

function ownerTitle(ownerId: string): string | undefined {
  return corpusEntries.find((entry) => entry.id === ownerId)?.title;
}

function ownerSlug(ownerId: string): string | undefined {
  return corpusEntries.find((entry) => entry.id === ownerId)?.slug;
}

function pageRecords(entries: CorpusEntry[]): DiscoverySearchRecord[] {
  return entries.map((entry) => ({
    id: `page:${entry.id}`,
    resultType: 'Pages',
    stableId: entry.id,
    title: entry.title,
    href: `/corpus/${entry.slug}/`,
    snippet: `${entry.kind === 'umbrella' ? 'Umbrella framework' : 'Pillar'} page: ${entry.summary}`,
    ownerId: entry.id,
    ownerTitle: entry.title,
    sourceLabel: entry.canonicalTex,
  }));
}

function formalObjectRecords(): DiscoverySearchRecord[] {
  return formalRegistry.map((object) => {
    const slug = ownerSlug(object.ownerId);
    const title = ownerTitle(object.ownerId);
    if (!slug || !title) {
      throw new Error(`Missing corpus owner for formal object ${object.id}`);
    }

    return {
      id: `formal-object:${object.id}`,
      resultType: 'Formal Objects',
      stableId: object.id,
      title: object.title,
      href: `/corpus/${slug}/#${object.id}`,
      snippet: object.statement,
      ownerId: object.ownerId,
      ownerTitle: title,
      objectKind: object.kind,
      aliases: object.notation,
      sourceLabel: object.sourceTrail[0]?.label,
    };
  });
}

function conceptRecords(): DiscoverySearchRecord[] {
  return conceptRegistry.map((concept) => ({
    id: `concept:${concept.id}`,
    resultType: 'Concepts',
    stableId: concept.id,
    title: concept.term,
    href: `/glossary/#${concept.id}`,
    snippet: concept.definition,
    ownerId: concept.ownerIds[0],
    ownerTitle: ownerTitle(concept.ownerIds[0]),
    aliases: concept.aliases,
    sourceLabel: concept.sourceTrail[0]?.label,
  }));
}

function citationRecords(): DiscoverySearchRecord[] {
  return citations.map((citation) => ({
    id: `citation:${citation.id}`,
    resultType: 'Citations',
    stableId: citation.id,
    title: citation.label,
    href: `/formal-registry/#${citation.id}`,
    snippet: citation.sourceTrail.map((source) => source.label).join('; '),
    aliases: citation.sourceTrail.map((source) => source.path),
    sourceLabel: citation.sourceTrail[0]?.path,
  }));
}

function readingPathRecords(): DiscoverySearchRecord[] {
  return readingPaths.map((path) => ({
    id: `reading-path:${path.slug}`,
    resultType: 'Reading Paths',
    stableId: path.slug,
    title: path.title,
    href: `/reading-paths/${path.slug}/`,
    snippet: `${path.theme}. ${path.purpose}`,
    aliases: path.branches.flatMap((branch) => [branch.title, ...branch.stops.map((stop) => stop.title)]),
  }));
}

export function buildDiscoverySearchIndex(entries: CorpusEntry[] = corpusEntries): DiscoverySearchIndex {
  const records = [
    ...pageRecords(entries),
    ...formalObjectRecords(),
    ...conceptRecords(),
    ...citationRecords(),
    ...readingPathRecords(),
  ];

  return parseDiscoverySearchIndex({
    generatedBy,
    recordCount: records.length,
    resultClasses,
    records,
  });
}

export function writeCorpusIndex(options: WriteCorpusIndexOptions = {}): string {
  const root = siteRoot();
  const outputDir = options.outputDir ?? 'dist';
  const safeOutputDir = assertInsideSite(outputDir, root);
  const outputPath = resolve(safeOutputDir, outputFileName);
  const payload = `${JSON.stringify(buildCorpusIndex(), null, 2)}\n`;

  mkdirSync(safeOutputDir, { recursive: true });
  writeFileSync(outputPath, payload, 'utf-8');

  return outputPath;
}

export function writeDiscoverySearchIndex(options: WriteCorpusIndexOptions = {}): string {
  const root = siteRoot();
  const outputDir = options.outputDir ?? 'dist';
  const safeOutputDir = assertInsideSite(outputDir, root);
  const outputPath = resolve(safeOutputDir, searchOutputFileName);
  const payload = `${JSON.stringify(buildDiscoverySearchIndex(), null, 2)}\n`;

  mkdirSync(safeOutputDir, { recursive: true });
  writeFileSync(outputPath, payload, 'utf-8');

  return outputPath;
}

function runCli(): number {
  try {
    writeCorpusIndex();
    writeDiscoverySearchIndex();
    console.error('Successfully created: dist/corpus-index.json');
    console.error('Successfully created: dist/search-index.json');
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error: Failed to save output: ${message}`);
    return 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exit(runCli());
}
