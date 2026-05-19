import { corpusEntries } from './corpus';
import { parseChapterRegistry, type ChapterRecord } from './formal-registry.schema';

function canonicalSources(ownerId: string) {
  const entry = corpusEntries.find((item) => item.id === ownerId);
  if (!entry) {
    throw new Error(`Missing corpus entry for ${ownerId}`);
  }

  return [
    { id: `${ownerId}-tex`, tier: 'canonical' as const, path: entry.canonicalTex, label: `${entry.title} LaTeX source` },
    { id: `${ownerId}-pdf`, tier: 'canonical' as const, path: entry.canonicalPdf, label: `${entry.title} PDF` },
    ...(entry.bibliography
      ? [{ id: `${ownerId}-bib`, tier: 'canonical' as const, path: entry.bibliography, label: `${entry.title} bibliography` }]
      : []),
  ];
}

const sectionKeys = {
  problem: 'Problem',
  coreModel: 'Core model',
  keyNotation: 'Key notation',
  definitions: 'Definitions',
  formalClaims: 'Formal claims',
  derivationContext: 'Derivation context',
  interpretation: 'Interpretation',
  relatedPillars: 'Related pillars',
  citations: 'Citations',
  sourceTrail: 'Source trail',
} as const;

function minimalSections(title: string, summary: string) {
  return Object.fromEntries(
    Object.entries(sectionKeys).map(([key, label]) => [
      key,
      `${label}: minimal build-safe ${title} chapter seed grounded in the canonical paper. ${summary}. This record is intentionally incomplete until later Phase 3 enrichment plans replace the provisional prose.`,
    ]),
  ) as ChapterRecord['sections'];
}

const minimalChapters: ChapterRecord[] = corpusEntries
  .filter((entry) => entry.kind === 'pillar')
  .map((entry) => ({
    ownerId: entry.id,
    slug: entry.slug,
    title: entry.title,
    curationStatus: 'minimal',
    summary: `${entry.summary}. Minimal validated seed for static route expansion.`,
    sections: minimalSections(entry.title, entry.summary),
    formalObjectIds: [`${entry.id}.chapter-seed`],
    conceptIds: [`${entry.id}-framework`],
    citationIds: [`${entry.id}-paper`],
    sourceTrail: canonicalSources(entry.id),
  }));

export const chapterRegistry = parseChapterRegistry([
  {
    ownerId: 'umbrella',
    slug: 'umbrella',
    title: 'Harness Architecture Framework',
    curationStatus: 'curated',
    summary: 'Opening formal chapter that frames AI coding agent harness architecture as a source-grounded system of semantic, execution, assurance, operational, and security axes.',
    sections: {
      problem: 'AI coding agents now perform multi-step software engineering work, but the surrounding harness decisions for context, verification, coordination, governance, economics, routing, human supervision, and security remain too ad hoc for research-grade reasoning.',
      coreModel: 'The umbrella model treats the harness as the mediating architecture between human intent and agent execution, decomposed into semantic, execution, assurance, operational, and security axes that connect all pillar papers.',
      keyNotation: 'Key notation includes the abstraction gap \\mathcal{G}(S,P), compound pipeline reliability R=p^n, verified iteration metrics, and the governance capacity condition R_{\\text{drift}} < C_{\\text{gov}}.',
      definitions: 'Harness architecture is defined as the structured environment that supplies source context, constrains actions, verifies outputs, coordinates work, and preserves architectural information for AI coding agents.',
      formalClaims: 'The umbrella slice records the harness-architecture definition and the compound-error theorem seed, including the p^n sensitivity claim used to connect umbrella exposition to reliability.',
      derivationContext: 'The opening chapter points to the canonical paper for derivations of the abstraction gap, compound reliability, structural enforcement dominance, and governance capacity bounds; later plans expand those derivations into notebook-style walkthroughs.',
      interpretation: 'The useful reading is not that the pillars are exhaustive, but that the decomposition is productive: it gives researchers stable terms, IDs, and source trails for comparing harness design choices.',
      relatedPillars: 'The chapter links to all twelve pillar owners and normalizes cross-corpus concepts so later graph and search work can consume stable object and concept IDs.',
      citations: 'The primary citation trail is science/paper/science.tex, science/paper/science.pdf, and science/paper/science.bib, with the umbrella bibliography carrying the external evidence base.',
      sourceTrail: 'Canonical source trail: science/paper/science.tex for source, science/paper/science.pdf for the paper artifact, and science/paper/science.bib for citations.',
    },
    formalObjectIds: ['umbrella.harness-architecture', 'reliability.compound-error-bound'],
    conceptIds: ['harness-architecture', 'semantic-axis', 'execution-axis', 'assurance-axis'],
    citationIds: ['science-paper'],
    sourceTrail: canonicalSources('umbrella'),
  },
  ...minimalChapters,
]);
