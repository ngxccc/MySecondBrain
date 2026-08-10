# Personal Knowledge Management (PKM) - Second Brain

Welcome to the Personal Knowledge Management system (Second Brain). This vault is structured based on a modified version of the **PARA Method** (Inbox, Projects, Areas, Resources, Archives, Flashcards, Meta) designed to organize life, career, personal finance, and academic study. It functions as a centralized repository for daily logs, personal development, academic research, and engineering notes.

The primary objective of this Second Brain is to accelerate career progression toward becoming a professional **Backend Engineer** while tracking long-term growth in systems thinking, English proficiency, and financial independence.

---

## Vault Architecture (Modified PARA Structure)

This vault utilizes a modified PARA structure to balance clean classification with actionability. The following is a detailed map of all primary directories:

- **`00_Inbox/` (Capture):** The entry point of the vault. Temporary holding area for capturing quick notes, raw thoughts, and unprocessed web clippings. Files are reviewed and processed weekly into their respective folders.
- **`10_Projects/` (Active & Time-bound):** Contains documents for current projects with specific goals and deadlines (e.g., active academic/commercial projects, specific feature designs). Once completed, project folders are moved to `40_Archives`.
- **`20_Areas/` (Long-Term Responsibilities):** Areas of ongoing responsibility without specific deadlines.
  - `Daily_Logs/`: Standardized journals recording daily tasks, reflections, and learnings.
  - `Finances/`: Strategic personal finance tracking, investment planning, and cashflow management.
  - `Learning/`: Long-term tracking for general learning, including the English learning profile.
- **`30_Resources/` (Knowledge & References):** A reusable reference library containing atomic notes, conceptual diagrams, and operational standards.
  - `Tech/`: Classified engineering knowledge across 6 domains:
    - `Architecture_and_Patterns/`: Architectural paradigms (SOLID, Clean Architecture, DDD, DI).
    - `Language_and_Core/`: Programming language concepts (TypeScript, Go memory management).
    - `Web_Client_and_Security/`: Web protocols, client-side encryption, SEO optimization.
    - `Infrastructure_and_Cloud/`: Edge computing, serverless architectures, terminal tools.
    - `API_and_Data_Design/`: DB naming conventions, cursor pagination, index optimizations.
    - `Frameworks_and_Ecosystem/`: Next.js features, Turborepo, WinForms layouts.
  - `Concepts/`: General domain concepts grouped into:
    - `Learning_and_Linguistics/`: Spaced repetition models, linguistics methods.
    - `Knowledge_Management/`: Methodological notes like Zettelkasten and MOC guidelines.
    - `Finance_and_Economics/`: Theoretical finance foundations.
    - `Psychology_and_Mental_Models/`: Critical thinking models (systems thinking, inversion).
  - `Methods/`: Standard Operating Procedures (SOPs), roadmaps, and actionable thinking frameworks (e.g., DCA, STAR method).
  - `Vocabulary/`: English dictionaries and specialized IT terminology.
  - `Life/`: Scientific research on health, sleep, and lifestyle.
- **`40_Archives/` (Cold Storage):** Read-only folder for completed projects or deprecated assets. Kept for retrospective reference.
- **`50_Flashcards/` (Spaced Repetition Decks):** Flashcards managed and synchronized with Anki via the plugin `Yanki`.
  - `Vocabulary/`: Sorted by CEFR level (A1 to C2) and specific fields (Software Engineering, Professional Communication).
  - `Grammar/`: Tactical grammar rules (technical phrasing, question structures, parts of speech).
- **`99_Meta/` (System Configurations):** Administrative configurations, templates, and automation scripts (e.g., note validator).

---

## 🎯 Executive Summary & Core Roadmaps

The vault revolves around seven core roadmap notes that drive the user's technical and personal growth. These are linked below:

| Roadmap / Guide                     | File Path                                                                                                               | Focus & Core Objective                                                                                                                                                                                   |
| :---------------------------------- | :---------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Master Roadmap**                  | [`Backend_Engineering_Mastery_Pipeline.md`](30_Resources/Methods/Backend_Engineering_Mastery_Pipeline.md)               | A 4-month intensive development pipeline (August - December 2026) integrating circadian rhythm optimization, Calisthenics, and advanced Backend technologies (NestJS, PostgreSQL, Redis, System Design). |
| **System Design**                   | [`System_Design_Architecture_Roadmap.md`](30_Resources/Methods/System_Design_Architecture_Roadmap.md)                   | Architectural roadmap covering single-node limitations, enterprise middleware (caching, rate limiting), and event-driven architectures.                                                                  |
| **SQL & Database Performance**      | [`Postgres_SQL_Performance_Benchmarking_Guide.md`](30_Resources/Methods/Postgres_SQL_Performance_Benchmarking_Guide.md) | Evidence-based indexing analysis, execution plan decomposition (`EXPLAIN ANALYZE`), cursor-based pagination, and performance benchmarking using `k6`.                                                    |
| **LeetCode & DSA**                  | [`LeetCode_Pattern_Mastery_Roadmap.md`](30_Resources/Methods/LeetCode_Pattern_Mastery_Roadmap.md)                       | A pattern-recognition roadmap based on Blind 75, NeetCode 150, and Striver Sheets, targeting 15 core algorithmic patterns.                                                                               |
| **Mental Models & Problem Solving** | [`Problem_Solving_Mental_Model_Pipeline.md`](30_Resources/Methods/Problem_Solving_Mental_Model_Pipeline.md)             | A 5-step Decision Engine converting theoretical thinking models into actionable cognitive workflows.                                                                                                     |
| **TOEIC Self-Study Roadmap**        | [`TOEIC_Self_Study_Roadmap_0_To_900.md`](30_Resources/Methods/TOEIC_Self_Study_Roadmap_0_To_900.md)                     | Structured self-study roadmap from 0 to 900+ TOEIC score focusing on listening & reading strategies.                                                                                                     |
| **Data Structures & Algorithms**    | [`Data_Structures_and_Algorithms_Roadmap.md`](30_Resources/Methods/Data_Structures_and_Algorithms_Roadmap.md)           | Core DSA roadmap covering fundamental data structures, algorithm complexity, and problem-solving techniques.                                                                                             |
| **System Architecture Guide**       | [`000_System_Structure.md`](000_System_Structure.md)                                                                    | Authoritative structure document detailing the directory layout, naming rules, and processing workflows within this Second Brain.                                                                        |

---

## 🛠️ Actionable Methods Directory Overview

All actionable frameworks are indexed in the [`000_Methods_MOC.md`](30_Resources/Methods/000_Methods_MOC.md). Primary pillars include:

### 1. Thinking & Problem Solving

- [`First_Principles_Thinking.md`](30_Resources/Methods/First_Principles_Thinking.md): Breaking complex systems down to atomic truths.
- [`Socratic_Questioning_Method.md`](30_Resources/Methods/Socratic_Questioning_Method.md): Six-part logical inquiry to deconstruct assumptions.
- [`Top_University_Mindset.md`](30_Resources/Methods/Top_University_Mindset.md): Rigorous academic research and source attribution standard.
- [`Mental_Model_Automation_Method.md`](30_Resources/Methods/Mental_Model_Automation_Method.md): Deliberate practice to transition mental models into speech patterns.

### 2. Engineering & Project Management

- [`Standard_Project_Timeline_SOP.md`](30_Resources/Methods/Standard_Project_Timeline_SOP.md): Standardized 16-week timeline for project delivery.
- [`Agile_Management_via_GitHub.md`](30_Resources/Methods/Agile_Management_via_GitHub.md): SOP for GitHub Kanban boards, epics, and milestones.
- [`WBS_Best_Practices.md`](30_Resources/Methods/WBS_Best_Practices.md): Work Breakdown Structure techniques for task decomposition.
- [`Local_Stress_Testing_Benchmark.md`](30_Resources/Methods/Local_Stress_Testing_Benchmark.md): Load testing paradigms on local hardware.

### 3. Career & Communication

- [`STAR_Method_Tech.md`](30_Resources/Methods/STAR_Method_Tech.md): Behavioral interview storytelling framework.
- [`IELTS_Simon_Writing_Method.md`](30_Resources/Methods/IELTS_Simon_Writing_Method.md): Writing strategy for IELTS task logic.
- [`TOEIC_Self_Study_Roadmap_0_To_900.md`](30_Resources/Methods/TOEIC_Self_Study_Roadmap_0_To_900.md): Roadmap for standardized English exam preparation.

---

## 🔒 System Maintenance & Validation

To keep the Second Brain clean and maintain structural integrity, a custom validation script scans notes in `20_Areas/` and `30_Resources/` to enforce templates, link patterns, and schema validity.

### Running Validation

To run the automated validator, execute the following command in the root folder:

```bash
bun 99_Meta/Scripts/validate_notes.mjs
```

This script evaluates:

- Note category structures (Concepts, Methods, Guides, Projects, etc.).
- Presence of required heading sections.
- Metadata fields (tags, date formats, aliases).
- Broken internal wikilinks.

Ensure zero errors are present before committing changes or sync'ing the vault.
