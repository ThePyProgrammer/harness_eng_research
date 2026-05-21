import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chapterRegistry } from '../data/chapters';
import { conceptRegistry } from '../data/concepts';
import { corpusEntries } from '../data/corpus';
import { expectedCorpusIds } from '../data/corpus.schema';
import { citations, derivationCoverageByOwner as defaultDerivationCoverageByOwner, formalRegistry, type DerivationCoverageEntry as SourceDerivationCoverageEntry } from '../data/formal-registry';
import type { ChapterRecord, ConceptRecord, FormalObject, OwnerId, SourceTrailItem } from '../data/formal-registry.schema';
import { readingPaths } from '../data/reading-paths';
import { relationRecords } from '../data/relations';
import { buildDiscoverySearchIndex, buildGraphIndex } from './generate-local-indexes';

type ChapterSectionKey = keyof ChapterRecord['sections'];
export type DerivationCoverageLabel = 'Supported' | 'Thin source support' | 'Not supported by canonical source' | 'Missing';

type MatrixDerivationStatus = SourceDerivationCoverageEntry['status'] | 'thin-support';
export type MatrixDerivationCoverageEntry = Omit<SourceDerivationCoverageEntry, 'status'> & {
  status: MatrixDerivationStatus;
};

export interface CoverageDiagnostic {
  gate: string;
  entryId: string;
  field: string;
  path: string;
  reason: string;
  nextStep: string;
}

export interface ChapterSectionCoverage {
  key: ChapterSectionKey;
  present: boolean;
  href: string;
}

export interface OwnerDerivationCoverage {
  label: DerivationCoverageLabel;
  rationale: string;
  sourcePaths: string[];
  formalObjectIds: string[];
}

export interface DiscoveryPresence {
  search: boolean;
  graph: boolean;
  readingPaths: boolean;
  relations: boolean;
  searchRecordCount: number;
  graphNeighborhoodCount: number;
  readingPathCount: number;
  relationCount: number;
}

export interface OwnerCoverage {
  ownerId: OwnerId;
  ownerTitle: string;
  chapterHref: string;
  chapterSections: ChapterSectionCoverage[];
  formalObjectCount: number;
  conceptCount: number;
  citationCount: number;
  sourceTrailCount: number;
  derivationCoverage: OwnerDerivationCoverage;
  discoveryPresence: DiscoveryPresence;
  diagnostics: CoverageDiagnostic[];
  formalAnchors: string[];
  sourceTrails: SourceTrailItem[];
}

export interface CoverageMatrix {
  generatedBy: 'site/src/scripts/generate-coverage-matrix.ts';
  ownerCount: number;
  owners: OwnerCoverage[];
  diagnostics: CoverageDiagnostic[];
}

export interface BuildCoverageMatrixOptions {
  derivationCoverageByOwner?: Partial<Record<OwnerId, MatrixDerivationCoverageEntry[]>>;
}

export interface WriteCoverageMatrixOptions extends BuildCoverageMatrixOptions {
  outputDir?: string;
}

const generatedBy = 'site/src/scripts/generate-coverage-matrix.ts' as const;
const outputFileName = 'coverage-matrix.json';
const requiredChapterSections = [
  'problem',
  'coreModel',
  'keyNotation',
  'definitions',
  'formalClaims',
  'derivationContext',
  'interpretation',
  'relatedPillars',
  'citations',
  'sourceTrail',
] as const satisfies ChapterSectionKey[];

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

function addDiagnostic(
  diagnostics: CoverageDiagnostic[],
  gate: string,
  entryId: string,
  field: string,
  path: string,
  reason: string,
  nextStep: string,
): void {
  diagnostics.push({ gate, entryId, field, path, reason, nextStep });
}

function chapterHref(slug: string): string {
  return `/corpus/${slug}/`;
}

function sourceTrailKey(source: SourceTrailItem): string {
  return `${source.id}:${source.path}:${source.label}`;
}

function collectSourceTrails(chapter: ChapterRecord | undefined, objects: FormalObject[], concepts: ConceptRecord[]): SourceTrailItem[] {
  const trails = [
    ...(chapter?.sourceTrail ?? []),
    ...objects.flatMap((object) => object.sourceTrail),
    ...concepts.flatMap((concept) => concept.sourceTrail),
  ];

  return Array.from(new Map(trails.map((source) => [sourceTrailKey(source), source])).values());
}

function derivationLabel(entries: MatrixDerivationCoverageEntry[] | undefined): DerivationCoverageLabel {
  if (!entries?.length) return 'Missing';
  if (entries.some((entry) => entry.status === 'supported')) return 'Supported';
  if (entries.some((entry) => entry.status === 'thin-support')) return 'Thin source support';
  return 'Not supported by canonical source';
}

function derivationRationale(label: DerivationCoverageLabel, entries: MatrixDerivationCoverageEntry[] | undefined): string {
  if (!entries?.length) return 'Missing derivation coverage entry. Add a supported derivation/equation entry or source-grounded limitation rationale.';
  const rationales = entries.map((entry) => entry.status === 'supported'
    ? `${entry.sourcePath} supports registry derivation objects ${entry.formalObjectIds.join(', ')}.`
    : entry.rationale ?? `${entry.sourcePath} records ${label}.`);

  return rationales.join(' ');
}

function buildDerivationCoverage(entries: MatrixDerivationCoverageEntry[] | undefined): OwnerDerivationCoverage {
  const label = derivationLabel(entries);

  return {
    label,
    rationale: derivationRationale(label, entries),
    sourcePaths: entries?.map((entry) => entry.sourcePath) ?? [],
    formalObjectIds: entries?.flatMap((entry) => entry.formalObjectIds) ?? [],
  };
}

function buildDiscoveryPresence(ownerId: OwnerId): DiscoveryPresence {
  const searchIndex = buildDiscoverySearchIndex();
  const graphIndex = buildGraphIndex();
  const searchRecords = searchIndex.records.filter((record) => record.ownerId === ownerId || record.stableId === ownerId);
  const graphNeighborhoods = graphIndex.neighborhoods.filter((neighborhood) => neighborhood.current.ownerId === ownerId || neighborhood.nodes.some((node) => node.ownerId === ownerId));
  const ownerReadingPaths = readingPaths.filter((path) => path.branches.some((branch) => branch.stops.some((stop) => stop.target.id === ownerId || stop.target.id.startsWith(`${ownerId}.`))));
  const ownerRelations = relationRecords.filter((record) => record.source.id === ownerId || record.source.id.startsWith(`${ownerId}.`) || record.target.id === ownerId || record.target.id.startsWith(`${ownerId}.`));

  return {
    search: searchRecords.length > 0,
    graph: graphIndex.overview.nodes.some((node) => node.id === `chapter:${ownerId}`) || graphNeighborhoods.length > 0,
    readingPaths: ownerReadingPaths.length > 0 || searchRecords.length > 0,
    relations: ownerRelations.length > 0 || graphIndex.overview.nodes.some((node) => node.id === `chapter:${ownerId}`),
    searchRecordCount: searchRecords.length,
    graphNeighborhoodCount: graphNeighborhoods.length,
    readingPathCount: ownerReadingPaths.length,
    relationCount: ownerRelations.length,
  };
}

function validateOwnerCoverage(owner: OwnerCoverage, chapter: ChapterRecord | undefined): CoverageDiagnostic[] {
  const diagnostics: CoverageDiagnostic[] = [];

  if (!chapter) {
    addDiagnostic(diagnostics, 'coverage', owner.ownerId, 'chapterRegistry', owner.ownerId, 'Missing chapter coverage record', 'Add a chapterRegistry record for this corpus owner.');
  }

  for (const section of owner.chapterSections) {
    if (!section.present) {
      addDiagnostic(diagnostics, 'coverage', owner.ownerId, `sections.${section.key}`, section.href, 'Missing required chapter section', 'Populate the required section from canonical source-grounded prose.');
    }
  }

  if (owner.formalObjectCount === 0) {
    addDiagnostic(diagnostics, 'coverage', owner.ownerId, 'formalObjectCount', owner.chapterHref, 'Owner has no formal objects', 'Add at least one source-trailed formal object for this owner.');
  }

  if (owner.conceptCount === 0) {
    addDiagnostic(diagnostics, 'coverage', owner.ownerId, 'conceptCount', owner.chapterHref, 'Owner has no glossary concepts', 'Add at least one concept registry entry for this owner.');
  }

  if (owner.citationCount === 0) {
    addDiagnostic(diagnostics, 'coverage', owner.ownerId, 'citationCount', owner.chapterHref, 'Owner has no citation records', 'Attach a canonical citation record to the owner chapter or formal objects.');
  }

  if (owner.sourceTrailCount === 0) {
    addDiagnostic(diagnostics, 'coverage', owner.ownerId, 'sourceTrailCount', owner.chapterHref, 'Owner has no source trails', 'Add repository-relative canonical source trails for this owner.');
  }

  if (owner.derivationCoverage.label === 'Missing') {
    addDiagnostic(diagnostics, 'coverage', owner.ownerId, 'derivationCoverage', owner.chapterHref, 'Missing derivation coverage', 'Add a supported derivation/equation entry or a source-grounded limitation rationale.');
  }

  for (const [field, present] of Object.entries(owner.discoveryPresence).filter((item): item is [keyof DiscoveryPresence, boolean] => typeof item[1] === 'boolean')) {
    if (!present) {
      addDiagnostic(diagnostics, 'coverage', owner.ownerId, `discoveryPresence.${field}`, owner.chapterHref, 'Owner is missing discovery/index presence', 'Ensure local search, graph, reading-path, and relation data include this owner.');
    }
  }

  return diagnostics;
}

export function buildCoverageMatrix(options: BuildCoverageMatrixOptions = {}): CoverageMatrix {
  const diagnostics: CoverageDiagnostic[] = [];
  const coverageByOwner = { ...defaultDerivationCoverageByOwner, ...options.derivationCoverageByOwner } as Partial<Record<OwnerId, MatrixDerivationCoverageEntry[]>>;
  const owners = corpusEntries.map((entry) => {
    const chapter = chapterRegistry.find((item) => item.ownerId === entry.id);
    const objects = formalRegistry.filter((object) => object.ownerId === entry.id);
    const ownerConcepts = conceptRegistry.filter((concept) => concept.ownerIds.includes(entry.id));
    const citationIds = new Set([...(chapter?.citationIds ?? []), ...objects.flatMap((object) => object.citationIds)]);
    const ownerCitations = citations.filter((citation) => citationIds.has(citation.id));
    const sourceTrails = collectSourceTrails(chapter, objects, ownerConcepts);
    const ownerHref = chapterHref(entry.slug);
    const ownerCoverage: OwnerCoverage = {
      ownerId: entry.id,
      ownerTitle: entry.title,
      chapterHref: ownerHref,
      chapterSections: requiredChapterSections.map((key) => ({
        key,
        present: Boolean(chapter?.sections[key]?.trim()),
        href: `${ownerHref}#${key}`,
      })),
      formalObjectCount: objects.length,
      conceptCount: ownerConcepts.length,
      citationCount: ownerCitations.length,
      sourceTrailCount: sourceTrails.length,
      derivationCoverage: buildDerivationCoverage(coverageByOwner[entry.id]),
      discoveryPresence: buildDiscoveryPresence(entry.id),
      diagnostics: [],
      formalAnchors: objects.map((object) => `${ownerHref}#${object.id}`),
      sourceTrails,
    };
    ownerCoverage.diagnostics = validateOwnerCoverage(ownerCoverage, chapter);
    diagnostics.push(...ownerCoverage.diagnostics);
    return ownerCoverage;
  });

  for (const ownerId of expectedCorpusIds) {
    if (!owners.some((owner) => owner.ownerId === ownerId)) {
      addDiagnostic(diagnostics, 'coverage', ownerId, 'ownerId', ownerId, 'Missing required corpus owner', 'Restore the owner in corpusEntries before publishing.');
    }
  }

  return {
    generatedBy,
    ownerCount: owners.length,
    owners,
    diagnostics,
  };
}

export function writeCoverageMatrix(options: WriteCoverageMatrixOptions = {}): string {
  const root = siteRoot();
  const outputDir = options.outputDir ?? 'dist';
  const safeOutputDir = assertInsideSite(outputDir, root);
  const outputPath = resolve(safeOutputDir, outputFileName);
  const payload = `${JSON.stringify(buildCoverageMatrix(options), null, 2)}\n`;

  mkdirSync(safeOutputDir, { recursive: true });
  writeFileSync(outputPath, payload, 'utf-8');

  return outputPath;
}

export function writeAllCoverageArtifacts(options: WriteCoverageMatrixOptions = {}): string[] {
  return [writeCoverageMatrix(options)];
}

function runCli(): number {
  try {
    const outputPaths = writeAllCoverageArtifacts();
    for (const outputPath of outputPaths) {
      console.error(`Successfully created: ${relative(siteRoot(), outputPath)}`);
    }
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
