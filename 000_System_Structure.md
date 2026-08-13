---
tags: [meta/structure, guide, documentation]
status: permanent
created_at: Thursday, January 29th 2026, 3:56:14 pm +07:00
updated_at: Sunday, June 7th 2026, 10:00:00 am +07:00
---

# My Second Brain Structure Guide

## TL;DR

Tài liệu quy định chức năng và quy tắc lưu trữ cho từng thư mục trong hệ thống Second Brain, dựa trên phương pháp **PARA Modified** (Inbox + Projects + Areas + Resources + Archives).

Tất cả các quy tắc hệ thống, quy định phân loại note, và chỉ dẫn cấu trúc thư mục được tập trung duy nhất tại **`AGENTS.md`** (Single Source of Truth). Tài liệu này chỉ đóng vai trò bản đồ ánh xạ (Directory Mapping) cho cây thư mục.

## Directory Breakdown (Chi tiết cấu trúc)

### Root Files (Các file ở thư mục gốc)

- **`00_Dashboard.md`**: Dashboard chính hiển thị các task tồn đọng trong 7 ngày gần nhất sử dụng `dataviewjs`.
- **`000_System_Structure.md`**: Tài liệu hướng dẫn cấu trúc thư mục hiện tại của hệ thống.
- **`AGENTS.md`**: Chứa các quy tắc, chỉ dẫn dành cho AI Agents khi làm việc trong Second Brain.
- **`sync.sh`**: Script tự động đồng bộ hóa dữ liệu Second Brain lên GitHub repository.

### 00_Inbox (Hộp thư đến)

- **Mục đích:** Nơi "đổ rác" tạm thời. Bắt lấy ý tưởng nhanh, ghi chú thô, copy-paste từ web.
- **Quy tắc:**
  - Không cần định dạng đẹp.
  - **Phải dọn dẹp (Review):** Ít nhất 1 tuần/lần.
  - Sau khi xử lý, file phải được đổi tên chuẩn, gắn tag và di chuyển sang thư mục `10`, `20` hoặc `30`.

### 10_Projects (Dự án đang chạy)

- **Mục đích:** Chứa các dự án **có mục tiêu cụ thể** và **có thời hạn (Deadline)**.
- **Cấu trúc mỗi thư mục dự án (`10_Projects/<Project_Name>/`):**
  - Cắt bỏ vỏ bọc `Docs/` thừa. Tất cả các thư mục Domain Cấp 2 nằm trực tiếp dưới thư mục gốc của Dự án:
    - `Architecture/`: Kiến trúc hệ thống, ADR, RFC, System Design Specs.
    - `Auth/`: Thiết kế luồng xác thực (Authentication/Authorization), OAuth, Session.
    - `Database/`: DBML Schema, Postgres Indexes, Locking, Migrations.
    - `DevOps/`: Docker Compose, Nginx, CI/CD, Deployment Guide.
    - `Workflows/`: Luồng nghiệp vụ, Security, i18n, Scenarios.
    - `Testing/`: Apidog setup, E2E Test Scenarios.
- **Quy tắc:**
  - Chứa tài liệu đặc thù của dự án đó (Requirement, Design, Plan).
  - Khi dự án hoàn thành -> Move toàn bộ folder dự án sang `40_Archives`.

### 20_Areas (Lĩnh vực trách nhiệm)

- **Mục đích:** Các khía cạnh cần duy trì lâu dài, **không có deadline**.
- **Các thư mục con:**
  - `Daily_Logs/`: Nhật ký, log công việc hàng ngày (Ví dụ: `2026-06-07.md`). Sử dụng template `Daily_Log_Template.md` để tạo mới hàng ngày.
  - `Finances/`: Quản lý tài chính cá nhân, đầu tư (`My_Investment_Strategy.md`, `000_Finances_MOC.md`, `Income_Reservoir_Technique.md`, `Financial_Migration_Strategy.md`).
  - `Learning/`: Theo dõi tiến trình học tập cá nhân dài hạn (`English_Learner_Profile.md`).
  - `University/`: Lưu trữ tài liệu, thông tin về trường học, lớp học.
  - `Health/`: Theo dõi, ghi chú về sức khỏe.
- **Quy tắc:**
  - Chứa các ghi chú mang tính theo dõi lâu dài, nhật ký, log.

### 30_Resources (Kho kiến thức)

- **Mục đích:** "Thư viện" chứa kiến thức, concept, tài liệu tham khảo có thể dùng lại cho nhiều dự án khác nhau.
- **Các thư mục con:**
  - `Tech/`: Ghi chú kỹ thuật. Phân loại thành:
    - `Architecture_and_Patterns/`: Các mẫu kiến trúc, nguyên lý thiết kế (SOLID, Clean Architecture, Dependency Injection...).
    - `Language_and_Core/`: Các kiến thức cốt lõi về ngôn ngữ lập trình (TypeScript...).
    - `Web_Client_and_Security/`: Bảo mật phía client, offline sync...
    - `Infrastructure_and_Cloud/`: Serverless, Edge Computing...
    - `API_and_Data_Design/`: Phân trang, API versioning...
    - `Frameworks_and_Ecosystem/`: Next.js Server Actions, RSC, Next-Intl...
  - `Concepts/`: Các khái niệm chung. Phân loại thành:
    - `Learning_and_Linguistics/`: Spaced Repetition, Phonetic Chunking...
    - `Knowledge_Management/`: Zettelkasten, Map of Content...
    - `Finance_and_Economics/`: Opportunity Cost, Liquidity Trap...
    - `Psychology_and_Mental_Models/`: Cognitive Stack, Confirmation Bias, Systems Thinking...
    - `Negotiation_and_Communication/`: BATNA, ZOPA, Tactical Empathy, Getting To Yes...
    - `Product_and_Business_Mindsets/`: Product Mindset, Customer Outcome Thinking, Kanban...
    - `Academic_and_Case_Studies/`: RMIT Critical Review Report, Case Studies...
  - `Methods/`: Các SOP, quy trình thực hành và phương pháp làm việc. Phân loại thành:
    - `Engineering/`: SOP kỹ thuật, Benchmarking, SDLC, System Design (Go Benchmarking, Automated Verification, Stress Testing...).
    - `Learning_and_Cognition/`: Phương pháp tư duy, học tập (Metalearning, First Principles Thinking, Socratic Questioning...).
    - `Life_and_Finance/`: Quy trình tài chính cá nhân và tối ưu lối sống (Dollar Cost Averaging, Sleep Optimization...).
  - `Vocabulary/`: Từ vựng tiếng Anh, từ vựng chuyên ngành (Vocab_Homographs.md, Vocab_IT_Specialized.md...).
  - `Life/`: Các khía cạnh đời sống thường ngày.
- **Quy tắc:**
  - Nơi chứa **Atomic Notes** (Ghi chú nguyên tử).
  - Viết dưới dạng Generic (không gắn liền với dự án cụ thể) để tái sử dụng.
  - Sử dụng nhiều Backlinks `[[Link]]` tại đây.

### 40_Archives (Lưu trữ lạnh)

- **Mục đích:** Kho lưu trữ những thứ đã hoàn thành hoặc không còn hoạt động.
- **Quy tắc:**
  - Không được xóa file, chỉ di chuyển vào đây để lưu giữ lịch sử.

### 50_Flashcards (Thẻ ghi nhớ học tập)

- **Mục đích:** Nơi lưu trữ các deck và card flashcard dành cho Anki (đồng bộ qua plugin Yanki).
- **Các thư mục con:**
  - `Vocabulary/`: Thẻ từ vựng và ma trận họ từ (Word Family Matrix) phân loại theo trình độ (`A1/`, `A2/`, `B1/`, `B2/`, `C1/`, `C2/`, `Software_Engineering/`, `Professional_Communication/`...).
  - `Grammar/`: Thẻ ngữ pháp thực chiến phân loại theo chủ đề (`Question_Patterns/`, `Parts_Of_Speech_And_Morphology/`, `Verb_Patterns_And_Prepositions/`, `Sentence_Structures/`, `Technical_Phrasing/`).
  - `Go/`: Thẻ ghi nhớ về kỹ thuật và kiến trúc bộ nhớ Go phân loại theo chủ đề (`Slice/`, `Map/`...).
  - Cấu trúc cây thư mục con phản ánh cấu trúc Deck trong Anki (ví dụ: `50_Flashcards/Grammar/Question_Patterns/` sẽ đồng bộ vào deck `Grammar::Question_Patterns`).
  - Mỗi file Markdown tương ứng với một Anki Note độc lập (Front/Back phân tách bằng `---`).
  - Không gán tag `type/...` trong frontmatter để bỏ qua bộ kiểm tra cấu trúc Atomic Note thông thường của Second Brain.

### 99_Meta (Cấu hình hệ thống)

- **Mục đích:** Chứa các file cấu hình và tài nguyên hệ thống.
- **Thư mục con hiện tại:**
  - `Templates/`: Các file mẫu để tạo note nhanh chóng (`Daily_Log_Template.md`, `Technical_Concept_Template.md`, `Project_Template.md`...).
  - `Scripts/`: Chứa các script bổ trợ cho hệ thống, ví dụ `validate_notes.mjs` để kiểm tra chất lượng và cấu trúc các ghi chú.

---

## Workflow (Quy trình xử lý)

1. **Capture:** Ghi nhanh vào `00_Inbox`.
2. **Process:** Cuối tuần hoặc định kỳ, review `00_Inbox`.
   - Nếu là task dự án -> Move vào `10_Projects`.
   - Nếu là kiến thức mới -> Viết lại thành Atomic Note -> Move vào `30_Resources`.
   - Nếu là việc cá nhân -> Move vào `20_Areas`.
3. **Archive:** Khi xong một dự án -> Move folder đó từ `10_Projects` vào `40_Archives`.

---

## Related Concepts

- [[Zettelkasten_Method]]
- [[PARA_Method]]
