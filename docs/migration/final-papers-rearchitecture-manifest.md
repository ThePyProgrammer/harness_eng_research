# Final Papers Rearchitecture Manifest

This manifest records the physical file migration that reorganizes the repository around `science/` and `pillars/`.

| Old path | New path | Category | Status | Notes |
|---|---|---|---|---|
| final_papers/science.tex | science/paper/science.tex | canonical paper | moved | Umbrella source |
| final_papers/science.bib | science/paper/science.bib | canonical bibliography | moved | Umbrella bibliography |
| final_papers/science.pdf | science/paper/science.pdf | canonical PDF | moved | Umbrella PDF |
| final_papers/science.maf | science/paper/build/science.maf | build artifact | moved if tracked | Preserved build metadata |
| final_papers/science-assembled.tex | science/archive/drafts/science-assembled.tex | draft | archived | Preserved assembly draft |
| final_papers/science_backup.tex | science/archive/drafts/science_backup.tex | draft | archived | Preserved backup |
| final_papers/science_backup_pre_security.tex | science/archive/drafts/science_backup_pre_security.tex | draft | archived | Preserved pre-security backup |
| final_papers/science_new.tex | science/archive/drafts/science_new.tex | draft | archived | Preserved alternate draft |
| final_papers/abstraction_architecture/ | pillars/abstraction/paper/ | canonical paper directory | moved | Non-logo tracked files moved; logo.pdf untracked locally |
| final_papers/information_architecture/ | pillars/information/paper/ | canonical paper directory | moved | Non-logo tracked files moved; logo.pdf untracked locally |
| final_papers/reliability_architecture/ | pillars/reliability/paper/ | canonical paper directory | moved | Non-logo tracked files moved; logo.pdf untracked locally |
| final_papers/coordination_architecture/ | pillars/coordination/paper/ | canonical paper directory | moved | Non-logo tracked files moved; logo.pdf untracked locally |
| final_papers/temporal_architecture/ | pillars/temporal/paper/ | canonical paper directory | moved | Non-logo tracked files moved; logo.pdf untracked locally |
| final_papers/quality_architecture/ | pillars/quality/paper/ | canonical paper directory | moved | Non-logo tracked files moved; logo.pdf untracked locally |
| final_papers/governance_architecture/ | pillars/governance/paper/ | canonical paper directory | moved | Non-logo tracked files moved; logo.pdf untracked locally |
| final_papers/economics_architecture/ | pillars/economics/paper/ | canonical paper directory | moved | Non-logo tracked files moved; logo.pdf untracked locally |
| final_papers/human_interaction_architecture/ | pillars/human-interaction/paper/ | canonical paper directory | moved | Non-logo tracked files moved; logo.pdf untracked locally |
| final_papers/model_routing_architecture/ | pillars/model-routing/paper/ | canonical paper directory | moved | Non-logo tracked files moved; logo.pdf untracked locally |
| final_papers/security_architecture/ | pillars/security/paper/ | canonical paper directory | moved | Non-logo tracked files moved; logo.pdf untracked locally |
| final_papers/accretion_category/ | pillars/accretion/paper/ | canonical paper directory | moved | Non-logo tracked files moved; logo.pdf untracked locally |
| **/logo.pdf | local filesystem only | local asset | untracked | Removed from Git tracking, preserved on disk |
| pillars/1-information-architecture.md | pillars/information/notes/concepts/original-pillar-note.md | pillar note | moved | Preserved as original pillar note |
| pillars/2-reliability-architecture.md | pillars/reliability/notes/concepts/original-pillar-note.md | pillar note | moved | Preserved as original pillar note |
| pillars/3-coordination-architecture.md | pillars/coordination/notes/concepts/original-pillar-note.md | pillar note | moved | Preserved as original pillar note |
| pillars/4-temporal-architecture.md | pillars/temporal/notes/concepts/original-pillar-note.md | pillar note | moved | Preserved as original pillar note |
| pillars/5-quality-architecture.md | pillars/quality/notes/concepts/original-pillar-note.md | pillar note | moved | Preserved as original pillar note |
| pillars/6-governance-architecture.md | pillars/governance/notes/concepts/original-pillar-note.md | pillar note | moved | Preserved as original pillar note |
| pillars/7-economics-architecture.md | pillars/economics/notes/concepts/original-pillar-note.md | pillar note | moved | Preserved as original pillar note |
| pillars/8-human-interaction-architecture.md | pillars/human-interaction/notes/concepts/original-pillar-note.md | pillar note | moved | Preserved as original pillar note |
| pillars/9-model-routing-architecture.md | pillars/model-routing/notes/concepts/original-pillar-note.md | pillar note | moved | Preserved as original pillar note |
| pillars/10-security-architecture.md | pillars/security/notes/concepts/original-pillar-note.md | pillar note | moved | Preserved as original pillar note |
| generated | pillars/abstraction/README.md | navigation | created | Pillar landing page |
| generated | pillars/information/README.md | navigation | created | Pillar landing page |
| generated | pillars/reliability/README.md | navigation | created | Pillar landing page |
| generated | pillars/coordination/README.md | navigation | created | Pillar landing page |
| generated | pillars/temporal/README.md | navigation | created | Pillar landing page |
| generated | pillars/quality/README.md | navigation | created | Pillar landing page |
| generated | pillars/governance/README.md | navigation | created | Pillar landing page |
| generated | pillars/economics/README.md | navigation | created | Pillar landing page |
| generated | pillars/human-interaction/README.md | navigation | created | Pillar landing page |
| generated | pillars/model-routing/README.md | navigation | created | Pillar landing page |
| generated | pillars/security/README.md | navigation | created | Pillar landing page |
| generated | pillars/accretion/README.md | navigation | created | Pillar landing page |
| outputs/coordination-architecture-formal-r1.md | pillars/coordination/research/formal/coordination-architecture-formal-r1.md | formal research | moved | Pattern-based output migration |
| outputs/coordination-architecture-formal-r2.md | pillars/coordination/research/formal/coordination-architecture-formal-r2.md | formal research | moved | Pattern-based output migration |
| outputs/coordination-architecture-formal-r3.md | pillars/coordination/research/formal/coordination-architecture-formal-r3.md | formal research | moved | Pattern-based output migration |
| outputs/coordination-architecture-research-r1.md | pillars/coordination/research/raw/coordination-architecture-research-r1.md | raw research | moved | Pattern-based output migration |
| outputs/coordination-architecture-research-r2.md | pillars/coordination/research/raw/coordination-architecture-research-r2.md | raw research | moved | Pattern-based output migration |
| outputs/coordination-architecture-research-r3.md | pillars/coordination/research/raw/coordination-architecture-research-r3.md | raw research | moved | Pattern-based output migration |
| outputs/coordination-architecture-research-r4.md | pillars/coordination/research/raw/coordination-architecture-research-r4.md | raw research | moved | Pattern-based output migration |
| outputs/coordination-architecture-research-r5.md | pillars/coordination/research/raw/coordination-architecture-research-r5.md | raw research | moved | Pattern-based output migration |
| outputs/coordination-architecture-review.md | pillars/coordination/reviews/coordination-architecture-review.md | review | moved | Pattern-based output migration |
| outputs/economics-architecture-formal-r1.md | pillars/economics/research/formal/economics-architecture-formal-r1.md | formal research | moved | Pattern-based output migration |
| outputs/economics-architecture-formal-r2.md | pillars/economics/research/formal/economics-architecture-formal-r2.md | formal research | moved | Pattern-based output migration |
| outputs/economics-architecture-formal-r3.md | pillars/economics/research/formal/economics-architecture-formal-r3.md | formal research | moved | Pattern-based output migration |
| outputs/economics-architecture-research-r1.md | pillars/economics/research/raw/economics-architecture-research-r1.md | raw research | moved | Pattern-based output migration |
| outputs/economics-architecture-research-r2.md | pillars/economics/research/raw/economics-architecture-research-r2.md | raw research | moved | Pattern-based output migration |
| outputs/economics-architecture-research-r3.md | pillars/economics/research/raw/economics-architecture-research-r3.md | raw research | moved | Pattern-based output migration |
| outputs/economics-architecture-research-r4.md | pillars/economics/research/raw/economics-architecture-research-r4.md | raw research | moved | Pattern-based output migration |
| outputs/economics-architecture-research-r5.md | pillars/economics/research/raw/economics-architecture-research-r5.md | raw research | moved | Pattern-based output migration |
| outputs/economics-architecture-review.md | pillars/economics/reviews/economics-architecture-review.md | review | moved | Pattern-based output migration |
| outputs/governance-architecture-formal-r1.md | pillars/governance/research/formal/governance-architecture-formal-r1.md | formal research | moved | Pattern-based output migration |
| outputs/governance-architecture-formal-r2.md | pillars/governance/research/formal/governance-architecture-formal-r2.md | formal research | moved | Pattern-based output migration |
| outputs/governance-architecture-formal-r3.md | pillars/governance/research/formal/governance-architecture-formal-r3.md | formal research | moved | Pattern-based output migration |
| outputs/governance-architecture-research-r1.md | pillars/governance/research/raw/governance-architecture-research-r1.md | raw research | moved | Pattern-based output migration |
| outputs/governance-architecture-research-r2.md | pillars/governance/research/raw/governance-architecture-research-r2.md | raw research | moved | Pattern-based output migration |
| outputs/governance-architecture-research-r3.md | pillars/governance/research/raw/governance-architecture-research-r3.md | raw research | moved | Pattern-based output migration |
| outputs/governance-architecture-research-r4.md | pillars/governance/research/raw/governance-architecture-research-r4.md | raw research | moved | Pattern-based output migration |
| outputs/governance-architecture-review.md | pillars/governance/reviews/governance-architecture-review.md | review | moved | Pattern-based output migration |
| outputs/human_interaction_architecture-formal-r1.md | pillars/human-interaction/research/formal/human_interaction_architecture-formal-r1.md | formal research | moved | Pattern-based output migration |
| outputs/human_interaction_architecture-formal-r2.md | pillars/human-interaction/research/formal/human_interaction_architecture-formal-r2.md | formal research | moved | Pattern-based output migration |
| outputs/human_interaction_architecture-formal-r3.md | pillars/human-interaction/research/formal/human_interaction_architecture-formal-r3.md | formal research | moved | Pattern-based output migration |
| outputs/human_interaction_architecture-research-r1.md | pillars/human-interaction/research/raw/human_interaction_architecture-research-r1.md | raw research | moved | Pattern-based output migration |
| outputs/human_interaction_architecture-research-r2.md | pillars/human-interaction/research/raw/human_interaction_architecture-research-r2.md | raw research | moved | Pattern-based output migration |
| outputs/human_interaction_architecture-research-r3.md | pillars/human-interaction/research/raw/human_interaction_architecture-research-r3.md | raw research | moved | Pattern-based output migration |
| outputs/human_interaction_architecture-research-r4.md | pillars/human-interaction/research/raw/human_interaction_architecture-research-r4.md | raw research | moved | Pattern-based output migration |
| outputs/human_interaction_architecture-research-r5.md | pillars/human-interaction/research/raw/human_interaction_architecture-research-r5.md | raw research | moved | Pattern-based output migration |
| outputs/human_interaction_architecture-review.md | pillars/human-interaction/reviews/human_interaction_architecture-review.md | review | moved | Pattern-based output migration |
| outputs/info-arch-formal-r1.md | pillars/information/research/formal/info-arch-formal-r1.md | formal research | moved | Pattern-based output migration |
| outputs/info-arch-formal-r2.md | pillars/information/research/formal/info-arch-formal-r2.md | formal research | moved | Pattern-based output migration |
| outputs/info-arch-formal-r3.md | pillars/information/research/formal/info-arch-formal-r3.md | formal research | moved | Pattern-based output migration |
| outputs/info-arch-research-r1.md | pillars/information/research/raw/info-arch-research-r1.md | raw research | moved | Pattern-based output migration |
| outputs/info-arch-research-r2.md | pillars/information/research/raw/info-arch-research-r2.md | raw research | moved | Pattern-based output migration |
| outputs/info-arch-research-r3.md | pillars/information/research/raw/info-arch-research-r3.md | raw research | moved | Pattern-based output migration |
| outputs/info-arch-research-r4.md | pillars/information/research/raw/info-arch-research-r4.md | raw research | moved | Pattern-based output migration |
| outputs/info-arch-research-r5.md | pillars/information/research/raw/info-arch-research-r5.md | raw research | moved | Pattern-based output migration |
| outputs/info-arch-review.md | pillars/information/reviews/info-arch-review.md | review | moved | Pattern-based output migration |
| outputs/model_routing_architecture-research-r1.md | pillars/model-routing/research/raw/model_routing_architecture-research-r1.md | raw research | moved | Pattern-based output migration |
| outputs/model_routing_architecture-research-r2.md | pillars/model-routing/research/raw/model_routing_architecture-research-r2.md | raw research | moved | Pattern-based output migration |
| outputs/model_routing_architecture-research-r3.md | pillars/model-routing/research/raw/model_routing_architecture-research-r3.md | raw research | moved | Pattern-based output migration |
| outputs/model_routing_architecture-research-r4.md | pillars/model-routing/research/raw/model_routing_architecture-research-r4.md | raw research | moved | Pattern-based output migration |
| outputs/model_routing_architecture-review.md | pillars/model-routing/reviews/model_routing_architecture-review.md | review | moved | Pattern-based output migration |
| outputs/quality-architecture-ai-slop-formal-r1.md | pillars/quality/research/formal/quality-architecture-ai-slop-formal-r1.md | formal research | moved | Pattern-based output migration |
| outputs/quality-architecture-ai-slop-formal-r2.md | pillars/quality/research/formal/quality-architecture-ai-slop-formal-r2.md | formal research | moved | Pattern-based output migration |
| outputs/quality-architecture-ai-slop-formal-r3.md | pillars/quality/research/formal/quality-architecture-ai-slop-formal-r3.md | formal research | moved | Pattern-based output migration |
| outputs/quality-architecture-ai-slop-research-r1.md | pillars/quality/research/raw/quality-architecture-ai-slop-research-r1.md | raw research | moved | Pattern-based output migration |
| outputs/quality-architecture-ai-slop-research-r2.md | pillars/quality/research/raw/quality-architecture-ai-slop-research-r2.md | raw research | moved | Pattern-based output migration |
| outputs/quality-architecture-ai-slop-research-r3.md | pillars/quality/research/raw/quality-architecture-ai-slop-research-r3.md | raw research | moved | Pattern-based output migration |
| outputs/quality-architecture-ai-slop-research-r4.md | pillars/quality/research/raw/quality-architecture-ai-slop-research-r4.md | raw research | moved | Pattern-based output migration |
| outputs/quality-architecture-ai-slop-research-r5.md | pillars/quality/research/raw/quality-architecture-ai-slop-research-r5.md | raw research | moved | Pattern-based output migration |
| outputs/quality-architecture-ai-slop-review.md | pillars/quality/reviews/quality-architecture-ai-slop-review.md | review | moved | Pattern-based output migration |
| outputs/reliability-architecture-formal-r1.md | pillars/reliability/research/formal/reliability-architecture-formal-r1.md | formal research | moved | Pattern-based output migration |
| outputs/reliability-architecture-formal-r2.md | pillars/reliability/research/formal/reliability-architecture-formal-r2.md | formal research | moved | Pattern-based output migration |
| outputs/reliability-architecture-research-r1.md | pillars/reliability/research/raw/reliability-architecture-research-r1.md | raw research | moved | Pattern-based output migration |
| outputs/reliability-architecture-research-r2.md | pillars/reliability/research/raw/reliability-architecture-research-r2.md | raw research | moved | Pattern-based output migration |
| outputs/reliability-architecture-research-r3.md | pillars/reliability/research/raw/reliability-architecture-research-r3.md | raw research | moved | Pattern-based output migration |
| outputs/reliability-architecture-research-r4.md | pillars/reliability/research/raw/reliability-architecture-research-r4.md | raw research | moved | Pattern-based output migration |
| outputs/reliability-architecture-review.md | pillars/reliability/reviews/reliability-architecture-review.md | review | moved | Pattern-based output migration |
| outputs/security-architecture-formal-r2.md | pillars/security/research/formal/security-architecture-formal-r2.md | formal research | moved | Pattern-based output migration |
| outputs/security-architecture-research-r1.md | pillars/security/research/raw/security-architecture-research-r1.md | raw research | moved | Pattern-based output migration |
| outputs/security-architecture-research-r2.md | pillars/security/research/raw/security-architecture-research-r2.md | raw research | moved | Pattern-based output migration |
| outputs/security-architecture-research-r3.md | pillars/security/research/raw/security-architecture-research-r3.md | raw research | moved | Pattern-based output migration |
| outputs/security-architecture-review.md | pillars/security/reviews/security-architecture-review.md | review | moved | Pattern-based output migration |
| outputs/temporal-architecture-formal-r1.md | pillars/temporal/research/formal/temporal-architecture-formal-r1.md | formal research | moved | Pattern-based output migration |
| outputs/temporal-architecture-formal-r2.md | pillars/temporal/research/formal/temporal-architecture-formal-r2.md | formal research | moved | Pattern-based output migration |
| outputs/temporal-architecture-research-r1.md | pillars/temporal/research/raw/temporal-architecture-research-r1.md | raw research | moved | Pattern-based output migration |
| outputs/temporal-architecture-research-r2.md | pillars/temporal/research/raw/temporal-architecture-research-r2.md | raw research | moved | Pattern-based output migration |
| outputs/temporal-architecture-research-r3.md | pillars/temporal/research/raw/temporal-architecture-research-r3.md | raw research | moved | Pattern-based output migration |
| outputs/temporal-architecture-research-r4.md | pillars/temporal/research/raw/temporal-architecture-research-r4.md | raw research | moved | Pattern-based output migration |
| outputs/temporal-architecture-review.md | pillars/temporal/reviews/temporal-architecture-review.md | review | moved | Pattern-based output migration |
| outputs/accretion-category-review-ai-builder.md | pillars/accretion/reviews/accretion-category-review-ai-builder.md | review | moved | Pattern-based output migration |
| outputs/accretion-category-review-empiricist.md | pillars/accretion/reviews/accretion-category-review-empiricist.md | review | moved | Pattern-based output migration |
| outputs/accretion-category-review-formalist.md | pillars/accretion/reviews/accretion-category-review-formalist.md | review | moved | Pattern-based output migration |
| outputs/accretion-category-review-internet-critic.md | pillars/accretion/reviews/accretion-category-review-internet-critic.md | review | moved | Pattern-based output migration |
| outputs/accretion-category-review-se-veteran.md | pillars/accretion/reviews/accretion-category-review-se-veteran.md | review | moved | Pattern-based output migration |
| outputs/accretion-category-review.md | pillars/accretion/reviews/accretion-category-review.md | review | moved | Pattern-based output migration |
| outputs/ai-harness-abstraction-gap-final-changes.md | pillars/abstraction/archive/misc/ai-harness-abstraction-gap-final-changes.md | misc output | moved | Pattern-based output migration |
| outputs/ai-harness-abstraction-gap-review.md | pillars/abstraction/reviews/ai-harness-abstraction-gap-review.md | review | moved | Pattern-based output migration |
| outputs/.plans/coordination-architecture.md | pillars/coordination/research/plan.md | research plan | moved | Pattern-based output migration |
| outputs/.plans/economics-architecture.md | pillars/economics/research/plan.md | research plan | moved | Pattern-based output migration |
| outputs/.plans/governance-architecture.md | pillars/governance/research/plan.md | research plan | moved | Pattern-based output migration |
| outputs/.plans/human_interaction_architecture.md | pillars/human-interaction/research/plan.md | research plan | moved | Pattern-based output migration |
| outputs/.plans/info-arch-coding-agents.md | pillars/information/research/plan.md | research plan | moved | Pattern-based output migration |
| outputs/.plans/model_routing_architecture.md | pillars/model-routing/research/plan.md | research plan | moved | Pattern-based output migration |
| outputs/.plans/quality-architecture-ai-slop.md | pillars/quality/research/plan.md | research plan | moved | Pattern-based output migration |
| outputs/.plans/reliability-architecture.md | pillars/reliability/research/plan.md | research plan | moved | Pattern-based output migration |
| outputs/.plans/security-architecture.md | pillars/security/research/plan.md | research plan | moved | Pattern-based output migration |
| outputs/.plans/temporal-architecture.md | pillars/temporal/research/plan.md | research plan | moved | Pattern-based output migration |
| outputs/.drafts/abstraction-human-language-code-draft.md | pillars/abstraction/archive/drafts/abstraction-human-language-code-draft.md | draft | moved | Pattern-based output migration |
| outputs/deep-research-1-context.md | science/synthesis/deep-research-1-context.md | synthesis | moved | Science/cross-pillar output migration |
| outputs/deep-research-2-verification.md | science/synthesis/deep-research-2-verification.md | synthesis | moved | Science/cross-pillar output migration |
| outputs/deep-research-3-parallelism.md | science/synthesis/deep-research-3-parallelism.md | synthesis | moved | Science/cross-pillar output migration |
| outputs/deep-research-4-speed.md | science/synthesis/deep-research-4-speed.md | synthesis | moved | Science/cross-pillar output migration |
| outputs/deep-research-5-quality.md | science/synthesis/deep-research-5-quality.md | synthesis | moved | Science/cross-pillar output migration |
| outputs/deep-research-6-governance.md | science/synthesis/deep-research-6-governance.md | synthesis | moved | Science/cross-pillar output migration |
| outputs/deep-research-7-synthesis.md | science/synthesis/deep-research-7-synthesis.md | synthesis | moved | Science/cross-pillar output migration |
| outputs/formal-harness-theory-roadmap.md | science/synthesis/formal-harness-theory-roadmap.md | synthesis | moved | Science/cross-pillar output migration |
| outputs/formalizable-problems.md | science/synthesis/formalizable-problems.md | synthesis | moved | Science/cross-pillar output migration |
| outputs/harness-framework-review-empiricist.md | science/reviews/harness-framework-review-empiricist.md | science review | moved | Science/cross-pillar output migration |
| outputs/harness-framework-review-formalist.md | science/reviews/harness-framework-review-formalist.md | science review | moved | Science/cross-pillar output migration |
| outputs/harness-framework-review-novelty-skeptic.md | science/reviews/harness-framework-review-novelty-skeptic.md | science review | moved | Science/cross-pillar output migration |
| outputs/harness-framework-review-practitioner.md | science/reviews/harness-framework-review-practitioner.md | science review | moved | Science/cross-pillar output migration |
| outputs/harness-framework-review-reproducibility.md | science/reviews/harness-framework-review-reproducibility.md | science review | moved | Science/cross-pillar output migration |
| outputs/harness-framework-review-scope.md | science/reviews/harness-framework-review-scope.md | science review | moved | Science/cross-pillar output migration |
| outputs/harness-framework-review.md | science/reviews/harness-framework-review.md | science review | moved | Science/cross-pillar output migration |
| outputs/harness-science-paper-review.md | science/reviews/harness-science-paper-review.md | science review | moved | Science/cross-pillar output migration |
| outputs/harness-tools-comparison.md | science/synthesis/harness-tools-comparison.md | synthesis | moved | Science/cross-pillar output migration |
| outputs/perspective-1-harness-engineer.md | science/synthesis/perspective-1-harness-engineer.md | synthesis | moved | Science/cross-pillar output migration |
| outputs/perspective-2-formal-methods.md | science/synthesis/perspective-2-formal-methods.md | synthesis | moved | Science/cross-pillar output migration |
| outputs/perspective-3-multi-agent.md | science/synthesis/perspective-3-multi-agent.md | synthesis | moved | Science/cross-pillar output migration |
| outputs/perspective-4-hci-cogsci.md | science/synthesis/perspective-4-hci-cogsci.md | synthesis | moved | Science/cross-pillar output migration |
| outputs/perspective-5-philosophy.md | science/synthesis/perspective-5-philosophy.md | synthesis | moved | Science/cross-pillar output migration |
| outputs/perspective-6-uncomputability-skeptic.md | science/synthesis/perspective-6-uncomputability-skeptic.md | synthesis | moved | Science/cross-pillar output migration |
| outputs/r1-empiricist.md | science/synthesis/r1-empiricist.md | synthesis | moved | Science/cross-pillar output migration |
| outputs/r2-theoretician.md | science/synthesis/r2-theoretician.md | synthesis | moved | Science/cross-pillar output migration |
| outputs/r3-systems-builder.md | science/synthesis/r3-systems-builder.md | synthesis | moved | Science/cross-pillar output migration |
| outputs/r4-se-researcher.md | science/synthesis/r4-se-researcher.md | synthesis | moved | Science/cross-pillar output migration |
| outputs/r5-interdisciplinary-skeptic.md | science/synthesis/r5-interdisciplinary-skeptic.md | synthesis | moved | Science/cross-pillar output migration |
| outputs/review-chen.md | science/reviews/review-chen.md | science review | moved | Science/cross-pillar output migration |
| outputs/review-okafor.md | science/reviews/review-okafor.md | science review | moved | Science/cross-pillar output migration |
| outputs/review-osei.md | science/reviews/review-osei.md | science review | moved | Science/cross-pillar output migration |
| outputs/review-rodriguez.md | science/reviews/review-rodriguez.md | science review | moved | Science/cross-pillar output migration |
| outputs/review-tanaka.md | science/reviews/review-tanaka.md | science review | moved | Science/cross-pillar output migration |
| outputs/review-voss.md | science/reviews/review-voss.md | science review | moved | Science/cross-pillar output migration |
| outputs/sci-add-contrarian.tex | science/archive/drafts/sci-add-contrarian.tex | science draft | moved | Science/cross-pillar output migration |
| outputs/sci-add-related.tex | science/archive/drafts/sci-add-related.tex | science draft | moved | Science/cross-pillar output migration |
| outputs/sci-appendix-stripped.tex | science/archive/drafts/sci-appendix-stripped.tex | science draft | moved | Science/cross-pillar output migration |
| outputs/sci-keep-1.tex | science/archive/drafts/sci-keep-1.tex | science draft | moved | Science/cross-pillar output migration |
| outputs/sci-keep-appendix-end.tex | science/archive/drafts/sci-keep-appendix-end.tex | science draft | moved | Science/cross-pillar output migration |
| outputs/sci-keep-conclusion.tex | science/archive/drafts/sci-keep-conclusion.tex | science draft | moved | Science/cross-pillar output migration |
| outputs/sci-keep-limitations.tex | science/archive/drafts/sci-keep-limitations.tex | science draft | moved | Science/cross-pillar output migration |
| outputs/science-add-calibration-proofs.tex | science/archive/drafts/science-add-calibration-proofs.tex | science draft | moved | Science/cross-pillar output migration |
| outputs/science-add-contrarian-related.tex | science/archive/drafts/science-add-contrarian-related.tex | science draft | moved | Science/cross-pillar output migration |
| outputs/science-add-principles.tex | science/archive/drafts/science-add-principles.tex | science draft | moved | Science/cross-pillar output migration |
| outputs/science-completeness-audit.md | science/reviews/science-completeness-audit.md | science review | moved | Science/cross-pillar output migration |
| outputs/science-expanded-sec2-4.tex | science/archive/drafts/science-expanded-sec2-4.tex | science draft | moved | Science/cross-pillar output migration |
| outputs/science-expanded-sec5-6.tex | science/archive/drafts/science-expanded-sec5-6.tex | science draft | moved | Science/cross-pillar output migration |
| outputs/science-expanded-sec7-8.tex | science/archive/drafts/science-expanded-sec7-8.tex | science draft | moved | Science/cross-pillar output migration |
| outputs/science-expanded-sec9-app.tex | science/archive/drafts/science-expanded-sec9-app.tex | science draft | moved | Science/cross-pillar output migration |
| outputs/science-harness-synthesis-research.md | science/synthesis/science-harness-synthesis-research.md | synthesis | moved | Science/cross-pillar output migration |
| outputs/science-harness-synthesis-review.md | science/reviews/science-harness-synthesis-review.md | science review | moved | Science/cross-pillar output migration |
| outputs/science-part-conclusion.tex | science/archive/drafts/science-part-conclusion.tex | science draft | moved | Science/cross-pillar output migration |
| outputs/science-part-preamble.tex | science/archive/drafts/science-part-preamble.tex | science draft | moved | Science/cross-pillar output migration |
| outputs/science-part-principles.tex | science/archive/drafts/science-part-principles.tex | science draft | moved | Science/cross-pillar output migration |
| outputs/science-rebuttal-round2.md | science/reviews/science-rebuttal-round2.md | science review | moved | Science/cross-pillar output migration |
| outputs/unified-harness-design.md | science/synthesis/unified-harness-design.md | synthesis | moved | Science/cross-pillar output migration |
| outputs/.plans/abstraction-human-language-code.md | archive/unsorted/outputs/.plans/abstraction-human-language-code.md | unsorted output | archived | Preserved because no deterministic pillar mapping matched |
| outputs/ai-harness-science-review.md | archive/unsorted/outputs/ai-harness-science-review.md | unsorted output | archived | Preserved because no deterministic pillar mapping matched |
| outputs/economics-pillar-section.tex | archive/unsorted/outputs/economics-pillar-section.tex | unsorted output | archived | Preserved because no deterministic pillar mapping matched |
| outputs/human-interaction-pillar-section.tex | archive/unsorted/outputs/human-interaction-pillar-section.tex | unsorted output | archived | Preserved because no deterministic pillar mapping matched |
| outputs/ideal-harness-implementation-plan.md | archive/unsorted/outputs/ideal-harness-implementation-plan.md | unsorted output | archived | Preserved because no deterministic pillar mapping matched |
| outputs/missing-bib-entries-new.bib | archive/unsorted/outputs/missing-bib-entries-new.bib | unsorted output | archived | Preserved because no deterministic pillar mapping matched |
| outputs/missing-bib-entries-security.bib | archive/unsorted/outputs/missing-bib-entries-security.bib | unsorted output | archived | Preserved because no deterministic pillar mapping matched |
| outputs/missing-bib-entries.bib | archive/unsorted/outputs/missing-bib-entries.bib | unsorted output | archived | Preserved because no deterministic pillar mapping matched |
| outputs/model-routing-pillar-section.tex | archive/unsorted/outputs/model-routing-pillar-section.tex | unsorted output | archived | Preserved because no deterministic pillar mapping matched |
| outputs/pillar-synthesis-notes.md | archive/unsorted/outputs/pillar-synthesis-notes.md | unsorted output | archived | Preserved because no deterministic pillar mapping matched |
| outputs/research-r1-historical.md | archive/unsorted/outputs/research-r1-historical.md | unsorted output | archived | Preserved because no deterministic pillar mapping matched |
| outputs/research-r2-tools.md | archive/unsorted/outputs/research-r2-tools.md | unsorted output | archived | Preserved because no deterministic pillar mapping matched |
| outputs/research-r3-contrarian.md | archive/unsorted/outputs/research-r3-contrarian.md | unsorted output | archived | Preserved because no deterministic pillar mapping matched |
| outputs/research-r4-alternatives.md | archive/unsorted/outputs/research-r4-alternatives.md | unsorted output | archived | Preserved because no deterministic pillar mapping matched |
| outputs/research-r5-information-theory.md | archive/unsorted/outputs/research-r5-information-theory.md | unsorted output | archived | Preserved because no deterministic pillar mapping matched |
| outputs/research-r6-type-category-theory.md | archive/unsorted/outputs/research-r6-type-category-theory.md | unsorted output | archived | Preserved because no deterministic pillar mapping matched |
| outputs/research-r7-metrics-placement.md | archive/unsorted/outputs/research-r7-metrics-placement.md | unsorted output | archived | Preserved because no deterministic pillar mapping matched |
| outputs/revision-checklist.md | archive/unsorted/outputs/revision-checklist.md | unsorted output | archived | Preserved because no deterministic pillar mapping matched |
| outputs/sec9app-a.tex | archive/unsorted/outputs/sec9app-a.tex | unsorted output | archived | Preserved because no deterministic pillar mapping matched |
| outputs/sec9app-b.tex | archive/unsorted/outputs/sec9app-b.tex | unsorted output | archived | Preserved because no deterministic pillar mapping matched |
| outputs/sec9app-c.tex | archive/unsorted/outputs/sec9app-c.tex | unsorted output | archived | Preserved because no deterministic pillar mapping matched |
| outputs/security-pillar-section.tex | archive/unsorted/outputs/security-pillar-section.tex | unsorted output | archived | Preserved because no deterministic pillar mapping matched |
| concepts/what-is-slop.md | pillars/quality/notes/concepts/what-is-slop.md | concept note | moved if tracked | Explicit curated migration rule |
| frameworks/desloppify.md | pillars/quality/notes/frameworks/desloppify.md | framework note | moved if tracked | Explicit curated migration rule |
| proposals/gsd-desloppification.md | pillars/quality/notes/proposals/gsd-desloppification.md | proposal | moved if tracked | Explicit curated migration rule |
| proposals/gsd-pain-points.md | pillars/quality/notes/proposals/gsd-pain-points.md | proposal | moved if tracked | GSD quality and slop-related proposal |
| ai-harness-abstraction-gap-research.md | pillars/abstraction/research/raw/ai-harness-abstraction-gap-research.md | raw research | moved if tracked | Explicit curated migration rule |
| concepts/harness-engineering.md | science/synthesis/concepts/harness-engineering.md | cross-pillar concept | moved if tracked | Explicit curated migration rule |
| concepts/sdd-ontology.md | science/synthesis/concepts/sdd-ontology.md | cross-pillar concept | moved if tracked | Explicit curated migration rule |
| sdd-research/Large_Language_Models_Cannot_Self-Correct_Reasoning_Yet_summary.md | pillars/reliability/research/raw/Large_Language_Models_Cannot_Self-Correct_Reasoning_Yet_summary.md | raw research | moved if tracked | Reliability-scoped reasoning self-correction research |
| Canvas Research/2026-03-17-Anthropics-Harness-Pattern-for-Multi-Context-Window-Agents.md | pillars/coordination/notes/canvases/2026-03-17-Anthropics-Harness-Pattern-for-Multi-Context-Window-Agents.md | canvas note | moved | Topic-based Canvas Research migration |
| Canvas Research/2026-03-17-Compound-Error-Rates-Why-85-Per-Step-Accuracy-Yields-20-Workflow-Success.md | pillars/reliability/notes/canvases/2026-03-17-Compound-Error-Rates-Why-85-Per-Step-Accuracy-Yields-20-Workflow-Success.md | canvas note | moved | Topic-based Canvas Research migration |
| Canvas Research/2026-03-17-LLM-as-Judge-for-Spec-Compliance-Verification.md | pillars/quality/notes/canvases/2026-03-17-LLM-as-Judge-for-Spec-Compliance-Verification.md | canvas note | moved | Topic-based Canvas Research migration |
| Canvas Research/2026-03-17-OpenAIs-Codex-Harness-1M-Lines-Without-Manual-Code.md | pillars/model-routing/notes/canvases/2026-03-17-OpenAIs-Codex-Harness-1M-Lines-Without-Manual-Code.md | canvas note | moved | Topic-based Canvas Research migration |
| Canvas Research/2026-03-17-The-Lightweight-Harness-Imperative-Build-for-Disposability.md | pillars/economics/notes/canvases/2026-03-17-The-Lightweight-Harness-Imperative-Build-for-Disposability.md | canvas note | moved | Topic-based Canvas Research migration |
| Canvas Research/2026-03-17-The-Six-Area-Spec-Framework-from-GitHubs-2500-File-Analysis.md | pillars/governance/notes/canvases/2026-03-17-The-Six-Area-Spec-Framework-from-GitHubs-2500-File-Analysis.md | canvas note | moved | Topic-based Canvas Research migration |
| canvases/desloppify.canvas | pillars/quality/notes/canvases/desloppify.canvas | canvas | moved | Topic-based canvas migration |
| canvases/harness_landscape.canvas | science/synthesis/canvases/harness_landscape.canvas | canvas | moved | Topic-based canvas migration |
| canvases/sdd-ontology.canvas | science/synthesis/canvases/sdd-ontology.canvas | canvas | moved | Topic-based canvas migration |
| canvases/test.canvas | archive/unsorted/canvases/test.canvas | canvas | moved | Low-confidence test canvas preserved in unsorted archive |
| canvases/frameworks/bmad.canvas | science/synthesis/canvases/frameworks/bmad.canvas | framework canvas | moved | Framework comparison canvas preserved in science synthesis |
| canvases/frameworks/gsd.canvas | science/synthesis/canvases/frameworks/gsd.canvas | framework canvas | moved | Framework comparison canvas preserved in science synthesis |
| canvases/frameworks/kiro.canvas | science/synthesis/canvases/frameworks/kiro.canvas | framework canvas | moved | Framework comparison canvas preserved in science synthesis |
| canvases/frameworks/openspec.canvas | science/synthesis/canvases/frameworks/openspec.canvas | framework canvas | moved | Framework comparison canvas preserved in science synthesis |
| canvases/frameworks/speckit.canvas | science/synthesis/canvases/frameworks/speckit.canvas | framework canvas | moved | Framework comparison canvas preserved in science synthesis |
| canvases/frameworks/taskmaster.canvas | science/synthesis/canvases/frameworks/taskmaster.canvas | framework canvas | moved | Framework comparison canvas preserved in science synthesis |
| main.tex | archive/root-legacy/main/main.tex | legacy root paper | archived | Former root main paper artifact |
| main.bib | archive/root-legacy/main/main.bib | legacy root paper | archived | Former root main paper artifact |
| coord-main.tex | pillars/coordination/archive/legacy/root-coord-main/coord-main.tex | legacy coordination paper | archived | Former root coordination paper artifact |
| coord-main.bib | pillars/coordination/archive/legacy/root-coord-main/coord-main.bib | legacy coordination paper | archived | Former root coordination paper artifact |
| reliability-main.tex | pillars/reliability/archive/legacy/root-reliability-main/reliability-main.tex | legacy reliability paper | archived | Former root reliability paper artifact |
| reliability.bib | pillars/reliability/archive/legacy/root-reliability-main/reliability.bib | legacy reliability paper | archived | Former root reliability paper artifact |
| 00README.json | archive/root-legacy/00README.json | legacy root metadata | archived | Explicit curated migration rule |
| Home.md | archive/root-legacy/Home.md | legacy root note | archived | Explicit curated migration rule |
| papers/abstraction-human-language-code.md | pillars/abstraction/archive/legacy/papers/abstraction-human-language-code.md | legacy paper | archived | Preserved legacy papers content |
| papers/abstraction-human-language-code.pdf | pillars/abstraction/archive/legacy/papers/abstraction-human-language-code.pdf | legacy paper | archived | Preserved legacy papers content |
| papers/abstraction-human-language-code.provenance.md | pillars/abstraction/archive/legacy/papers/abstraction-human-language-code.provenance.md | legacy paper | archived | Preserved legacy papers content |
| papers/coordination-architecture/coord-main.bib | pillars/coordination/archive/legacy/papers/coordination-architecture/coord-main.bib | legacy paper | archived | Preserved legacy papers content |
| papers/coordination-architecture/coord-main.pdf | pillars/coordination/archive/legacy/papers/coordination-architecture/coord-main.pdf | legacy paper | archived | Preserved legacy papers content |
| papers/coordination-architecture/coord-main.tex | pillars/coordination/archive/legacy/papers/coordination-architecture/coord-main.tex | legacy paper | archived | Preserved legacy papers content |
| papers/coordination-architecture/coordination-architecture-formal-r1.md | pillars/coordination/archive/legacy/papers/coordination-architecture/coordination-architecture-formal-r1.md | legacy paper | archived | Preserved legacy papers content |
| papers/coordination-architecture/coordination-architecture-formal-r2.md | pillars/coordination/archive/legacy/papers/coordination-architecture/coordination-architecture-formal-r2.md | legacy paper | archived | Preserved legacy papers content |
| papers/coordination-architecture/coordination-architecture-formal-r3.md | pillars/coordination/archive/legacy/papers/coordination-architecture/coordination-architecture-formal-r3.md | legacy paper | archived | Preserved legacy papers content |
| papers/coordination-architecture/coordination-architecture-research-r1.md | pillars/coordination/archive/legacy/papers/coordination-architecture/coordination-architecture-research-r1.md | legacy paper | archived | Preserved legacy papers content |
| papers/coordination-architecture/coordination-architecture-research-r2.md | pillars/coordination/archive/legacy/papers/coordination-architecture/coordination-architecture-research-r2.md | legacy paper | archived | Preserved legacy papers content |
| papers/coordination-architecture/coordination-architecture-research-r3.md | pillars/coordination/archive/legacy/papers/coordination-architecture/coordination-architecture-research-r3.md | legacy paper | archived | Preserved legacy papers content |
| papers/coordination-architecture/coordination-architecture-research-r4.md | pillars/coordination/archive/legacy/papers/coordination-architecture/coordination-architecture-research-r4.md | legacy paper | archived | Preserved legacy papers content |
| papers/coordination-architecture/coordination-architecture-research-r5.md | pillars/coordination/archive/legacy/papers/coordination-architecture/coordination-architecture-research-r5.md | legacy paper | archived | Preserved legacy papers content |
| papers/coordination-architecture/coordination-architecture-review.md | pillars/coordination/archive/legacy/papers/coordination-architecture/coordination-architecture-review.md | legacy paper | archived | Preserved legacy papers content |
| papers/coordination-architecture/coordination-architecture.md | pillars/coordination/archive/legacy/papers/coordination-architecture/coordination-architecture.md | legacy paper | archived | Preserved legacy papers content |
| papers/coordination-architecture/coordination-architecture.pdf | pillars/coordination/archive/legacy/papers/coordination-architecture/coordination-architecture.pdf | legacy paper | archived | Preserved legacy papers content |
| papers/coordination-architecture/coordination-architecture.provenance.md | pillars/coordination/archive/legacy/papers/coordination-architecture/coordination-architecture.provenance.md | legacy paper | archived | Preserved legacy papers content |
| papers/governance-architecture/governance-architecture-formal-r1.md | pillars/governance/archive/legacy/papers/governance-architecture/governance-architecture-formal-r1.md | legacy paper | archived | Preserved legacy papers content |
| papers/governance-architecture/governance-architecture-formal-r2.md | pillars/governance/archive/legacy/papers/governance-architecture/governance-architecture-formal-r2.md | legacy paper | archived | Preserved legacy papers content |
| papers/governance-architecture/governance-architecture-formal-r3.md | pillars/governance/archive/legacy/papers/governance-architecture/governance-architecture-formal-r3.md | legacy paper | archived | Preserved legacy papers content |
| papers/governance-architecture/governance-architecture-research-r1.md | pillars/governance/archive/legacy/papers/governance-architecture/governance-architecture-research-r1.md | legacy paper | archived | Preserved legacy papers content |
| papers/governance-architecture/governance-architecture-research-r2.md | pillars/governance/archive/legacy/papers/governance-architecture/governance-architecture-research-r2.md | legacy paper | archived | Preserved legacy papers content |
| papers/governance-architecture/governance-architecture-research-r3.md | pillars/governance/archive/legacy/papers/governance-architecture/governance-architecture-research-r3.md | legacy paper | archived | Preserved legacy papers content |
| papers/governance-architecture/governance-architecture-research-r4.md | pillars/governance/archive/legacy/papers/governance-architecture/governance-architecture-research-r4.md | legacy paper | archived | Preserved legacy papers content |
| papers/governance-architecture/governance-architecture-review.md | pillars/governance/archive/legacy/papers/governance-architecture/governance-architecture-review.md | legacy paper | archived | Preserved legacy papers content |
| papers/governance-architecture/governance-architecture.bib | pillars/governance/archive/legacy/papers/governance-architecture/governance-architecture.bib | legacy paper | archived | Preserved legacy papers content |
| papers/governance-architecture/governance-architecture.pdf | pillars/governance/archive/legacy/papers/governance-architecture/governance-architecture.pdf | legacy paper | archived | Preserved legacy papers content |
| papers/governance-architecture/governance-architecture.provenance.md | pillars/governance/archive/legacy/papers/governance-architecture/governance-architecture.provenance.md | legacy paper | archived | Preserved legacy papers content |
| papers/governance-architecture/governance-architecture.tex | pillars/governance/archive/legacy/papers/governance-architecture/governance-architecture.tex | legacy paper | archived | Preserved legacy papers content |
| papers/info-arch-coding-agents.bib | pillars/information/archive/legacy/papers/info-arch-coding-agents.bib | legacy paper | archived | Preserved legacy papers content |
| papers/info-arch-coding-agents.pdf | pillars/information/archive/legacy/papers/info-arch-coding-agents.pdf | legacy paper | archived | Preserved legacy papers content |
| papers/info-arch-coding-agents.provenance.md | pillars/information/archive/legacy/papers/info-arch-coding-agents.provenance.md | legacy paper | archived | Preserved legacy papers content |
| papers/info-arch-coding-agents.tex | pillars/information/archive/legacy/papers/info-arch-coding-agents.tex | legacy paper | archived | Preserved legacy papers content |
| papers/quality-architecture-ai-slop.bib | pillars/quality/archive/legacy/papers/quality-architecture-ai-slop.bib | legacy paper | archived | Preserved legacy papers content |
| papers/quality-architecture-ai-slop.pdf | pillars/quality/archive/legacy/papers/quality-architecture-ai-slop.pdf | legacy paper | archived | Preserved legacy papers content |
| papers/quality-architecture-ai-slop.provenance.md | pillars/quality/archive/legacy/papers/quality-architecture-ai-slop.provenance.md | legacy paper | archived | Preserved legacy papers content |
| papers/quality-architecture-ai-slop.tex | pillars/quality/archive/legacy/papers/quality-architecture-ai-slop.tex | legacy paper | archived | Preserved legacy papers content |
| papers/reliability-architecture.pdf | pillars/reliability/archive/legacy/papers/reliability-architecture.pdf | legacy paper | archived | Preserved legacy papers content |
| papers/reliability-architecture.provenance.md | pillars/reliability/archive/legacy/papers/reliability-architecture.provenance.md | legacy paper | archived | Preserved legacy papers content |
| papers/temporal-architecture.bib | pillars/temporal/archive/legacy/papers/temporal-architecture.bib | legacy paper | archived | Preserved legacy papers content |
| papers/temporal-architecture.pdf | pillars/temporal/archive/legacy/papers/temporal-architecture.pdf | legacy paper | archived | Preserved legacy papers content |
| papers/temporal-architecture.provenance.md | pillars/temporal/archive/legacy/papers/temporal-architecture.provenance.md | legacy paper | archived | Preserved legacy papers content |
| papers/temporal-architecture.tex | pillars/temporal/archive/legacy/papers/temporal-architecture.tex | legacy paper | archived | Preserved legacy papers content |
| research/de-sloppification/de-sloppification-gaps.md | pillars/quality/research/raw/research/de-sloppification/de-sloppification-gaps.md | quality research | moved | Preserved research project artifact |
| research/de-sloppification/de-sloppification-report.md | pillars/quality/research/raw/research/de-sloppification/de-sloppification-report.md | quality research | moved | Preserved research project artifact |
| research/de-sloppification/findings/axis-1-taxonomy-of-code-slop.md | pillars/quality/research/raw/research/de-sloppification/findings/axis-1-taxonomy-of-code-slop.md | quality research | moved | Preserved research project artifact |
| research/de-sloppification/findings/axis-2-pre-hoc-prevention.md | pillars/quality/research/raw/research/de-sloppification/findings/axis-2-pre-hoc-prevention.md | quality research | moved | Preserved research project artifact |
| research/de-sloppification/findings/axis-3-ad-hoc-detection.md | pillars/quality/research/raw/research/de-sloppification/findings/axis-3-ad-hoc-detection.md | quality research | moved | Preserved research project artifact |
| research/de-sloppification/findings/axis-4-post-hoc-cleanup.md | pillars/quality/research/raw/research/de-sloppification/findings/axis-4-post-hoc-cleanup.md | quality research | moved | Preserved research project artifact |
| research/de-sloppification/findings/axis-5-framework-anti-slop.md | pillars/quality/research/raw/research/de-sloppification/findings/axis-5-framework-anti-slop.md | quality research | moved | Preserved research project artifact |
| research/gsd-complaints/context.md | pillars/quality/research/raw/research/gsd-complaints/context.md | quality research | moved | Preserved research project artifact |
| research/gsd-complaints/findings/axis-1-github-issues.md | pillars/quality/research/raw/research/gsd-complaints/findings/axis-1-github-issues.md | quality research | moved | Preserved research project artifact |
| research/gsd-complaints/findings/axis-1-landscape-survey.md | pillars/quality/research/raw/research/gsd-complaints/findings/axis-1-landscape-survey.md | quality research | moved | Preserved research project artifact |
| research/gsd-complaints/findings/axis-1-taxonomy-of-code-slop.md | pillars/quality/research/raw/research/gsd-complaints/findings/axis-1-taxonomy-of-code-slop.md | quality research | moved | Preserved research project artifact |
| research/gsd-complaints/findings/axis-2-community-sentiment.md | pillars/quality/research/raw/research/gsd-complaints/findings/axis-2-community-sentiment.md | quality research | moved | Preserved research project artifact |
| research/gsd-complaints/findings/axis-2-metaprompt-patterns.md | pillars/quality/research/raw/research/gsd-complaints/findings/axis-2-metaprompt-patterns.md | quality research | moved | Preserved research project artifact |
| research/gsd-complaints/findings/axis-2-pre-hoc-prevention.md | pillars/quality/research/raw/research/gsd-complaints/findings/axis-2-pre-hoc-prevention.md | quality research | moved | Preserved research project artifact |
| research/gsd-complaints/findings/axis-3-ad-hoc-detection.md | pillars/quality/research/raw/research/gsd-complaints/findings/axis-3-ad-hoc-detection.md | quality research | moved | Preserved research project artifact |
| research/gsd-complaints/findings/axis-3-competitive-weaknesses.md | pillars/quality/research/raw/research/gsd-complaints/findings/axis-3-competitive-weaknesses.md | quality research | moved | Preserved research project artifact |
| research/gsd-complaints/findings/axis-3-pipeline-orchestration.md | pillars/quality/research/raw/research/gsd-complaints/findings/axis-3-pipeline-orchestration.md | quality research | moved | Preserved research project artifact |
| research/gsd-complaints/findings/axis-4-evaluation-benchmarks.md | pillars/quality/research/raw/research/gsd-complaints/findings/axis-4-evaluation-benchmarks.md | quality research | moved | Preserved research project artifact |
| research/gsd-complaints/findings/axis-4-onboarding-friction.md | pillars/quality/research/raw/research/gsd-complaints/findings/axis-4-onboarding-friction.md | quality research | moved | Preserved research project artifact |
| research/gsd-complaints/findings/axis-4-post-hoc-cleanup.md | pillars/quality/research/raw/research/gsd-complaints/findings/axis-4-post-hoc-cleanup.md | quality research | moved | Preserved research project artifact |
| research/gsd-complaints/findings/axis-5-framework-anti-slop.md | pillars/quality/research/raw/research/gsd-complaints/findings/axis-5-framework-anti-slop.md | quality research | moved | Preserved research project artifact |
| research/gsd-complaints/findings/axis-5-optimization-strategies.md | pillars/quality/research/raw/research/gsd-complaints/findings/axis-5-optimization-strategies.md | quality research | moved | Preserved research project artifact |
| research/gsd-complaints/findings/followup-1-human-ai-discussion.md | pillars/quality/research/raw/research/gsd-complaints/findings/followup-1-human-ai-discussion.md | quality research | moved | Preserved research project artifact |
| research/gsd-complaints/gaps.md | pillars/quality/research/raw/research/gsd-complaints/gaps.md | quality research | moved | Preserved research project artifact |
| research/gsd-complaints/plan.md | pillars/quality/research/raw/research/gsd-complaints/plan.md | quality research | moved | Preserved research project artifact |
| research/gsd-complaints/report.md | pillars/quality/research/raw/research/gsd-complaints/report.md | quality research | moved | Preserved research project artifact |
| research/gsd-complaints/state.json | pillars/quality/research/raw/research/gsd-complaints/state.json | quality research | moved | Preserved research project artifact |
| research/harness-frameworks/context.md | science/synthesis/research/research/harness-frameworks/context.md | cross-pillar research | moved | Preserved research project artifact |
| research/harness-frameworks/findings/axis-1-landscape-survey.md | science/synthesis/research/research/harness-frameworks/findings/axis-1-landscape-survey.md | cross-pillar research | moved | Preserved research project artifact |
| research/harness-frameworks/findings/axis-2-metaprompt-patterns.md | science/synthesis/research/research/harness-frameworks/findings/axis-2-metaprompt-patterns.md | cross-pillar research | moved | Preserved research project artifact |
| research/harness-frameworks/findings/axis-3-pipeline-orchestration.md | science/synthesis/research/research/harness-frameworks/findings/axis-3-pipeline-orchestration.md | cross-pillar research | moved | Preserved research project artifact |
| research/harness-frameworks/findings/axis-4-evaluation-benchmarks.md | science/synthesis/research/research/harness-frameworks/findings/axis-4-evaluation-benchmarks.md | cross-pillar research | moved | Preserved research project artifact |
| research/harness-frameworks/findings/axis-5-optimization-strategies.md | science/synthesis/research/research/harness-frameworks/findings/axis-5-optimization-strategies.md | cross-pillar research | moved | Preserved research project artifact |
| research/harness-frameworks/findings/followup-1-human-ai-discussion.md | science/synthesis/research/research/harness-frameworks/findings/followup-1-human-ai-discussion.md | cross-pillar research | moved | Preserved research project artifact |
| research/harness-frameworks/findings/followup-2-practical-harness-ecosystem.md | science/synthesis/research/research/harness-frameworks/findings/followup-2-practical-harness-ecosystem.md | cross-pillar research | moved | Preserved research project artifact |
| research/harness-frameworks/harness-frameworks-gaps.md | science/synthesis/research/research/harness-frameworks/harness-frameworks-gaps.md | cross-pillar research | moved | Preserved research project artifact |
| research/harness-frameworks/harness-frameworks-report.md | science/synthesis/research/research/harness-frameworks/harness-frameworks-report.md | cross-pillar research | moved | Preserved research project artifact |
| research/harness-frameworks/plan.md | science/synthesis/research/research/harness-frameworks/plan.md | cross-pillar research | moved | Preserved research project artifact |
| sdd-research/.research/context.md | archive/unsorted/sdd-research/.research/context.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/.research/findings/axis-1-core-agent-loops.md | archive/unsorted/sdd-research/.research/findings/axis-1-core-agent-loops.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/.research/findings/axis-2-multi-agent-coordination.md | archive/unsorted/sdd-research/.research/findings/axis-2-multi-agent-coordination.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/.research/findings/axis-3-planning-decomposition.md | archive/unsorted/sdd-research/.research/findings/axis-3-planning-decomposition.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/.research/findings/axis-4-execution-verification-recovery.md | archive/unsorted/sdd-research/.research/findings/axis-4-execution-verification-recovery.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/.research/findings/axis-5-context-memory.md | archive/unsorted/sdd-research/.research/findings/axis-5-context-memory.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/.research/findings/axis-6-tool-systems.md | archive/unsorted/sdd-research/.research/findings/axis-6-tool-systems.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/.research/findings/axis-7-developer-ergonomics.md | archive/unsorted/sdd-research/.research/findings/axis-7-developer-ergonomics.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/.research/findings/followup-1-convergence-maturity.md | archive/unsorted/sdd-research/.research/findings/followup-1-convergence-maturity.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/.research/findings/followup-2-adk-strands-a2a.md | archive/unsorted/sdd-research/.research/findings/followup-2-adk-strands-a2a.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/.research/gaps.md | archive/unsorted/sdd-research/.research/gaps.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/.research/plan.md | archive/unsorted/sdd-research/.research/plan.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/.research/report.md | archive/unsorted/sdd-research/.research/report.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/.research/state.json | archive/unsorted/sdd-research/.research/state.json | unsorted research | moved | Preserved research project artifact |
| sdd-research/sdd-research/.research/brief.md | archive/unsorted/sdd-research/sdd-research/.research/brief.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/sdd-research/.research/context.md | archive/unsorted/sdd-research/sdd-research/.research/context.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/sdd-research/.research/findings/axis-1-tool-landscape.md | archive/unsorted/sdd-research/sdd-research/.research/findings/axis-1-tool-landscape.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/sdd-research/.research/findings/axis-2-workflow-pipelines.md | archive/unsorted/sdd-research/sdd-research/.research/findings/axis-2-workflow-pipelines.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/sdd-research/.research/findings/axis-3-spec-formats.md | archive/unsorted/sdd-research/sdd-research/.research/findings/axis-3-spec-formats.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/sdd-research/.research/findings/axis-4-quality-guardrails.md | archive/unsorted/sdd-research/sdd-research/.research/findings/axis-4-quality-guardrails.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/sdd-research/.research/findings/axis-5-prompt-engineering.md | archive/unsorted/sdd-research/sdd-research/.research/findings/axis-5-prompt-engineering.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/sdd-research/.research/findings/axis-6-extensibility.md | archive/unsorted/sdd-research/sdd-research/.research/findings/axis-6-extensibility.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/sdd-research/.research/findings/axis-7-community-feedback.md | archive/unsorted/sdd-research/sdd-research/.research/findings/axis-7-community-feedback.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/sdd-research/.research/findings/followup-1-prompt-templates.md | archive/unsorted/sdd-research/sdd-research/.research/findings/followup-1-prompt-templates.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/sdd-research/.research/findings/followup-2-bmad-architecture.md | archive/unsorted/sdd-research/sdd-research/.research/findings/followup-2-bmad-architecture.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/sdd-research/.research/gaps.md | archive/unsorted/sdd-research/sdd-research/.research/gaps.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/sdd-research/.research/plan.md | archive/unsorted/sdd-research/sdd-research/.research/plan.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/sdd-research/.research/report.md | archive/unsorted/sdd-research/sdd-research/.research/report.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/sdd-research/.research/state.json | archive/unsorted/sdd-research/sdd-research/.research/state.json | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/.research/context.md | archive/unsorted/sdd-research/workflow-research/.research/context.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/.research/findings/axis-1-core-agent-loops.md | archive/unsorted/sdd-research/workflow-research/.research/findings/axis-1-core-agent-loops.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/.research/findings/axis-2-multi-agent-coordination.md | archive/unsorted/sdd-research/workflow-research/.research/findings/axis-2-multi-agent-coordination.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/.research/findings/axis-3-planning-decomposition.md | archive/unsorted/sdd-research/workflow-research/.research/findings/axis-3-planning-decomposition.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/.research/findings/axis-4-execution-verification-recovery.md | archive/unsorted/sdd-research/workflow-research/.research/findings/axis-4-execution-verification-recovery.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/.research/findings/axis-5-context-memory.md | archive/unsorted/sdd-research/workflow-research/.research/findings/axis-5-context-memory.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/.research/findings/axis-6-tool-systems.md | archive/unsorted/sdd-research/workflow-research/.research/findings/axis-6-tool-systems.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/.research/findings/axis-7-developer-ergonomics.md | archive/unsorted/sdd-research/workflow-research/.research/findings/axis-7-developer-ergonomics.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/.research/findings/followup-1-convergence-maturity.md | archive/unsorted/sdd-research/workflow-research/.research/findings/followup-1-convergence-maturity.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/.research/findings/followup-2-adk-strands-a2a.md | archive/unsorted/sdd-research/workflow-research/.research/findings/followup-2-adk-strands-a2a.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/.research/gaps.md | archive/unsorted/sdd-research/workflow-research/.research/gaps.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/.research/plan.md | archive/unsorted/sdd-research/workflow-research/.research/plan.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/.research/report.md | archive/unsorted/sdd-research/workflow-research/.research/report.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/.research/state.json | archive/unsorted/sdd-research/workflow-research/.research/state.json | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/context.md | archive/unsorted/sdd-research/workflow-research/context.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/findings/axis-1-core-agent-loops.md | archive/unsorted/sdd-research/workflow-research/findings/axis-1-core-agent-loops.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/findings/axis-2-multi-agent-coordination.md | archive/unsorted/sdd-research/workflow-research/findings/axis-2-multi-agent-coordination.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/findings/axis-3-planning-decomposition.md | archive/unsorted/sdd-research/workflow-research/findings/axis-3-planning-decomposition.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/findings/axis-4-execution-verification-recovery.md | archive/unsorted/sdd-research/workflow-research/findings/axis-4-execution-verification-recovery.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/findings/axis-5-context-memory.md | archive/unsorted/sdd-research/workflow-research/findings/axis-5-context-memory.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/findings/axis-6-tool-systems.md | archive/unsorted/sdd-research/workflow-research/findings/axis-6-tool-systems.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/findings/axis-7-developer-ergonomics.md | archive/unsorted/sdd-research/workflow-research/findings/axis-7-developer-ergonomics.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/findings/followup-1-convergence-maturity.md | archive/unsorted/sdd-research/workflow-research/findings/followup-1-convergence-maturity.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/findings/followup-2-adk-strands-a2a.md | archive/unsorted/sdd-research/workflow-research/findings/followup-2-adk-strands-a2a.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/gaps.md | archive/unsorted/sdd-research/workflow-research/gaps.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/plan.md | archive/unsorted/sdd-research/workflow-research/plan.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/report.md | archive/unsorted/sdd-research/workflow-research/report.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/sdd-research/.research/context.md | archive/unsorted/sdd-research/workflow-research/sdd-research/.research/context.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/sdd-research/.research/findings/axis-1-core-agent-loops.md | archive/unsorted/sdd-research/workflow-research/sdd-research/.research/findings/axis-1-core-agent-loops.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/sdd-research/.research/findings/axis-2-multi-agent-coordination.md | archive/unsorted/sdd-research/workflow-research/sdd-research/.research/findings/axis-2-multi-agent-coordination.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/sdd-research/.research/findings/axis-3-planning-decomposition.md | archive/unsorted/sdd-research/workflow-research/sdd-research/.research/findings/axis-3-planning-decomposition.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/sdd-research/.research/findings/axis-4-execution-verification-recovery.md | archive/unsorted/sdd-research/workflow-research/sdd-research/.research/findings/axis-4-execution-verification-recovery.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/sdd-research/.research/findings/axis-5-context-memory.md | archive/unsorted/sdd-research/workflow-research/sdd-research/.research/findings/axis-5-context-memory.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/sdd-research/.research/findings/axis-6-tool-systems.md | archive/unsorted/sdd-research/workflow-research/sdd-research/.research/findings/axis-6-tool-systems.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/sdd-research/.research/findings/axis-7-developer-ergonomics.md | archive/unsorted/sdd-research/workflow-research/sdd-research/.research/findings/axis-7-developer-ergonomics.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/sdd-research/.research/findings/followup-1-convergence-maturity.md | archive/unsorted/sdd-research/workflow-research/sdd-research/.research/findings/followup-1-convergence-maturity.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/sdd-research/.research/findings/followup-2-adk-strands-a2a.md | archive/unsorted/sdd-research/workflow-research/sdd-research/.research/findings/followup-2-adk-strands-a2a.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/sdd-research/.research/gaps.md | archive/unsorted/sdd-research/workflow-research/sdd-research/.research/gaps.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/sdd-research/.research/plan.md | archive/unsorted/sdd-research/workflow-research/sdd-research/.research/plan.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/sdd-research/.research/report.md | archive/unsorted/sdd-research/workflow-research/sdd-research/.research/report.md | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/sdd-research/.research/state.json | archive/unsorted/sdd-research/workflow-research/sdd-research/.research/state.json | unsorted research | moved | Preserved research project artifact |
| sdd-research/workflow-research/state.json | archive/unsorted/sdd-research/workflow-research/state.json | unsorted research | moved | Preserved research project artifact |
