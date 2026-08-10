---
tags: [type/method, topic/engineering-management, topic/sdlc]
date: 2026-04-29
aliases: [Capstone Roadmap, Software Dev Lifecycle, Project SOP]
description: "Quy trình 16 tuần tiêu chuẩn (Hybrid SDLC) để build đồ án/project từ số 0 đến lúc deploy và bảo vệ thành công."
---

# Standard Project Timeline SOP

## TL;DR

Quy trình 16 tuần tiêu chuẩn (SOP) định hình Vòng đời Phát triển Phần mềm (SDLC) từ con số 0 đến lúc deploy. Giúp cân bằng giữa chất lượng kỹ thuật (Technical) và khả năng đóng gói sản phẩm (Delivery/Presentation).

## Core Concept

- **Kiến trúc Hybrid:** Linh hoạt trong lúc code (Agile Sprints) nhưng phải cực kỳ bảo thủ và cứng nhắc ở giai đoạn thiết kế Database ban đầu (Waterfall).
- **Thiết kế Database là sinh tử:** Logic code có thể viết lại trong 1 giờ, nhưng cấu trúc bảng dữ liệu (ERD) bị sai sẽ phá nát toàn bộ quan hệ Entity, kéo theo việc phải đập bỏ toàn bộ Backend.

## Practical Implementation

- **Roadmap 16 Tuần:**
  - _Phase 1: The Blueprint (Tuần 1-3):_ Phân tích Requirement, chốt User Flow, thiết kế ERD Database, init repo và cấu trúc thư mục.
  - _Phase 2: The Core / MVP (Tuần 4-8):_ Xây dựng Auth (Gatekeeper), phân quyền Role, và hoàn thiện bộ CRUD cho các Entity lõi (Happy Path).
  - _Phase 3: The Polish (Tuần 9-12):_ Xử lý UI/UX (Skeleton, Error boundary), Responsive, và viết Integration Test cho luồng chính.
  - _Phase 4: The Defense (Tuần 13-16):_ Triển khai Deploy (Vercel/VPS), viết tài liệu (README, Báo cáo), thiết kế Slide và tập dượt Demo.
- **Chiến thuật phòng ngự:**
  - _Code Freeze:_ Đóng băng trạng thái code, từ chối mọi Feature Creep trước deadline.
  - _Tránh Demo Effect:_ Lên kịch bản test (Scripted Demo) hạn chế sai số và luôn có Video Backup.

---

**Related Notes:**

- Cấu trúc thư mục áp dụng ở tuần 3: [[Modular_Monolith_Architecture]]
- Phương pháp quản lý tiến độ: [[Project_Roadmap]]
