# AGENTS.md

## 1. Workflow & Todo Protocol

- **Mandatory Initialization**: Initialize a phased todo list via `todo(op="init", ...)` before any file edit, research, or command execution.
- **Strict Transition**: Execute item-by-item, mark `done` immediately upon completion, and advance in the same turn. Batch todo updates with real work.
- **Phase Locking**:
  - **RESEARCH**: Read-only evidence gathering.
  - **INNOVATE**: Explore architecture and trade-offs; defer implementation decisions.
  - **PLAN**: Produce concrete specifications; obtain explicit approval before execution.
  - **EXECUTE**: Implement strictly against the approved plan.
  - **UPDATE PROCESS**: Document learnings, sync SSOTs, and verify.

## 2. System Structure & Directory Invariants

- **Structure Reference**: Consult `000_System_Structure.md` for directory layout mapping.
- **2-Level Depth Limit**:
  - `30_Resources/` (`Concepts/`, `Methods/`, `Tech/`): Keep notes flat inside 2nd-level domain folders (e.g., `Concepts/Computer_Science/<Note>.md`).
  - `10_Projects/<Project_Name>/`: Place domain folders directly under the project root (`Architecture/`, `Auth/`, `Database/`, `DevOps/`, `Workflows/`, `Testing/`). Keep notes flat inside them.
- **Clean Markdown**: Produce emoji-free, icon-free, professional markdown across all notes, headings, and code blocks.
- **Structure Maintenance**: Update `000_System_Structure.md` whenever adding or refactoring core directories.

## 3. Tag Taxonomy SSOT

- **SSOT Authority**: Follow `99_Meta/Tag_Taxonomy_SSOT.md` for all frontmatter `tags`.
- **Pre-declaration Invariant**: Declare any new tag in `99_Meta/Tag_Taxonomy_SSOT.md` before applying it to notes.

## 4. Atomic Note Standard

- **Single Responsibility**: One note = One idea. Split multi-topic notes into dedicated atomic files.
- **Naming**: Use `Pascal_Snake_Case.md` for all note filenames (e.g., `First_Principles_Thinking.md`).
- **Terminology**: Use standard English technical terms directly inline. Maintain explanations in clear, developer-friendly Vietnamese. Keep technical terms unadorned (omit parenthetical translations).
- **Classification (Litmus Test)**:
  - `30_Resources/Methods/` (Actionable): Checklists, SOPs, workflows, step-by-step guides, code templates.
  - `30_Resources/Concepts/` (Cognitive): Definitions, theories, mental models, core mechanics.
- **Note Anatomy**:
  1. **Frontmatter YAML**: `tags`, `date` (YYYY-MM-DD), `aliases`, `description`.
  2. **TL;DR**: 2-3 concise punchy bullets (`- **Bản chất**: ...`, `- **Mục đích**: ...`, `- **Điểm mấu chốt**: ...`) delivering instant signal without fluff.
  3. **Core Concept / Rules / Rationales**: Bulleted mechanics, principles, or step-by-step procedures.
  4. **Concrete Examples / Implementation**: Minimal code snippets, comparisons, or practical cases.
  5. **Contextual & Hub Linking**: Embed inline links (`[[Note_Title]]`) directly within explanatory text; provide structural index links under `## Related Notes`.
- **Quality Gate**: Run `bun 99_Meta/Scripts/validate_notes.mjs` after creating or updating notes. Pass with zero errors.

## 5. Socratic Mentorship & Scaffolding

- **Scaffolding-First Guidance**: When mentoring or assisting with drills, provide structural boilerplate with `TODO` markers. Prompt the user to implement and verify core logic independently.

## 6. Execution Efficiency

- **Context Preservation**: Spawn subagents only on explicit user request for delegation or parallel workflows.
- **Signal-Dense Handoff**: Pass only relevant file paths and compact context. Synthesize outcomes directly.
