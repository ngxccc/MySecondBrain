# Personal Knowledge Management (PKM) - Second Brain

Centralized repository and cognitive workbench structured on a modified **PARA Method** (Inbox, Projects, Areas, Resources, Archives, Flashcards, Meta) combined with **Zettelkasten** linking principles.

Primary mission: Accelerate career progression toward senior-level **Backend Engineering**, while anchoring systems thinking, English proficiency, and financial independence through verified atomic notes and executable roadmaps.

---

## Vault Architecture (Modified PARA)

Enforces a strict **2-level folder depth limit** across resources and projects to balance structural clarity with friction-free retrieval:

- **`00_Inbox/` (Capture)**: Temporary holding area for raw thoughts, drafts, and unprocessed web clippings. Triaged weekly.
- **`10_Projects/` (Active & Time-bound)**: Active initiatives with concrete deliverables and deadlines. Subdirectories sit flat under the project root (`Architecture/`, `Auth/`, `Database/`, `DevOps/`, `Workflows/`, `Testing/`).
- **`20_Areas/` (Long-term Standards)**: Ongoing domains of responsibility without terminal end-dates:
  - `Daily_Logs/`: Standardized daily logs tracking focus, blockers, and cognitive reflections.
  - `Finances/`: Investment strategies, financial migration plans, and capital allocation models.
  - `Learning/`: Learner profiles, diagnostic tracking, and skill progression logs.
- **`30_Resources/` (Evergreen Knowledge)**: Curated, reusable reference library of atomic notes:
  - `Tech/`: Domain-specific engineering knowledge (`Architecture_and_Patterns/`, `API_and_Data_Design/`, `Frameworks_and_Ecosystem/`, `Infrastructure_and_Cloud/`, `Language_and_Core/`, `Web_Client_and_Security/`).
  - `Concepts/`: Fundamental theories and mental models (`Academic_and_Case_Studies/`, `Computer_Science/`, `Finance_and_Economics/`, `Knowledge_Management/`, `Learning_and_Linguistics/`, `Negotiation_and_Communication/`, `Product_and_Business_Mindsets/`, `Psychology_and_Mental_Models/`, `Software_Testing/`).
  - `Methods/`: Actionable SOPs, execution frameworks, and roadmaps (`Engineering/`, `Learning_and_Cognition/`, `Finance/`).
  - `Life/`: Evidence-backed research on physiology, sleep, and lifestyle optimization (`Health_and_Dermatology/`, `Sleep_and_Recovery/`).
  - `Excalidraw/`: Visual architecture diagrams and mental model sketches.
- **`40_Archives/` (Cold Storage)**: Completed projects, deprecated standards, and inactive reference material.
- **`50_Flashcards/` (Spaced Repetition)**: Anki-synchronized decks via Yanki:
  - `Vocabulary/`: CEFR-graded word family matrices and technical terminology.
  - `Grammar/`: Tactical sentence formulas, cues, and pronunciation rules.
- **`99_Meta/` (System Governance)**: System templates, Tag SSOT, and automated validation scripts.

---

## Core Roadmaps & Strategic Anchors

Key roadmap documents driving technical engineering, problem-solving, and continuous learning:

| Roadmap / Guide                     | File Path                                                                                                                           | Focus & Core Objective                                                                                           |
| :---------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------- |
| **Master SSOT & Roadmap**           | [`Master_Backend_Engineering_SSOT.md`](30_Resources/Methods/Engineering/Master_Backend_Engineering_SSOT.md)                         | Single Source of Truth (SSOT), 4-Layer Cognitive Stack, and master development pipeline for Backend Engineering. |
| **System Design**                   | [`System_Design_Architecture_Roadmap.md`](30_Resources/Methods/Engineering/System_Design_Architecture_Roadmap.md)                   | Scalable architecture roadmap: single-node limits, caching, rate limiting, and event-driven architectures.       |
| **SQL & Database Benchmarking**     | [`Postgres_SQL_Performance_Benchmarking_Guide.md`](30_Resources/Methods/Engineering/Postgres_SQL_Performance_Benchmarking_Guide.md) | Indexing mechanics, `EXPLAIN ANALYZE` decomposition, cursor pagination, and benchmarking with `k6`.              |
| **LeetCode & Algorithmic Patterns** | [`LeetCode_Pattern_Mastery_Roadmap.md`](30_Resources/Methods/Engineering/LeetCode_Pattern_Mastery_Roadmap.md)                       | Pattern-recognition roadmap covering 15 core algorithmic patterns (Blind 75, NeetCode 150).                      |
| **Data Structures & Algorithms**    | [`Data_Structures_and_Algorithms_Roadmap.md`](30_Resources/Methods/Engineering/Data_Structures_and_Algorithms_Roadmap.md)           | Algorithmic complexity, core data structure mechanics, and memory trade-offs.                                    |
| **Mental Models & Problem Solving** | [`Problem_Solving_Mental_Model_Pipeline.md`](30_Resources/Methods/Learning_and_Cognition/Problem_Solving_Mental_Model_Pipeline.md)  | 5-step Decision Engine translating abstract mental models into actionable cognitive pipelines.                   |
| **TOEIC Self-Study Roadmap**        | [`TOEIC_Self_Study_Roadmap_0_To_900.md`](30_Resources/Methods/Learning_and_Cognition/TOEIC_Self_Study_Roadmap_0_To_900.md)          | Milestone-driven 0 to 900+ roadmap for standardized English proficiency.                                         |
| **System Structure Guide**          | [`000_System_Structure.md`](000_System_Structure.md)                                                                                | Directory mapping, folder conventions, and structural invariants across the vault.                               |

---

## Maps of Content (MOCs) & Discovery

Dynamic indexes organizing atomic notes by domain:

- **Engineering & Architecture**: [`000_Tech_MOC.md`](30_Resources/Tech/000_Tech_MOC.md)
- **Concepts & Mental Models**: [`000_Concepts_MOC.md`](30_Resources/Concepts/000_Concepts_MOC.md)
- **Methods & Standard Operating Procedures**: [`000_Methods_MOC.md`](30_Resources/Methods/000_Methods_MOC.md)

---

## System Governance & Quality Gate

To preserve vault integrity, prevent entropy, and enforce standards:

1. **System Directives**: `AGENTS.md` defines mandatory agent protocols, phase locking, and scaffolding rules.
2. **Tag Taxonomy SSOT**: `99_Meta/Tag_Taxonomy_SSOT.md` is the single source of truth for all metadata tags.
3. **Automated Quality Gate**: Run the validator before committing or syncing notes:

```bash
bun 99_Meta/Scripts/validate_notes.mjs
```

The validator verifies frontmatter metadata, required heading structures (`## TL;DR`, `## Core Concept`, `## Related Notes`), internal links, and tag declarations against the SSOT.
