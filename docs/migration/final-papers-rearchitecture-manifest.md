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
