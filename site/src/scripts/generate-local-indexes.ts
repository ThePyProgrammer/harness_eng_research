import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { corpusEntries } from '../data/corpus';
import type { CorpusEntry } from '../data/corpus.schema';

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

function siteRoot(): string {
  return resolve(dirname(fileURLToPath(import.meta.url)), '../..');
}

function assertInsideSite(outputDir: string, root: string): string {
  if (outputDir.includes('..')) {
    throw new Error('Output directory must stay inside site/');
  }

  const resolvedOutputDir = isAbsolute(outputDir) ? resolve(outputDir) : resolve(root, outputDir);
  const relativePath = relative(root, resolvedOutputDir);

  if (relativePath === '..' || relativePath.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`) || isAbsolute(relativePath)) {
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

function runCli(): number {
  try {
    writeCorpusIndex();
    console.error('Successfully created: dist/corpus-index.json');
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
