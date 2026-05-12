# Governance Architecture Research R1: Historical & Philosophical Foundations

## Research Dimension

This document investigates the intellectual lineage behind governance architecture for AI coding harnesses, tracing the philosophical and historical threads that inform how we think about knowledge capture, decision externalization, and the limits of documentation in software engineering.

---

## 1. Peter Naur's "Programming as Theory Building" (1985)

### What Naur Actually Claims

Peter Naur's 1985 paper, originally published in *Microprocessing and Microprogramming* and later collected in *Computing: A Human Activity* (1992), argues that programming should be understood not as the production of program text but as an activity of theory building. The "theory" he refers to is not a formal theory in the mathematical or scientific sense; it is drawn directly from the philosopher Gilbert Ryle's concept of intellectual mastery.

Naur defines theory as "the knowledge a person must have in order not only to do certain things intelligently but also to explain them, to answer queries about them, to argue about them, and so forth." This definition, borrowed from Ryle's *The Concept of Mind* (1949), collapses the distinction between "knowing that" (propositional knowledge) and "knowing how" (practical competence). For Naur, a programmer's theory encompasses both: knowing the code and knowing why the code is that way, what alternatives were considered, and how modifications should be approached.

### The Three Aspects of Theory That Transcend Documentation

Naur identifies three capabilities that a programmer possessing the theory can exercise but that cannot be reduced to written form:

1. **Mapping to reality**: The programmer can "explain how the solution relates to the affairs of the world that it helps to handle." This is not merely a specification; it is an understanding of which aspects of reality matter and which do not, a judgment call that resists formalization.

2. **Design justification**: The programmer can explain and justify each part of the program. Naur states that "the justification is and must always remain the programmer's direct, intuitive knowledge or estimate." Documentation can record a decision but cannot fully convey the intuitive weighing that produced it.

3. **Modification intelligence**: The programmer can "respond constructively to demands for modifications or extensions." This depends on recognizing similarities between new demands and existing structures, and Naur (via Ryle) insists that "the similarities in question are not, and cannot be, expressed in terms of criteria, no more than the similarities of many other kinds of objects, such as human faces, tunes, or tastes of wine, can be thus expressed."

### Program Life and Death

Naur introduces a stark metaphor: programs are "alive" when the team possessing the theory remains active, and they "die" when that team dissolves. Critically, "the death of a program happens when the programmer team possessing its theory is dissolved." A dead program may still execute, but "the actual state of death becomes visible when demands for modification of the program cannot be intelligently answered." This is not metaphorical hand-waving; Naur backs it with two concrete cases.

In Case 1, a compiler developed by team A was later maintained by team B. Despite access to full documentation, team B produced modifications that "ichly" (in Naur's assessment) violated the original architecture's coherence, because they lacked the theory. In Case 2, experienced installation programmers possessed irreplaceable systems knowledge that no manual captured.

### What Naur Does NOT Claim

A common misinterpretation is that Naur argues documentation is useless. He does not. In the paper's appendix, Naur acknowledges that shared metaphors (like "assembly line" or "restaurant") effectively transmit design theories across teams, and that good documentation can help new programmers build theories by focusing on "metaphors, component purposes, and major interactions rather than exhaustive specification." His claim is narrower: documentation is necessary but categorically insufficient. The theory cannot be fully externalized into text, but documentation that foregrounds intent and design rationale (rather than mere specification) is the next best thing to direct mentorship.

Naur also rejects prescriptive methodologies, arguing "there can be no right method" for theory building, though methods have educational value by exposing programmers to proven techniques. This is a direct challenge to any governance system that assumes process compliance can substitute for understanding.

### Implications for AI Coding Harnesses

Naur's framework poses a fundamental question for AI agents: can an LLM possess a "theory" of a program? The ratfactor analysis (2024) argues compellingly that LLMs cannot, because they "ingest work outputs rather than building knowledge through actual practice." The artifact (code, documentation) is mistaken for the understanding. However, this analysis may itself be too binary; the question is whether a sufficiently rich context window, combined with structured decision records, can approximate enough of the theory to enable intelligent modification, even if full theory possession remains impossible.

**Key sources**: Naur, P. (1985). "Programming as Theory Building." *Microprocessing and Microprogramming*, 15(5), 253-261. Ryle, G. (1949). *The Concept of Mind*. Hutchinson.

---

## 2. Michael Polanyi's Tacit Knowledge

### The Core Claim

Michael Polanyi's *The Tacit Dimension* (1966) opens with the famous declaration: "we can know more than we can tell." This is not a casual observation but a carefully argued epistemological position. Polanyi contends that all explicit knowledge rests on a substrate of tacit knowledge that cannot be fully articulated.

### The Structure of Tacit Knowing

Polanyi describes tacit knowing as having a characteristic "from-to" structure involving two terms:

- **Proximal term**: The subsidiary particulars we attend *from* (the clues, the felt sense, the embodied patterns). We are aware of these but not focally; they function in the background.
- **Distal term**: The comprehensive entity or meaning we attend *to*. This is what we consciously perceive or understand.

The critical insight is that focusing explicitly on the proximal term destroys its function. If you try to articulate exactly how you recognize a face, you lose the ability to recognize it fluently. The act of making subsidiary awareness focal disrupts the integration that produces understanding. This is the formal mechanism behind Polanyi's claim: it is not merely that we have not yet articulated our tacit knowledge, but that the act of articulation structurally disrupts the knowing.

### Application to Software Development

Research estimates suggest that 70-80% of knowledge in a software organization is tacit, residing in experience-based intuitions about code quality, design sensibilities, debugging patterns, and architectural judgment. Only 20-30% takes explicit, documented form. This ratio is not an accident or a failure of documentation practice; if Polanyi is right, it reflects a fundamental asymmetry in the structure of knowledge itself.

For software development specifically, tacit knowledge manifests as:

- The ability to sense when a design "smells wrong" before being able to articulate the specific violation
- Intuitions about where bugs are likely to live in a codebase
- Judgment about when an abstraction is premature vs. overdue
- Understanding of which parts of a system are fragile and why

These map directly onto Naur's three aspects of theory. The connection is not coincidental; Naur explicitly builds on the same philosophical tradition that informed Polanyi, though he draws more directly from Ryle.

### Polanyi's Paradox and AI

Polanyi's Paradox presents a sharp challenge for AI systems: if human experts cannot articulate their knowledge, they cannot encode it into rules for machines to follow. Early AI (Good Old-Fashioned AI, or GOFAI) failed precisely at this boundary. Modern machine learning partially circumvents the paradox by learning patterns from data rather than requiring hand-coded rules, but this does not resolve the deeper issue for AI coding harnesses: the harness still needs to externalize decision rationale and architectural intent, which are precisely the kinds of knowledge Polanyi identifies as resistant to articulation.

**Key sources**: Polanyi, M. (1966). *The Tacit Dimension*. Doubleday. Polanyi, M. (1958). *Personal Knowledge*. University of Chicago Press.

---

## 3. The Dreyfus Skill Acquisition Model

### The Five Stages

Hubert and Stuart Dreyfus proposed their model of skill acquisition in *Mind Over Machine* (1986), identifying five stages through which a learner progresses:

1. **Novice**: Relies on context-free rules. Performance is slow, deliberate, and rigid. The novice follows instructions without understanding why.
2. **Advanced Beginner**: Begins to recognize situational elements ("aspects") that modify rule application. Still largely rule-bound but starting to connect rules to context.
3. **Competent**: Develops a sense of what matters in a situation. Makes deliberate plans and choices. Feels emotional investment in outcomes. This is where the practitioner first exercises genuine judgment.
4. **Proficient**: Uses intuition for situational assessment but still deliberates on action. Sees patterns holistically rather than analytically. Rules recede as perception sharpens.
5. **Expert**: Acts fluidly and intuitively without conscious deliberation. Performance is "unconscious, automatic, and no longer depends on explicit knowledge." The expert is a source of knowledge themselves; other practitioners look to them.

### The Externalization Paradox

The Dreyfus model reveals a cruel irony for knowledge management: the more expert a practitioner becomes, the less able they are to articulate their knowledge in rule-based form. Novices operate entirely on explicit rules and can describe their decision process step by step. Experts operate on pattern recognition and embodied intuition; asking them to explain their reasoning often produces post-hoc rationalizations rather than accurate accounts of their actual cognitive process.

This creates a structural problem for AI agents. An AI coding harness, no matter how sophisticated, operates at best at the "competent" level of the Dreyfus model: it can apply rules, follow established patterns, and exercise a form of deliberate judgment within its training distribution. What it lacks is the intuitive, context-sensitive, holistic perception that characterizes proficient and expert performance. More precisely, it lacks what the Dreyfus brothers call the ability to recognize "the feel of the situation" without decomposing it into features.

### Implications for Governance Architecture

If experts cannot externalize their knowledge into rules, and if AI agents operate primarily on externalized rules, then a governance architecture must contend with a permanent gap between what experts know and what the system can capture. This gap cannot be closed by better documentation or more comprehensive ADRs; it is structural. The best a governance system can do is:

1. Capture the *explicit* portion of expert knowledge (design rationale, decision context, rejected alternatives)
2. Create mechanisms for expert review of agent-produced work (compensating for the intuitive judgment the agent lacks)
3. Build feedback loops where expert corrections become new explicit knowledge, narrowing (but never closing) the gap

The Dreyfus brothers argued that "the problems of 'common-sense' or general 'know-how' are still very much relevant" for computing, and that genuine intelligence requires embodiment and social acculturation. This remains an open challenge.

**Key sources**: Dreyfus, H.L. & Dreyfus, S.E. (1986). *Mind Over Machine: The Power of Human Intuition and Expertise in the Era of the Computer*. Free Press. Dreyfus, H.L. (1972). *What Computers Can't Do*. Harper & Row.

---

## 4. History of Architecture Decision Records

### Origins: Before Nygard

The practice of recording architectural decisions did not begin with Michael Nygard. Philippe Kruchten and others had discussed "decision registers" and "decision logs" in the software architecture community through the late 1990s and 2000s. The concept of architecture as a set of key decisions (rather than a set of structures) was gaining traction in academic software engineering, drawing on pattern language traditions from Christopher Alexander.

### Nygard's 2011 Proposal

Michael Nygard published "Documenting Architecture Decisions" on November 15, 2011, at Cognitect. His contribution was not the idea of recording decisions but the specific lightweight format and the argument for keeping records close to code. His motivations were practical: new team members faced "two unsustainable choices when encountering undocumented decisions: either blindly accept them or blindly reverse them, both risking project damage." Additionally, "large documents are never kept up to date" and "nobody ever reads large documents, either."

Nygard proposed a template with five sections:

- **Title**: Short noun phrases (e.g., "ADR 1: Deployment on Ruby on Rails 3.0.10")
- **Context**: "This section describes the forces at play, including technological, political, social, and project local" forces, written in value-neutral language
- **Decision**: Active voice statements beginning with "We will..."
- **Status**: Proposed, accepted, deprecated, or superseded
- **Consequences**: All outcomes, positive, negative, and neutral

A crucial insight in Nygard's proposal was the recursive relationship: "The consequences of one ADR are very likely to become the context for subsequent ADRs," creating a decision graph rather than a flat list.

### Evolution and Adoption

The ThoughtWorks Technology Radar placed Lightweight Architecture Decision Records in the "Adopt" ring in November 2017, signaling broad industry endorsement. The format has since been extended by numerous practitioners: MADR (Markdown ADR), Y-statements, and various templates that add sections for options considered, stakeholders consulted, and evidence cited.

### The Architecture Advice Process (2022-2025)

Andrew Harmel-Law, writing at ThoughtWorks, introduced the Architecture Advice Process (AAP) as a governance layer atop ADRs. The AAP appeared on the ThoughtWorks Technology Radar in April 2025 at the "Trial" level. Its core rule is deceptively simple: "Anyone can make architectural decisions." But with qualifiers: before deciding, decision-makers must consult those meaningfully affected and those with relevant expertise.

Critically, this is not an approval process. Harmel-Law emphasizes: "while decision-takers are in no way obliged to agree with the advice... they must seek it out, and they must listen to and record it." The process demands "specifically seeking out those who will disagree."

The AAP is supported by four mechanisms:

1. **ADRs**: Capturing decisions, context, options, and all advice received
2. **Architecture Advisory Forum (AAF)**: A weekly advisory (not approval) gathering
3. **Team-sourced architectural principles**: SMART criteria guiding without prescribing
4. **Technology radar**: A crowd-sourced landscape of technology adoption status

Harmel-Law identifies the most dangerous failure mode as architects reverting to "shadow architecture," maintaining covert control despite nominal decentralization. The process produces, in his assessment, "better, faster, more accountable decisions, and most importantly decisions which are understood and owned by those who implement them."

### How ADRs Address Naur's Challenge

ADRs represent a deliberate (if partial) response to the theory-building problem Naur identified. They cannot capture the full theory, but they target the second of Naur's three aspects: design justification. By recording the context (forces at play), the decision itself, and the consequences, ADRs externalize the *rationale* behind architectural choices, which is precisely the knowledge most likely to be lost when team members depart.

However, ADRs have known limitations that map directly onto the philosophical objections:

- They capture the decision but not the intuitive weighing that produced it (Naur's point)
- They record explicit knowledge but not the tacit pattern recognition that identified the need for a decision (Polanyi's point)
- They are written by competent-to-expert practitioners but read by novice-to-competent ones, creating a comprehension gap (Dreyfus's point)

The Architecture Advice Process partially addresses these by ensuring decisions are discussed conversationally before being recorded, creating a social transmission channel (mentorship-like) alongside the documentary one. This echoes Naur's observation that theory transmits through "close contact" rather than through text alone.

**Key sources**: Nygard, M. (2011). "Documenting Architecture Decisions." Cognitect Blog. Harmel-Law, A. (2023). *Facilitating Software Architecture*. O'Reilly. ThoughtWorks Technology Radar, Vol. 32 (April 2025).

---

## 5. Philosophy of Externalization Limits

### Collins's Taxonomy of Tacit Knowledge

Harry Collins's *Tacit and Explicit Knowledge* (2010) advances substantially beyond Polanyi by taxonomizing tacit knowledge into three distinct types, each with different implications for externalization:

**Relational Tacit Knowledge (RTK)**: "Weak" tacit knowledge that "could be made explicit... but is not made explicit" due to social factors. People keep secrets, tell half-truths, fail to mention things they assume are obvious, or possess knowledge they do not realize others lack. RTK is tacit contingently, not necessarily. Better documentation practices, knowledge-sharing sessions, and structured elicitation can convert RTK to explicit form. This is the category where ADRs and governance tools operate most effectively.

**Somatic Tacit Knowledge (STK)**: "Medium" tacit knowledge that resides in embodied practice. Collins explains that "somehow, with practice and training, the ability to balance on the bike becomes established in our neural pathways and muscles in ways that we cannot speak about." STK resists articulation through conscious mechanisms. In software engineering, STK manifests as the physical fluency of an experienced developer navigating a codebase, the muscle-memory patterns of debugging, and the perceptual sensitivity to code structure that comes from years of reading and writing code. STK can, in principle, be partially captured through instrumentation (recording what experts actually do rather than what they say they do), but it cannot be transmitted through text.

**Collective Tacit Knowledge (CTK)**: "Strong" tacit knowledge that is "embodied in society" and concerns "how to manage trade-offs and repairs or apply the rules of gamesmanship in a human, social context-sensitive way." CTK is the most resistant to externalization because it requires deep enculturation to acquire and transfer. It manifests in the social practices of a development team: how they handle disagreements, what counts as "good enough," when to break rules, how to navigate organizational politics in architectural decisions.

Collins introduces a parallel distinction between **mimeomorphic actions** (actions "always executed with the same behaviours," suitable for machine replication) and **polymorphic actions** (actions "that can only be executed successfully by a person who understands the social context," requiring different behaviors on different occasions). Software architecture decisions are paradigmatically polymorphic: the "right" answer depends on social, organizational, and temporal context that cannot be reduced to rules.

### Nonaka's SECI Model and Its Limits

Ikujiro Nonaka and Hirotaka Takeuchi proposed the SECI model (1995) as a framework for organizational knowledge creation through four conversion processes:

- **Socialization** (tacit to tacit): Sharing experience through co-practice
- **Externalization** (tacit to explicit): Articulating tacit knowledge into concepts, metaphors, or models
- **Combination** (explicit to explicit): Synthesizing explicit knowledge from multiple sources
- **Internalization** (explicit to tacit): Learning by doing, converting documentation into personal competence

The SECI model is the most optimistic framework in this survey regarding externalization. It assumes that tacit knowledge *can* be converted to explicit form through externalization, and that this conversion is a primary engine of organizational knowledge creation.

### Tsoukas's Critique: The Great Misunderstanding

Haridimos Tsoukas's influential 2003 paper "Do We Really Understand Tacit Knowledge?" mounts a devastating critique of Nonaka's externalization assumption. Tsoukas argues that Nonaka and Takeuchi misread Polanyi by treating tacit knowledge as "knowledge-not-yet-articulated," as though it were simply explicit knowledge waiting to be written down. In Nonaka's framing, tacit knowledge can ultimately be "crystallized in a set of propositional 'if-then' statements" given enough effort.

Tsoukas demonstrates that this contradicts Polanyi's actual position. For Polanyi, tacit and explicit knowledge are not two separate pools that can be converted back and forth; they are two dimensions of all knowing. Tacit knowledge is the necessary substrate on which explicit knowledge rests. You cannot strip it away and replace it with more explicit knowledge any more than you can replace the foundation of a building with another floor.

Tsoukas's critique has been called "the Great Misunderstanding" in knowledge management literature: the widespread adoption of Nonaka's framework led an entire field to treat tacit knowledge as a problem to be solved through better externalization techniques, when the philosophical foundations suggest it is a permanent condition of all knowing.

### Gourlay's Empirical Challenge

Stephen Gourlay (2006) added an empirical dimension to the critique, arguing that "the empirical basis of the SECI Model is highly unsatisfactory" and that "the knowledge conversion modes are not coherent." He questioned whether all four conversion processes are genuinely distinct and whether the model's anecdotal evidence (drawn primarily from Japanese companies in the 1980s) generalizes across cultures and domains.

### Formal Limits on Externalization

Synthesizing across these sources, the formal limits on converting tacit to explicit knowledge can be stated with some precision:

1. **Relational tacit knowledge** (Collins's RTK) can be externalized with effort. This is the domain where better tools, processes, and governance structures (including ADRs) yield genuine returns. The limit is practical, not theoretical.

2. **Somatic tacit knowledge** (Collins's STK) can be partially captured through observation and instrumentation but cannot be transmitted through text. The limit is neurological: the knowledge is encoded in neural pathways and muscle memory that resist propositional description.

3. **Collective tacit knowledge** (Collins's CTK) cannot be externalized by any known means. It can only be acquired through enculturation, through participation in the social practices of a community. The limit is sociological: the knowledge is a property of the community, not of any individual or document.

4. **The Polanyi constraint**: Even within the domain of explicit knowledge, all understanding depends on a tacit substrate (the "from-to" structure). Fully explicit knowledge is an impossibility; every articulation presupposes unarticulated background knowledge.

5. **The Dreyfus constraint**: Expert knowledge is specifically less amenable to externalization than novice knowledge, because expertise involves a shift from rule-following to pattern recognition that resists decomposition into rules.

These constraints define the theoretical ceiling for any governance architecture. A system that captures decision rationale (ADRs), facilitates social knowledge transmission (advice processes, pair programming), and compensates for tacit knowledge gaps through expert review is operating near the known limits of what externalization can achieve.

**Key sources**: Collins, H. (2010). *Tacit and Explicit Knowledge*. University of Chicago Press. Nonaka, I. & Takeuchi, H. (1995). *The Knowledge-Creating Company*. Oxford University Press. Tsoukas, H. (2003). "Do We Really Understand Tacit Knowledge?" In *The Blackwell Handbook of Organizational Learning and Knowledge Management*. Gourlay, S. (2006). "Conceptualizing Knowledge Creation: A Critique of Nonaka's Theory." *Journal of Management Studies*, 43(7).

---

## 6. Synthesis: What This Means for Governance Architecture

### The Convergent Conclusion

All five intellectual traditions converge on a single uncomfortable conclusion: **the knowledge most critical to software architecture is the knowledge most resistant to externalization.** Naur demonstrates this for programming specifically. Polanyi establishes the philosophical basis. The Dreyfus model shows the skill-level dependency. Collins taxonomizes the types. Tsoukas demolishes the optimistic assumption that better techniques will eventually close the gap.

### What a Governance Architecture Can and Cannot Do

Given these constraints, a governance architecture for an AI coding harness should be designed with clear-eyed awareness of what lies within and beyond the externalization boundary:

**Within reach (RTK domain)**:
- Recording architectural decisions with context and rationale (ADRs)
- Documenting rejected alternatives and the reasons for rejection
- Capturing advice received and from whom (Architecture Advice Process)
- Maintaining technology adoption status (radar)
- Tracking decision dependencies and supersession chains

**Partially reachable (STK domain)**:
- Encoding expert review patterns as checklists or heuristics (lossy but useful)
- Recording examples of good and bad modifications (case-based reasoning)
- Instrumenting expert behavior to capture patterns they cannot articulate

**Beyond reach (CTK domain)**:
- Team norms around "good enough" quality
- Organizational context for when to break rules
- The social meaning of architectural choices within a specific team's history
- The judgment calls that depend on understanding interpersonal dynamics

### The Design Implication

The appropriate response is not to abandon externalization but to design a layered system: explicit governance (ADRs, principles, fitness functions) for the knowledge that can be captured; social governance (advice processes, review forums, pairing) for the knowledge that can only be transmitted through practice; and expert oversight (human review gates) for the knowledge that cannot be externalized at all.

An AI coding harness that operates without this layered awareness risks what Naur would call "acting on the assumption that programming consists of program text production," the precise misunderstanding his 1985 paper set out to correct.

---

## Sources

- [Naur, P. (1985). "Programming as Theory Building" (PDF)](https://pages.cs.wisc.edu/~remzi/Naur.pdf)
- [Naur's paper, full text (GitHub Gist)](https://gist.github.com/onlurking/fc5c81d18cfce9ff81bc968a7f342fb1)
- [Paper Review: Programming as Theory Building (emptysqua.re)](https://emptysqua.re/blog/programming-as-theory-building/)
- [Summary of "Programming as Theory Building" (Invent with Python)](https://inventwithpython.com/drafts/naur-programming-as-theory-building.html)
- [Naur vs. LLMs Analysis (ratfactor)](https://ratfactor.com/cards/naur-vs-llms)
- [Nygard, M. (2011). "Documenting Architecture Decisions" (Cognitect)](https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [ThoughtWorks Technology Radar: Lightweight ADRs](https://www.thoughtworks.com/radar/techniques/lightweight-architecture-decision-records)
- [Harmel-Law, A. "Scaling Architecture Conversationally" (martinfowler.com)](https://martinfowler.com/articles/scaling-architecture-conversationally.html)
- [ThoughtWorks: Architecture Advice Process](https://www.thoughtworks.com/en-us/insights/blog/architecture/software-architecture-decisions-andrew-harmel-law)
- [ADR GitHub Organization](https://adr.github.io/)
- [Polanyi's Paradox and AI (billparker.ai)](https://www.billparker.ai/2025/05/polanyis-paradox-why-we-know-more-than.html)
- [Collins's Tacit Knowledge Taxonomy Review (Composition Forum)](https://compositionforum.com/issue/49/amidon-collins-review.php)
- [Collins's Taxonomy: Critical Analysis (Philosophia Scientiae)](https://journals.openedition.org/philosophiascientiae/892?lang=en)
- [Collins, H. Key Concepts (Cardiff University)](https://sites.cardiff.ac.uk/harrycollins/key-concepts/)
- [Tsoukas, H. (2003). "Do We Really Understand Tacit Knowledge?" (PDF)](https://mba.eci.ufmg.br/downloads/dowereally.pdf)
- [Nonaka SECI Model Operationalization (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6914727/)
- [SECI Model, Wikipedia](https://en.wikipedia.org/wiki/SECI_model_of_knowledge_dimensions)
- [Gourlay, S. "SECI Model: Some Empirical Shortcomings" (PDF)](https://files01.core.ac.uk/download/pdf/90222.pdf)
- [Dreyfus Model of Skill Acquisition, Wikipedia](https://en.wikipedia.org/wiki/Dreyfus_model_of_skill_acquisition)
- [Dreyfus, H.L. & Dreyfus, S.E. (1986). *Mind Over Machine* (Internet Archive)](https://archive.org/details/mindovermachinep00drey)
