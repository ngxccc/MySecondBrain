# AGENTS.md

## CRITICAL DIRECTIVE: ALWAYS INITIALIZE & FOLLOW TODO

- **Mandatory Todo Initialization**: For any non-trivial or multi-step task, you MUST immediately initialize a phased todo list using the `todo` tool, or extract the checklist/todos from the active plan file.
- **Strict Comply & Transition**: Follow the todo list item-by-item. Mark tasks as completed (`done`) immediately after completing them, and transition to the next task in the same turn.
- **No Bypass**: Never start editing files, researching, or running commands without first establishing the todo list. This rule takes absolute precedence over all other protocols.

## Key Principles

### Phase Locking

Each mode has strict boundaries:

- RESEARCH: Read-only, gather facts
- INNOVATE: Discuss possibilities, no decisions
- PLAN: Write spec only, no implementation
- EXECUTE: Implement approved plan only
- UPDATE PROCESS: Document learnings, archive

### Safety

- Never skip directly to implementation for substantial work
- Never modify files in RESEARCH or INNOVATE
- Never start EXECUTE without explicit approval
- Always preserve user agency at phase transitions

### System Structure

- **System Structure Reference**: All AI agents and systems MUST read `000_System_Structure.md` at the beginning of a task to understand the exact organization and directories of this Second Brain.
- **Tag Taxonomy SSOT**: All AI agents MUST strictly comply with `99_Meta/Tag_Taxonomy_SSOT.md` for YAML frontmatter tags. NEVER use arbitrary or undeclared tags in any note. If a new tag is genuinely required, the AI MUST explicitly declare and document it in `99_Meta/Tag_Taxonomy_SSOT.md` FIRST before applying it.
- **No Emojis or Icons**: All AI agents MUST NOT use emojis or icons anywhere in the Second Brain (including titles, headings, MOCs, dashboards, code blocks, or note bodies) unless explicitly requested by the user. Keep all Markdown text clean, professional, and emoji-free.
- **Maintain & Update**: Any task that introduces a structural change, creates a new core folder, or deprecates an existing directory MUST immediately update `000_System_Structure.md` to ensure it remains the source of truth.

### Atomic Notes & Terminology Guidelines

- **Atomic Note Definition**: An atomic note is a highly focused, self-contained piece of knowledge dedicated to **exactly one concept or idea**.
- **Technical Terminology & No Parenthetical Translations**:
  - All technical terms, design patterns, computer science concepts, and section headers MUST remain directly in standard English (e.g. `Dynamic Auto-Query`, `Black-Box Testing`, `B+ Tree Index`, `Software Testing Life Cycle`, `Layer 1: Core Mechanics & Memory`).
  - **NEVER append Vietnamese translations in parentheses** next to standard English terms or titles (e.g. NEVER write `(Tự Động Quét Theo Thư Mục & Tag)`, `(Kiểm Thử Hộp Đen)`, `(Cấu Trúc Cây B+)`, or `(Ví Dụ...)`).
  - Write explanations in natural, developer-friendly Vietnamese with standard English technical terms used directly inline.
- **Core Constraints for Atomic Notes**:
  - **Single Responsibility**: One note = One idea. If a note starts addressing multiple distinct topics, refactor and split it.
  - **File Naming**: All atomic note filenames MUST use **Pascal_Snake_Case** (e.g., `First_Principles_Thinking.md`, `Systems_Thinking.md`). Do not use lowercase snake_case, camelCase, or spaces.
  - **Structured Layout & Linking Rules**: Every atomic note MUST follow a consistent structure:
    1. **Frontmatter YAML**: Include `tags` (e.g. `[type/concept, topic/...]`), `date` (YYYY-MM-DD), `aliases`, and `description`.
    2. **TL;DR**: A 2-3 sentence high-level summary at the top.
    3. **Core Concept / Rules / Rationales**: The heart of the note explaining the concept simply with bullet points.
    4. **Concrete Examples**: Short code snippets or practical comparisons.
    5. **Related Notes**: Backlinks (`[[Link]]`) connecting it to MOCs and sibling concepts.
  - **Inline Contextual Linking (Recommended)**: Emphasize **Inline Linking** (`[[Note_Title]]`) directly within paragraphs, tables, and explanations at the exact spot where a related concept is mentioned. This enables immediate navigation without scrolling to the bottom. The `## Related Notes` section at the bottom remains as a structural index/hub.
  - **Simplification**: Write explanations in a simple, direct, developer-friendly tone (using clear Vietnamese with standard English terms inline). Avoid copying and pasting large walls of text; synthesize and write in your own words.
  - **Note Classification (Litmus Test)**: Classify notes based on Actionability vs Cognition:
    - If it contains checklists, step-by-step guidelines, code templates, or scripts -> Place under `30_Resources/Methods/`.
    - If it contains definitions, theory, origins, or mental models -> Place under `30_Resources/Concepts/`.
  - **Quality Verification**: After creating or updating any note, you MUST run `bun 99_Meta/Scripts/validate_notes.mjs` to verify its structure and content quality. No note should be committed with validation errors.

### Efficiency

- Use subagents to isolate context when the user explicitly asks for delegation, parallel agent work, or a mode-specific agent
- Pass only relevant files
- Summarize rather than duplicate
- Reuse existing plans and context
