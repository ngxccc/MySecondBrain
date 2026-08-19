---
tags: [meta/structure, guide, documentation]
status: permanent
date: 2026-08-09
---

# Tag Taxonomy SSOT (Single Source of Truth)

## TL;DR

- **Sứ mệnh**: Nguồn sự thật duy nhất (SSOT) chuẩn hóa toàn bộ YAML frontmatter tags trong Second Brain.
- **Tiêu chuẩn**: Mọi tag gán vào note phải được khai báo bằng mã `tag` tại tài liệu này trước khi sử dụng.
- **Kiểm soát chất lượng**: `bun 99_Meta/Scripts/validate_notes.mjs` tự động quét và chặn các tag chưa khai báo.

---

## 1. Type Tags (`type/*`)

Mỗi note (ngoại trừ Daily Logs và Flashcards) bắt buộc chứa ít nhất 1 `type/*` tag:

- `type/concept`: Định nghĩa, lý thuyết, nguyên lý, mental model (`30_Resources/Concepts/`).
- `type/method`: SOP, quy trình thực thi, thuật toán, framework hành động (`30_Resources/Methods/`).
- `type/pattern`: Design patterns, architectural patterns.
- `type/mental-model`: Mô hình tư duy, khung phân tích nhận thức.
- `type/vocab`: Thẻ từ vựng, ngữ pháp tiếng Anh.
- `type/moc`: Map of Content - Bản đồ điều hướng nội dung.
- `type/project`: Dự án thực hiện (`10_Projects/`).
- `type/meeting`: Biên bản cuộc họp, Scrum daily logs.
- `type/checklist`: Danh sách kiểm tra công việc, quy chuẩn.
- `type/guide`: Hướng dẫn cấu hình, tài liệu kỹ thuật.
- `type/algorithm`: Giải thuật, bài toán LeetCode, cấu trúc dữ liệu.
- `type/audit`: Báo cáo đánh giá hiệu năng, bảo mật.
- `type/strategy`: Chiến lược phát triển sự nghiệp, tài chính, đầu tư.
- `type/technique`: Kỹ thuật lập trình, kỹ thuật kiểm thử.
- `type/submission`: Báo cáo nộp bài, đề xuất dự án.

---

## 2. Topic Tags (`topic/*`)

### Software Engineering & Architecture

- Core Backend: `topic/backend`, `topic/architecture`, `topic/system-design`, `topic/engineering`, `topic/devops`, `topic/infrastructure`.
- Data & Storage: `topic/database`, `topic/sql`, `topic/dsa`, `topic/leetcode`, `topic/memory-management`.
- Quality & Lifecycle: `topic/testing`, `topic/sdlc`, `topic/security`, `topic/engineering-management`, `topic/project-management`.
- Web & Client: `topic/frontend`, `topic/web`, `topic/rendering`, `topic/seo`, `topic/i18n`.
- Languages & Core: `topic/go`, `topic/rust`, `topic/typescript`, `topic/javascript`, `topic/php`, `topic/laravel`.
- General Tech: `topic/tech`, `topic/concepts`, `topic/ai-engineering`, `topic/iot`, `topic/academic`, `topic/healthcare-it`, `topic/hyundai-ecommerce`, `topic/programming/standards`.

### Mindset, Cognition & Productivity

- Mental Models: `topic/mental-models`, `topic/decision-making`, `topic/psychology`, `topic/game-theory`.
- Systems & Workflow: `topic/knowledge-management`, `topic/documentation`, `topic/workflow`, `topic/productivity`.
- Communication & Career: `topic/communication`, `topic/negotiation`, `topic/product-management`, `topic/career`, `topic/freelance`.
- Learning & Mastery: `topic/learning`, `topic/self-study`, `topic/personal-rules`, `topic/personal-development`.

### Linguistics & English

- Core English: `topic/english`, `topic/linguistics`, `topic/grammar`, `topic/writing`, `topic/toeic`.
- Linguistic Matrix: `lang/english`, `skill/pronunciation`, `level/B1`.

### Finance, Economics & Life

- Capital & Markets: `topic/finance`, `topic/investing`, `topic/investment`, `topic/economics`, `topic/macro-economics`, `topic/math`, `market/us`, `market/vietnam`.
- Lifestyle & Health: `topic/health`, `topic/nutrition`, `topic/calisthenics`, `topic/life`, `topic/agriculture`.

---

## 3. Layer Tags (`layer/*`)

Phân tầng nhận thức Backend (4-Layer Cognitive Stack):

- `layer/core-mechanics`: Tầng 1 - Core Mechanics & Memory (V8/Go runtime, GC, Stack/Heap, Escape Analysis, B+ Tree, Hardware footprint).
- `layer/architecture`: Tầng 2 - Architecture & Clean Code (Clean Architecture, Modular Monolith, DDD, SOLID, Design Patterns, DI).
- `layer/infrastructure`: Tầng 3 - System Infrastructure & Reliability (Locks, Redis Redlock, Rate Limiting, Outbox, Caching, DB Indexing).
- `layer/quality`: Tầng 4 - Quality & Verification (7 Principles, ISTQB, EP/BVA, STLC, Playwright, E2E Automation, Contract Drift).

---

## 4. Status & Meta Tags (`status/*`, `meta/*`, `project/*`)

- Status: `status/permanent` (hoàn thiện), `status/todo` (nháp/placeholder), `status/active` (đang chạy), `status/archived` (lưu trữ).
- Meta: `meta/structure` (cấu trúc hệ thống), `meta/template` (template mẫu).
- Projects & Archives: `project/hyundai-ecommerce`, `project/viettridao`.
- Legacy & Domain Aliases: `architecture`, `attributes`, `best-practices`, `blade`, `blog-posts`, `components`, `controller`, `documentation`, `eloquent`, `frontend`, `guide`, `laravel`, `layout`, `memory/optimization`, `mvc`, `named-routes`, `performance/v8`, `php`, `routing`, `web.php`, `x-layout`.

---

## 5. Change Protocol

1. Khai báo tag mới vào danh sách trên dưới dạng `tag-name`.
2. Gán tag vào note mục tiêu.
3. Chạy `bun 99_Meta/Scripts/validate_notes.mjs` để xác nhận hợp lệ.
