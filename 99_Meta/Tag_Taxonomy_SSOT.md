---
tags: [meta/structure, guide, documentation]
status: permanent
date: 2026-08-09
---

# Tag Taxonomy SSOT (Single Source of Truth)

## TL;DR

Tài liệu này là **Nguồn Sự Thật Duy Nhất (Single Source of Truth - SSOT)** quy định toàn bộ hệ thống thẻ (`tags`) được phép sử dụng trong Second Brain.

**QUY TẮC BẮT BUỘC CHO AI AGENTS & USERS:**

1. Tất cả ghi chú khi khởi tạo hoặc cập nhật MUST sử dụng các tag thuộc danh sách chính thức dưới đây.
2. Nếu cần tạo một tag mới chưa có trong danh sách, AI/User MUST khai báo và bổ sung tag đó vào tài liệu này TRƯỚC KHI sử dụng trong bất kỳ note nào.
3. Script `bun 99_Meta/Scripts/validate_notes.mjs` sẽ tự động quét và báo lỗi/cảnh báo nếu phát hiện bất kỳ tag nào chưa được khai báo tại SSOT này.

---

## 1. Type Tags (`type/*`) - Phân loại loại hình Note

Mỗi note (ngoại trừ Daily Logs và Flashcards) MUST chứa ít nhất 1 `type/` tag:

- **`type/concept`**: Khái niệm lý thuyết, nguyên lý, định nghĩa, mental model (lưu tại `30_Resources/Concepts/`).
- **`type/method`**: SOP, quy trình, thuật toán, framework hành động (lưu tại `30_Resources/Methods/`).
- **`type/pattern`**: Design pattern, architectural pattern.
- **`type/mental-model`**: Mô hình tư duy, khung phân tích nhận thức.
- **`type/vocab`**: Thẻ từ vựng, ngữ pháp tiếng Anh.
- **`type/moc`**: Map of Content - Bản đồ điều hướng nội dung.
- **`type/project`**: Dự án đang thực hiện (lưu tại `10_Projects/`).
- **`type/meeting`**: Biên bản cuộc họp, Scrum daily logs.
- **`type/checklist`**: Danh sách kiểm tra công việc/sức khỏe.
- **`type/guide`**: Hướng dẫn cài đặt, tài liệu cấu hình hệ thống.
- **`type/algorithm`**: Thuật toán LeetCode, cấu trúc dữ liệu.
- **`type/audit`**: Báo cáo đánh giá hiệu năng, bảo mật.
- **`type/strategy`**: Chiến lược phát triển sự nghiệp, tài chính, đầu tư.
- **`type/technique`**: Kỹ thuật viết code, kỹ thuật test.

---

## 2. Topic Tags (`topic/*`) - Phân loại Lĩnh vực & Chủ đề

- **`topic/backend`**: Lập trình Backend, API, Microservices, Node.js, NestJS, Go, C#/.NET.
- **`topic/frontend`**: Lập trình Frontend, React, Next.js, UI Components, State.
- **`topic/testing`**: Kiểm thử phần mềm, ISTQB, Unit Test, E2E, EP, BVA.
- **`topic/engineering`**: Kỹ nghệ phần mềm, SDLC, Clean Architecture, SOLID.
- **`topic/architecture`**: Kiến trúc phần mềm, System Design, Scalability, Distributed Systems.
- **`topic/database`**: Cơ sở dữ liệu, PostgreSQL, SQL Tuning, Redis, Indexing.
- **`topic/infrastructure`**: Hạ tầng, Docker, Serverless, Edge, Tmux.
- **`topic/security`**: Bảo mật, Mã hóa, Rate Limiting, XSS, OAuth.
- **`topic/devops`**: CI/CD, Deployment, Monitoring, Logging.
- **`topic/productivity`**: Tối ưu năng suất, Time-boxing, Second Brain, Zettelkasten.
- **`topic/career`**: Phát triển sự nghiệp, CV, Phỏng vấn, Skill Stacking.
- **`topic/learning`**: Phương pháp học tập, Spaced Repetition, Active Recall.
- **`topic/linguistics`**: Tiếng Anh, Từ vựng, Ngữ pháp, IPA.
- **`topic/finance`**: Tài chính cá nhân, Quản trị rủi ro.
- **`topic/economics`**: Kinh tế học, Game Theory, Cơ chế thị trường.
- **`topic/psychology`**: Tâm lý học, Thiên kiến nhận thức, Maslow.
- **`topic/concepts`**: Khái niệm chung.
- **`topic/tech`**: Tri thức kỹ thuật chung.
- **`topic/life`**: Sức khỏe, Đời sống cá nhân.

## 5. Layer Tags (`layer/*`) - Phân tầng Nhận thức Backend (4-Layer Cognitive Stack)

- **`layer/core-mechanics`**: Tầng 1 Core Mechanics & Memory (V8/JSC, Garbage Collection, Stack/Heap, B+Tree).
- **`layer/architecture`**: Tầng 2 Architecture & Clean Code (Clean/Layered Architecture, DDD, SOLID, Design Patterns).
- **`layer/infrastructure`**: Tầng 3 System Infrastructure & Ops (Pessimistic Locking, Redlock, Rate Limiting, Docker).
- **`layer/quality`**: Tầng 4 Quality & Software Testing (7 Principles, EP, BVA, Statement/Decision Coverage, STLC).

---

## 3. Status Tags (`status/*`) - Trạng thái Note

- **`status/permanent`**: Note nguyên tử chính thức, đã kiểm định chất lượng.
- **`status/todo`**: Note nháp/placeholder chưa hoàn thiện.

---

## 4. Meta Tags (`meta/*`) - Thẻ Metadata Hệ thống

- **`meta/structure`**: Tài liệu quy định cấu trúc và hướng dẫn hệ thống Second Brain.

---

## Quy trình Thêm Tag Mới (Change Protocol)

1. Mở file `99_Meta/Tag_Taxonomy_SSOT.md`.
2. Bổ sung tag mới vào đúng nhóm (`type/*`, `topic/*`, `status/*`, hoặc `meta/*`) kèm theo 1 dòng mô tả mục đích.
3. Tiến hành gán tag mới đó vào note.
4. Chạy `bun 99_Meta/Scripts/validate_notes.mjs` để xác nhận hợp lệ.
