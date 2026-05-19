import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

function readFixture(path: string): string {
  return readFileSync(fileURLToPath(new URL(path, import.meta.url)), 'utf8');
}

const definitionSource = readFixture('./DefinitionBlock.astro');
const theoremSource = readFixture('./TheoremBlock.astro');
const derivationSource = readFixture('./DerivationWalkthrough.astro');
const citationSource = readFixture('./CitationRef.astro');
const sourceTrailSource = readFixture('./SourceTrail.astro');
const formalObjectListSource = readFixture('./FormalObjectList.astro');
const conceptCardSource = readFixture('./ConceptCard.astro');
const fixtureSource = readFixture('../../content/docs/formal-reading-fixture.mdx');

describe('formal reading component contract', () => {
  it('fixture imports and renders every formal component', () => {
    expect(fixtureSource).toContain("import DefinitionBlock from '../../components/formal/DefinitionBlock.astro'");
    expect(fixtureSource).toContain("import TheoremBlock from '../../components/formal/TheoremBlock.astro'");
    expect(fixtureSource).toContain("import DerivationWalkthrough from '../../components/formal/DerivationWalkthrough.astro'");
    expect(fixtureSource).toContain("import CitationRef from '../../components/formal/CitationRef.astro'");
    expect(fixtureSource).toContain("import SourceTrail from '../../components/formal/SourceTrail.astro'");
    expect(fixtureSource).toContain('<DefinitionBlock');
    expect(fixtureSource).toContain('<TheoremBlock');
    expect(fixtureSource).toContain('<DerivationWalkthrough');
    expect(fixtureSource).toContain('<CitationRef');
    expect(fixtureSource).toContain('<SourceTrail');
  });

  it('components expose labels, anchors, owner metadata, canonical source links, and visible source trails', () => {
    expect(definitionSource).toContain('<article id={id}');
    expect(definitionSource).toContain('Definition');
    expect(definitionSource).toContain('Stable ID');
    expect(definitionSource).toContain('Owner');
    expect(definitionSource).toContain('Canonical .tex source');
    expect(definitionSource).toContain('<slot name="source-trail"');

    expect(theoremSource).toContain('<article id={id}');
    expect(theoremSource).toContain('kind: TheoremKind');
    expect(theoremSource).toContain('Definition');
    expect(theoremSource).toContain('Assumption');
    expect(theoremSource).toContain('Theorem');
    expect(theoremSource).toContain('Proposition');
    expect(theoremSource).toContain('Lemma');
    expect(theoremSource).toContain('Corollary');
    expect(theoremSource).toContain('Claim');
    expect(theoremSource).toContain('Stable ID');
    expect(theoremSource).toContain('Owner');
    expect(theoremSource).toContain('Source tier');
    expect(theoremSource).toContain('Canonical .tex source');
    expect(theoremSource).toContain('<slot name="source-trail"');

    expect(derivationSource).toContain('<section id={id}');
    expect(derivationSource).toContain('Derivation walkthrough');
    expect(derivationSource).toContain('formal-derivation__cell--prose');
    expect(derivationSource).toContain('formal-derivation__cell--math');
    expect(derivationSource).toContain('formal-derivation__cell--code');
  });

  it('formal registry and concept components expose typed registry metadata', () => {
    expect(formalObjectListSource).toContain("import type { FormalObject");
    expect(formalObjectListSource).toContain('Stable ID');
    expect(formalObjectListSource).toContain('Source tier');
    expect(formalObjectListSource).toContain('Source status');
    expect(formalObjectListSource).toContain('Anchor link');
    expect(formalObjectListSource).toContain('#${object.id}');
    expect(formalObjectListSource).toContain('Canonical');
    expect(formalObjectListSource).toContain('Supporting research');
    expect(formalObjectListSource).toContain('Synthesis/review');
    expect(formalObjectListSource).toContain('Archived provenance');

    expect(conceptCardSource).toContain("import type { ConceptRecord");
    expect(conceptCardSource).toContain('Aliases');
    expect(conceptCardSource).toContain('Notation');
    expect(conceptCardSource).toContain('Owning pillars');
    expect(conceptCardSource).toContain('Related formal objects');
    expect(conceptCardSource).toContain('Related concepts');
    expect(conceptCardSource).toContain('Source tiers');
  });

  it('source trail supports exactly the required material-kind labels and visible rows', () => {
    expect(sourceTrailSource).not.toContain('<details');
    expect(sourceTrailSource).not.toContain('<summary');
    expect(sourceTrailSource).toContain("'canonical' | 'supporting' | 'synthesis/review' | 'archived/provenance'");
    expect(sourceTrailSource).toContain('Material kind');
    expect(sourceTrailSource).toContain('Canonical .tex source');
    expect(sourceTrailSource).toContain('Canonical PDF');
    expect(sourceTrailSource).toContain('Bibliography source');
    expect(sourceTrailSource).toContain('Source status');
    expect(fixtureSource).toContain('materialKind="canonical"');
    expect(fixtureSource).toContain('materialKind="supporting"');
    expect(fixtureSource).toContain('materialKind="synthesis/review"');
    expect(fixtureSource).toContain('materialKind="archived/provenance"');
  });

  it('fixture includes math, citation, footnote, and bibliography treatments', () => {
    expect(citationSource).toContain('Citation');
    expect(citationSource).toContain('citationKey');
    expect(fixtureSource).toContain('Footnote');
    expect(fixtureSource).toContain('Bibliography entry');
    expect(fixtureSource).toContain('\\begin{aligned}');
    expect(fixtureSource).toContain('science/paper/science.tex');
    expect(fixtureSource).toContain('pillars/temporal/paper/temporal_architecture.tex');
  });

  it('routes formal provenance links to browsable repository sources', () => {
    expect(sourceTrailSource).toContain('https://github.com/ThePyProgrammer/harness_eng_research/blob/main/');
    expect(fixtureSource).toContain('https://github.com/ThePyProgrammer/harness_eng_research/blob/main/science/paper/science.tex');
    expect(fixtureSource).not.toContain('sourceHref="/science/');
    expect(fixtureSource).not.toContain('sourceHref="/pillars/');
  });

  it('keeps the fixture out of public search indexing', () => {
    expect(fixtureSource).toContain('pagefind: false');
    expect(fixtureSource).toContain('robots: noindex');
  });
});
