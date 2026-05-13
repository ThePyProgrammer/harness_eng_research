# Research Report R4: Organizational & Contrarian Perspectives on Architectural Governance

**Date:** 2026-04-03
**Dimension:** Organizational dynamics, Conway's Law, and contrarian critiques of governance

---

## 1. Conway's Law: Empirical Evidence

### 1.1 The Original Claim

Melvin Conway published "How Do Committees Invent?" in *Datamation* magazine in April 1968. Notably, the Harvard Business Review rejected the paper in 1967 "on the grounds that he had not proved his thesis." The paper's central claim, placed in its third-to-last paragraph, states:

> "Any organization that designs a system (defined more broadly here than just information systems) will inevitably produce a design whose structure is a copy of the organization's communication structure."

Conway's argument is not merely observational. He demonstrates a **homomorphic relationship** between organizational structure and system design: every subsystem in a designed system corresponds to a design group, and communication paths between subsystems reflect negotiated agreements between design groups. When subsystems lack interconnection, their corresponding design groups never coordinated. Conway also critiques the assumption that "two men working for a year or one hundred men working for a week are resources of equal value," arguing that different organizational structures cannot design comparable systems, making dollar-based resource measurement inadequate.

**Source:** [Conway's original paper](https://www.melconway.com/Home/Committees_Paper.html)

### 1.2 The Mirroring Hypothesis

In 2008, Alan MacCormack, John Rusnak, and Carliss Baldwin of Harvard Business School published "Exploring the Duality between Product and Organizational Architectures: A Test of the Mirroring Hypothesis." The study compared open-source and closed-source software systems and found that **loosely organized communities tend to produce more modular, loosely coupled systems** than tightly organized companies. Teams working in silos produced monolithic systems; loosely coupled open teams produced modular, interoperable elements.

The researchers concluded that "a product's architecture tends to mirror the structure of the organization in which it is developed." This provided the first rigorous statistical validation of Conway's Law across multiple domains including word processing and financial management.

**Source:** [Allan Kelly on empirical Conway's Law research](https://www.allankelly.net/archives/927/empirical-research-supports-conway-law/)

### 1.3 The Microsoft Study (Nagappan et al., 2008)

Nachi Nagappan, Brendan Murphy, and Victor Basili conducted a landmark empirical study at Microsoft Research. Brooks had asserted in *The Mythical Man-Month* that product quality is strongly affected by organization structure, but there had been little empirical evidence to substantiate this. The study developed organizational complexity metrics and applied them to Windows Vista.

Key findings:
- **Organizational metrics predicted failure-proneness with approximately 85% precision and recall**
- These organizational metrics outperformed traditional code-based metrics including: code churn, cyclomatic complexity, test coverage, dependencies, and pre-release bug counts
- The results provide "empirical evidence that the organizational metrics are related to, and are effective predictors of failure-proneness"

This is a striking result: **how teams are structured predicts bugs better than how the code looks**. The implication for architectural governance is profound: if architecture mirrors org structure, and org structure predicts defects better than code metrics, then architectural governance without organizational governance may be treating a symptom rather than a cause.

**Source:** [Microsoft Research publication](https://www.microsoft.com/en-us/research/publication/the-influence-of-organizational-structure-on-software-quality-an-empirical-case-study/)

### 1.4 Implications for Architectural Governance

Martin Fowler summarizes the consensus: Conway's Law is "powerful enough that you're doomed to defeat if you try to fight it." As colleague Chris Ford puts it: "Conway understood that software coupling is enabled and encouraged by human communication." Fowler identifies three possible responses:

1. **Ignore** the law entirely (fails)
2. **Accept** it and align architecture with actual communication patterns
3. **Inverse Conway Maneuver**: deliberately restructure teams to produce desired architecture

If the Nagappan study is correct that organizational structure predicts software quality better than code metrics, then any governance system that focuses solely on code-level constraints (fitness functions, ADR compliance audits) while ignoring organizational structure is operating on the less predictive variable.

**Source:** [Martin Fowler on Conway's Law](https://martinfowler.com/bliki/ConwaysLaw.html)

---

## 2. Inverse Conway Maneuver and Team Topologies

### 2.1 Team Topologies

Matthew Skelton and Manuel Pais published *Team Topologies* in 2019, which is essentially a book-length treatment of the inverse Conway maneuver. The term itself was coined by Jonny LeRoy and Matt Simons in a 2010 Cutter IT journal article. The core idea: if organizations inevitably produce systems that mirror their communication structures, then **design the communication structure to produce the architecture you want**.

Team Topologies focuses on sociotechnical dynamics, treating "people and technology as a single human/computer carbon/silicon sociotechnical ecosystem." The practical goal is that architecture should "support teams getting their work done, from design through to deployment, without requiring high-bandwidth communication between teams."

**Source:** [Team Topologies summary](https://www.runn.io/blog/team-topologies-summary)

### 2.2 AI Agents and Conway's Law

A genuinely novel question emerges when considering AI agents through the lens of Conway's Law. Recent analysis argues that "agentic systems will mirror the communication structures, incentive structures, and power structures of the organizations that build and operate them." When separate functional departments build agents independently (marketing, sales, support, finance), each agent optimizes for local metrics rather than comprehensive organizational goals.

The implications are concrete:
- **APIs and schemas between agents are shaped by how teams align on data contracts.** If two human teams rarely coordinate, their corresponding agents struggle with misaligned ontologies and brittle integrations.
- **Approval UIs and human-in-the-loop checkpoints reflect organizational trust relationships and power dynamics**, not technical requirements.
- Communication pathways between agents "directly shape the software they create," making the pipeline connecting agents as architecturally significant as the agents themselves.

One author argues that governance for AI agents must be "explicit, deterministic, and enforceable; not guidelines but policy, not culture but code." This is because AI agents are "more capable than most employees but need more governance, not less." The strategic response is an inverse Conway maneuver for agents: design the agent ecosystem first, then align teams around it.

**Sources:** [Conway's Law and agentic systems](https://reynders.co/blog/how-organizations-shape-their-agentic-systems/), [Architecting agentic AI teams](https://medium.com/@josef-dijon/from-code-to-conway-architecting-the-future-with-agentic-ai-teams-3b4b1ebedc05)

### 2.3 The Joint Optimization Problem

Sociotechnical architecture recognizes that team structure and system architecture are a joint optimization problem. You cannot optimize one independently of the other. This creates a challenge for automated governance systems: a fitness function can detect architectural drift in code, but it cannot detect the organizational drift that caused it. If two teams that should be decoupled start sharing a Slack channel and having joint standups, Conway's Law predicts their services will become coupled, and no amount of code-level governance will prevent it.

---

## 3. Contrarian: Governance as Overhead

### 3.1 The Steelmanned Argument

The strongest version of the "governance as overhead" argument is not that governance is never useful, but that **governance has a cost curve that intersects with its benefit curve at a specific scale, and below that scale the cost exceeds the benefit.** Every governance mechanism (ADR writing, fitness function maintenance, compliance auditing, review processes) requires developer time. For a two-person startup with a six-month runway, time spent writing ADRs is time not spent shipping features. The architecture will be simple enough that both developers hold the complete mental model.

Research on open source projects found that "less formal governance is hypothesized to increase development effort due to more cumbersome coordination overhead," but this applies primarily to larger, distributed teams. For small co-located teams, informal governance (conversation, pair programming, shared context) may actually be more efficient than formal mechanisms.

### 3.2 Empirical Evidence

A study published in *Empirical Software Engineering* on large-scale agile found that organizations must "find a balance between the amount of authority the team has on the development process and the imperative to conform to the same agile approach." The study identified that bureaucratic protocols and procedures "can have direct negative impact on Agile development approaches, resulting in missed development schedules and project delays."

Practitioners suggest starting with "Minimum Viable Governance" focusing on high-impact areas like version control and peer reviews, then evolving as the organization grows. The key insight: governance frameworks should "provide structure without imposing rigid, one-size-fits-all processes, adapt to different teams, technologies, and risk profiles while maintaining consistency at scale."

The difficulty in evaluating governance ROI empirically is noted: "It is extremely difficult to precisely evaluate the benefit of architecture projects, and companies often resort to anecdotal arguments of risk reduction or increased developer productivity, which are unsatisfying to management accustomed to decision-making based on concrete metrics."

**Sources:** [Finding the sweet spot](https://link.springer.com/article/10.1007/s10664-021-09967-3), [Software development governance](https://www.n-ix.com/software-development-governance/)

### 3.3 What the Evidence Actually Shows

The evidence does not support a blanket claim that governance is overhead. Rather, it shows:
- Governance cost is roughly fixed per mechanism; benefit scales with team size and codebase complexity
- The crossover point appears to be somewhere around 5 to 10 developers and a codebase large enough that no single person holds the complete mental model
- For distributed teams, even small ones, formal governance mechanisms become valuable earlier because informal channels (hallway conversations, pair programming) are degraded or absent
- The cost of *absent* governance is typically invisible until a costly incident reveals it (the "absence of evidence is not evidence of absence" problem)

---

## 4. Contrarian: ADRs as Documentation Theater

### 4.1 The Steelmanned Argument

The strongest version of this critique has multiple components:

**ADRs drift from purpose.** As InfoQ reports, "lacking a clear definition of what is architectural, and also lacking anywhere else to record important decisions, ADRs can start to drift from their original purpose and lose focus and effectiveness." When bloated with every decision a team makes, "architectural decisions can't be easily seen amidst everything else that's been thrown into an ADR."

**ADRs as responsibility diffusion.** Some teams "believe that by putting a decision in an ADR they can absolve themselves from the consequences of that decision should it prove wrong." The more people who approve an ADR, the more responsibility for a poor decision is diluted.

**The staleness problem.** Traditional design documentation "begins to fail as decisions outpace updating of the document, and once someone forgets to update it, it is viewed as obsolete and never updated again." Even structured ADR processes face this: "Writing ADRs is an extra step nobody has time for, changes often get shipped without updating docs, and even when ADRs are written, they're stored somewhere out-of-sync with the repository."

### 4.2 Evidence from Practice

Spotify's experience provides one of the few detailed practitioner accounts. The Creator Team uses ADRs and reports concrete benefits: new team members rapidly understand decision rationale, and cross-office alignment improved (Stockholm teams adopted a "React Hooks" ADR written by New York engineers, "removing duplicative efforts, making code reusable across projects"). However, Spotify also acknowledges the trigger problem: "An ADR should be written whenever a decision of significant impact is made; it is up to each team to align on what defines a significant impact." This definitional ambiguity is where the documentation theater problem begins.

The ADR adoption model proposed by Olaf Zimmermann identifies five maturity levels but "lacks quantitative data or empirical studies demonstrating ADR effectiveness." It provides "observational findings from clients from different business sectors" rather than statistical validation. This is telling: despite ADRs being recommended by ThoughtWorks (Trial status on the Technology Radar), AWS, Microsoft, and Google, **there are essentially no published empirical studies measuring whether ADRs actually improve software quality outcomes**.

**Sources:** [Spotify ADR experience](https://engineering.atspotify.com/2020/04/when-should-i-write-an-architecture-decision-record), [ADR adoption model](https://ozimmer.ch/practices/2023/04/21/ADAdoptionModel.html)

### 4.3 The Append-Only Mitigation

ADR proponents address staleness through an append-only model: "Once an ADR is accepted, it should never be reopened or changed; instead it should be superseded." This is elegant but creates a different problem: a growing chain of supersession that must be followed to understand current state. Without active curation (which itself requires governance overhead), the ADR log becomes an archaeological record rather than a living reference.

### 4.4 What the Evidence Actually Shows

The evidence shows that:
- ADRs provide clear value for onboarding and cross-team alignment (Spotify, multiple practitioner reports)
- No published empirical study demonstrates that ADRs improve measurable software quality outcomes (defect rates, time-to-market, maintenance cost)
- The primary failure mode is not "wrong content" but "absent content" (decisions made without writing ADRs) or "bloated content" (too many decisions documented, obscuring the important ones)
- Continuous governance (automated compliance checking) addresses the staleness problem but introduces its own costs

---

## 5. Contrarian: The Ratchet Is Too Rigid

### 5.1 The Steelmanned Argument

A governance system that monotonically increases strictness (adding rules, never removing them) creates a ratchet effect. Every architectural incident leads to a new rule; no mechanism removes rules when the context that motivated them changes. Over time, the accumulation of constraints prevents legitimate architectural evolution. The system becomes so constrained that the only way to evolve is to start a new project with no governance history (the "greenfield escape" pattern).

This argument has theoretical support from platform economics research, where "initial governance arrangements and the platform owner's subsequent ability to capture value are shaped by the rigidity of these arrangements." Rigid governance arrangements that cannot be relaxed as conditions change reduce long-term adaptability.

### 5.2 Mechanisms for Relaxation

The *Building Evolutionary Architectures* framework (Ford, Parsons, Kua, Sadalage) addresses this through fitness function lifecycle management. Fitness functions can be deprecated: "To deprecate a fitness function, delete all traces of said function from the documentation, code, processes, etc." The key is ensuring "the requirement is no longer there or the requirement has been satisfied by other means."

Evolutionary architecture principles provide additional mechanisms:
- **Keep options open** and prefer choices that are cheap to change until stronger evidence appears
- **Inspect and adapt** by revisiting decisions regularly as the product, customer behavior, technology, and system constraints evolve
- **Intentional architecture** combined with **emergent design**: "Decisions that come from intentional architecture may change. New ones are added and past decisions can be reversed."

### 5.3 What the Evidence Actually Shows

The tension between stability and adaptability is real, but the strongest governance systems already incorporate relaxation mechanisms. The problem is not inherent to governance; it is inherent to governance systems that lack explicit deprecation and revisitation protocols. TOGAF's architecture governance framework itself acknowledges that governance "is less about overt control and strict adherence to rules, and more about guidance and effective and equitable usage of resources." The ratchet critique applies most forcefully to governance systems that treat rules as permanent rather than contextual.

---

## 6. Contrarian: Naur Is Right and the Problem Is Unsolvable

### 6.1 The Steelmanned Argument

Peter Naur's 1985 paper "Programming as Theory Building" makes a radical claim: the essential knowledge of a program is the *theory* held in programmers' minds, and this theory cannot be fully externalized. Naur defines theory as "the knowledge a person must have in order not only to do certain things intelligently but also to explain them, to answer queries about them, to argue about them, and so forth."

Naur identifies three categories of knowledge that resist documentation:

1. **Real-world mapping**: how reality connects to code and which aspects matter
2. **Design justification**: "The justification is and must always remain the programmer's direct, intuitive knowledge or estimate"
3. **Modification expertise**: recognizing similarities between new and existing situations, which "are not, and cannot be, expressed in terms of criteria" (similar to distinguishing faces or wine tastes)

The devastating conclusion: "The death of a program happens when the programmer team possessing its theory is dissolved... reestablishing the theory of a program merely from documentation is strictly impossible."

### 6.2 The False Confidence Problem

If Naur is correct, then THEORY.md (or any automated theory extraction) is a lossy compression of knowledge that cannot be losslessly compressed. The map-territory problem applies: the documentation is a map, not the territory. As one commentator puts it, "Documentation is a finger, not the moon; it can orient, never replace. The more we confuse the finger with the moon, the more we sink into a paradox: we preserve the texts and lose the program."

The false confidence argument: a team that has a THEORY.md may believe it understands the system's theory when it actually possesses only a compressed, lossy representation. This could be **worse** than having no documentation, because:
- No documentation produces appropriate humility ("we don't know why this is here")
- Lossy documentation produces false confidence ("THEORY.md says it's for X, so we'll change it accordingly") that leads to changes based on incomplete understanding
- Naur explicitly states: "For a new programmer to come to possess an existing theory of a program it is insufficient that he or she has the opportunity to become familiar with the program text and other documentation. What is required is that the new programmer has the opportunity to work in close contact with the programmers who already possess the theory."

### 6.3 What the Evidence Actually Shows

Naur's argument, while philosophically compelling, has practical limitations:

1. **Naur wrote in 1985.** The software systems he discussed were maintained by small teams with long tenure. Modern software is maintained by teams with high turnover, distributed across time zones. The alternative to lossy documentation is not "direct contact with theory-holders" but "no knowledge transfer at all."

2. **Lossy compression is still useful.** JPEG images are lossy compressions of visual data; they are still enormously useful despite not being lossless. The question is not "is the documentation perfect?" but "is the documentation better than nothing?" The answer, empirically, appears to be yes (Spotify's onboarding experience, cross-team alignment benefits).

3. **The false confidence risk is real but manageable.** Documentation can include explicit uncertainty markers ("confidence: medium," "last validated: 2025-03") that signal to readers that they are working with a compressed representation. Evidence expiry mechanisms address the temporal dimension.

4. **Naur's argument applies equally to all forms of knowledge transfer**, including code review, pair programming, and mentorship. All of these are lossy. The question is which combination of lossy channels produces the best approximation of theory transfer.

---

## 7. Scale-Dependent Governance

### 7.1 The Governance Spectrum

Governance needs vary dramatically with context. Practitioners suggest the following spectrum:

| Scale | Governance Approach | Key Mechanisms |
|-------|-------------------|----------------|
| 1-3 developers | None or minimal | Conversation, shared mental model |
| 4-10 developers | Lightweight | Code review, informal ADRs, style guides |
| 10-50 developers | Structured | Formal ADRs, fitness functions, automated checks |
| 50-200 developers | Formal | Review boards, compliance audits, cross-team governance |
| 200+ developers | Institutional | Phase gates, architecture review committees, formal waivers |

The key insight from research: "A governance process should scale from a startup hitting its stride to a full-blown enterprise. Rather than trying to implement everything at once, you should start with a 'Minimum Viable Governance' model focusing on high-impact areas like version control and peer reviews, then evolve the framework's maturity as your organization grows."

### 7.2 The Scale Threshold

The evidence suggests that **the critical threshold is not team size per se, but whether any single person holds the complete mental model of the system.** This threshold is crossed at different team sizes depending on system complexity: a simple CRUD application might remain comprehensible to one person at 15 developers, while a distributed event-driven system might exceed individual comprehension at 3 developers.

Once no single person holds the complete model:
- Decisions made in one area can inadvertently violate constraints in another
- Onboarding cost increases non-linearly
- Implicit knowledge ("everyone knows we don't do X") becomes unreliable
- The cost of re-deriving a decision (why did we choose Postgres over Mongo?) is paid repeatedly

This is the point where formal governance begins to have positive ROI.

### 7.3 Context-Dependent Variables

Beyond team size, governance needs depend on:

- **Regulatory environment**: Healthcare, finance, and defense require formal governance regardless of team size
- **Team distribution**: Distributed teams need more formal governance than co-located ones, because informal channels are degraded
- **Turnover rate**: High-turnover teams benefit more from documentation-heavy governance
- **System criticality**: Life-safety systems require more governance than internal tools
- **Codebase age**: Older codebases accumulate more implicit knowledge that needs formalization

The best governance model "depends on your organization's structure, with smaller teams potentially benefiting from centralized control, while larger ones might need more flexible, federated approaches."

**Source:** [Enterprise software governance](https://www.techtarget.com/searcherp/feature/Enterprise-software-at-scale-risk-governance-stability)

---

## 8. Synthesis: What the Evidence Supports and What It Does Not

### What the evidence supports:

1. **Conway's Law is empirically validated.** Multiple studies (MacCormack et al., Nagappan et al.) confirm that organizational structure shapes system architecture and predicts software quality better than code metrics.

2. **Governance has scale-dependent ROI.** Below a certain complexity threshold (roughly where one person can hold the complete mental model), formal governance costs more than it saves. Above that threshold, the cost of absent governance becomes significant.

3. **ADRs provide onboarding and alignment value.** Practitioner reports consistently show that ADRs help new team members and enable cross-team knowledge transfer.

4. **Documentation is lossy but useful.** Naur is correct that theory cannot be perfectly externalized, but lossy approximations still provide measurable value.

### What the evidence does not support:

1. **No empirical study demonstrates that ADRs improve measurable software quality outcomes** (defect rates, time-to-market, maintenance cost). The evidence is entirely based on practitioner reports and observational accounts.

2. **No empirical study establishes the optimal level of governance** for a given team size, codebase complexity, or project maturity. The "minimum viable governance" advice is based on practitioner wisdom, not controlled experiments.

3. **No evidence addresses whether automated governance (fitness functions, continuous compliance) is more effective than manual governance** (review boards, periodic audits). The automation approach is theoretically compelling but empirically untested.

4. **No evidence addresses the false confidence problem quantitatively.** We do not know whether lossy documentation leads to worse decisions than no documentation in specific scenarios.

### The uncomfortable gap:

The most important finding of this research is the gap between the confidence with which governance practices are recommended and the empirical evidence supporting them. Conway's Law itself is well-validated. The specific governance mechanisms proposed to work within its constraints (ADRs, fitness functions, compliance audits, team topology design) are supported primarily by practitioner experience and theoretical argument, not by controlled empirical studies. This does not make them wrong; it makes them **unvalidated**, which is a different epistemic status than either "proven" or "disproven."

---

## Sources

- [Conway's original paper](https://www.melconway.com/Home/Committees_Paper.html)
- [Empirical research supports Conway's Law (Allan Kelly)](https://www.allankelly.net/archives/927/empirical-research-supports-conway-law/)
- [Conway's Law (Wikipedia)](https://en.wikipedia.org/wiki/Conway's_law)
- [Microsoft Research: Organizational Structure and Software Quality](https://www.microsoft.com/en-us/research/publication/the-influence-of-organizational-structure-on-software-quality-an-empirical-case-study/)
- [Martin Fowler on Conway's Law](https://martinfowler.com/bliki/ConwaysLaw.html)
- [Team Topologies summary](https://www.runn.io/blog/team-topologies-summary)
- [Inverse Conway Manoeuvre in existing systems](https://mende.io/blog/the-inverse-conway-manoeuvre-in-existing-systems/)
- [Conway's Law and agentic AI systems](https://reynders.co/blog/how-organizations-shape-their-agentic-systems/)
- [Architecting agentic AI teams](https://medium.com/@josef-dijon/from-code-to-conway-architecting-the-future-with-agentic-ai-teams-3b4b1ebedc05)
- [Spotify: When to write an ADR](https://engineering.atspotify.com/2020/04/when-should-i-write-an-architecture-decision-record)
- [ADR adoption model (Zimmermann)](https://ozimmer.ch/practices/2023/04/21/ADAdoptionModel.html)
- [ThoughtWorks: Lightweight ADRs](https://www.thoughtworks.com/en-us/radar/techniques/lightweight-architecture-decision-records)
- [Naur: Programming as Theory Building (PDF)](https://pages.cs.wisc.edu/~remzi/Naur.pdf)
- [Paper review: Programming as Theory Building](https://emptysqua.re/blog/programming-as-theory-building/)
- [Building Evolutionary Architectures (O'Reilly)](https://www.oreilly.com/library/view/building-evolutionary-architectures/9781492097532/ch04.html)
- [Finding the sweet spot for organizational control (Springer)](https://link.springer.com/article/10.1007/s10664-021-09967-3)
- [Software development governance (N-iX)](https://www.n-ix.com/software-development-governance/)
- [Scaling architecture conversationally (Fowler)](https://martinfowler.com/articles/scaling-architecture-conversationally.html)
- [From stale docs to living architecture](https://medium.com/@iraj.hedayati/from-stale-docs-to-living-architecture-automating-adrs-with-github-llm-e80bb066b4b6)
- [TOGAF Architecture Governance](https://pubs.opengroup.org/architecture/togaf811-doc/arch/chap26.html)
