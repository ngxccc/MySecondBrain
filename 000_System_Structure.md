---
tags: [meta/structure, guide, documentation]
status: permanent
date: 2026-08-09
---

# System Structure Guide

## TL;DR

- **Mục đích**: Bản đồ ánh xạ thư mục (Directory Map) định hình vị trí và chức năng của từng thư mục trong Second Brain.
- **Kiến trúc**: Ứng dụng **PARA Modified** (Inbox, Projects, Areas, Resources, Archives) kết hợp Zettelkasten.
- **Quy tắc hệ thống**: Mọi quy định về AI Agent, Tag SSOT, và tiêu chuẩn Note tuân thủ tuyệt đối theo `AGENTS.md`.

---

## 1. Directory Tree Overview

```
.
├── 00_Dashboard.md                   # Trung tâm điều phối & Active Sprint
├── 000_System_Structure.md           # Bản đồ cấu trúc thư mục (File này)
├── AGENTS.md                         # Quy tắc tối thượng cho AI & Workflow
├── 00_Inbox/                         # Nơi tiếp nhận ghi chú thô, review hàng tuần
├── 10_Projects/<Project_Name>/       # Dự án có deadline & mục tiêu cụ thể
│   ├── Architecture/                 # ADR, RFC, System Design Specs
│   ├── Auth/                         # OAuth, Session, Security Flow
│   ├── Database/                     # Schema, Indexing, Migrations
│   ├── DevOps/                       # Docker, CI/CD, Deployment
│   ├── Workflows/                    # Luồng nghiệp vụ, scenarios, i18n
│   └── Testing/                      # E2E Test, Playwright, Test Cases
├── 20_Areas/                         # Trách nhiệm duy trì dài hạn (không deadline)
│   ├── Daily_Logs/                   # Nhật ký công việc theo ngày
│   ├── Finances/                     # Chiến lược tài chính & danh mục đầu tư
│   └── Learning/                     # Hồ sơ học tập & lộ trình phát triển
├── 30_Resources/                     # Thư viện tri thức nguyên tử (Evergreen)
│   ├── Tech/                         # Tri thức kỹ thuật (6 domain folders)
│   ├── Concepts/                     # Lý thuyết & Mental Models (9 domain folders)
│   ├── Methods/                      # SOPs, Roadmaps, Frameworks (3 domain folders)
│   ├── Life/                         # Nghiên cứu sinh lý, giấc ngủ, sức khỏe (2 domain folders)
│   └── Excalidraw/                   # Sơ đồ kiến trúc & whiteboard
├── 40_Archives/                      # Lưu trữ lạnh dự án hoàn tất / tài liệu cũ
├── 50_Flashcards/                    # Anki Flashcards (Yanki plugin)
│   ├── Vocabulary/                   # Thẻ từ vựng theo CEFR & chuyên ngành
│   └── Grammar/                      # Thẻ ngữ pháp thực chiến & cấu trúc câu
└── 99_Meta/                          # Cấu hình hệ thống, Templates, Validator Scripts
```

---

## 2. Directory Specifications

### Core Directories

- **`00_Inbox/`**: Tiếp nhận ý tưởng thô và web clippings. Triệt tiêu định kỳ bằng cách phân loại về `10`, `20` hoặc `30`.
- **`10_Projects/`**: Dự án ngắn/trung hạn có mục tiêu rõ ràng. Thư mục domain (`Architecture/`, `Auth/`, `Database/`, `DevOps/`, `Workflows/`, `Testing/`) nằm phẳng trực tiếp dưới project root. Khi hoàn thành chuyển sang `40_Archives/`.
- **`20_Areas/`**: Quản lý các khía cạnh duy trì liên tục (`Daily_Logs/`, `Finances/`, `Learning/`).
- **`30_Resources/`**: Kho tri thức nguyên tử độc lập dự án, tuân thủ giới hạn phẳng 2 cấp:
  - `Tech/`: `Architecture_and_Patterns/`, `Language_and_Core/`, `Web_Client_and_Security/`, `Infrastructure_and_Cloud/`, `API_and_Data_Design/`, `Frameworks_and_Ecosystem/`.
  - `Concepts/`: `Academic_and_Case_Studies/`, `Computer_Science/`, `Finance_and_Economics/`, `Knowledge_Management/`, `Learning_and_Linguistics/`, `Negotiation_and_Communication/`, `Product_and_Business_Mindsets/`, `Psychology_and_Mental_Models/`, `Software_Testing/`.
  - `Methods/`: `Engineering/`, `Learning_and_Cognition/`, `Finance/`.
  - `Life/`: `Health_and_Dermatology/`, `Sleep_and_Recovery/`.
  - `Excalidraw/`: Sơ đồ kiến trúc & whiteboard.
- **`40_Archives/`**: Đóng băng dự án và tài liệu tham khảo cũ.
- **`50_Flashcards/`**: Thẻ học Anki theo chuẩn phân tách `---` của Yanki (`Vocabulary/`, `Grammar/`).
- **`99_Meta/`**: Quản trị hệ thống (`Templates/`, `Scripts/`, `Quizzes/`, `Visuals/`, `Tag_Taxonomy_SSOT.md`).

---

## 3. Triage Lifecycle

1. **Capture**: Ghi nhận thô tại `00_Inbox/`.
2. **Synthesize & Classify**: Định kỳ review:
   - Task / Dự án thời hạn $\rightarrow$ `10_Projects/`.
   - Nhật ký / Trách nhiệm duy trì $\rightarrow$ `20_Areas/`.
   - Tri thức nguyên tử (Atomic Note) $\rightarrow$ `30_Resources/` (`Methods/` cho SOP/hành động, `Concepts/` cho lý thuyết).
3. **Archive**: Đóng gói chuyển sang `40_Archives/` khi dự án kết thúc.

---

## Related Notes

- [[PARA_Method]]
- [[Zettelkasten_Method]]
- [[000_Tech_MOC]]
- [[000_Concepts_MOC]]
- [[000_Methods_MOC]]
