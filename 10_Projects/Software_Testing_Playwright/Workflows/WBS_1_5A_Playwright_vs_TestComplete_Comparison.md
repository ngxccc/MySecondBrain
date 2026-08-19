---
tags: [type/method, topic/project-management, layer/quality]
status: permanent
date: 2026-08-18
description: Direct technical and architectural comparison matrix between Playwright and TestComplete with Definition of Done for WBS 1.5A
---

# WBS 1.5A: Playwright vs TestComplete Architectural Comparison

## Metadata

- **WBS Code:** `1.5A`
- **Task Name:** So sánh đối sánh Playwright vs TestComplete (Kiến trúc & Chi phí TCO)
- **Assignee:** Ngô Gia Bảo (MSSV: 0306241090)
- **Task Weight:** `2.0%`
- **Deliverable Artifacts:** Mục 4.1A Chương 4 trong `67_Bao_cao.docx` và các Slide tương ứng trong `67_Slide.pptx`.

## TL;DR

Tài liệu đặc tả nội dung so sánh đối kháng trực diện giữa Playwright (Microsoft) và TestComplete (SmartBear) - trọng tâm của đề tài môn học. Phân tích chi tiết sự khác biệt về kiến trúc điều khiển trình duyệt, mô hình cấp phép bản quyền, tổng chi phí sở hữu (Total Cost of Ownership - TCO), và khả năng tương thích với hạ tầng CI/CD trên Docker/Linux.

## Core Architectural Content to Document

### 1. Ma Trận Đối Soát Trực Diện: Playwright vs TestComplete

| Tiêu Chí So Sánh             | Playwright (Microsoft)                                                    | TestComplete (SmartBear)                                                  |
| ---------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **Kiến trúc điều khiển**     | **WebSocket CDP / Bi-directional Pipe** trực tiếp vào lõi trình duyệt.    | **OS Native Hooks / COM / Accessibility API** cồng kềnh cấp hệ điều hành. |
| **Tốc độ thực thi**          | **Rất nhanh** (Vài mili-giây cho mỗi action, tối ưu RAM).                 | **Chậm & Nặng nề** (Phụ thuộc vào giao diện đồ họa Windows).              |
| **Chi phí bản quyền (TCO)**  | **Miễn phí $100\%$** (Mã nguồn mở Apache 2.0). Chi phí license = $0.      | **Thương mại rất đắt** (~$2,000 - $4,000 / seat / năm).                   |
| **Hạ tầng CI/CD & Headless** | Chạy xuất sắc trên **Linux Docker Containers siêu nhẹ**, hỗ trợ Sharding. | Đòi hỏi **máy ảo Windows đầy đủ (GUI Desktop)** có cài license server.    |
| **Kiểm thử đa tầng**         | Hợp nhất **Web UI + API Automation** trong 1 codebase duy nhất.           | Phải cấu hình các module riêng biệt hoặc mua thêm công cụ ReadyAPI.       |
| **Cơ chế chống Flaky**       | **Auto-waiting 5 bước** & Web-first Assertions tích hợp sẵn.              | Phải cấu hình timeout thủ công hoặc viết hàm chờ phức tạp.                |
| **Phương thức tiếp cận**     | **Code-First (TypeScript / JS / Python / C# / Java)** chuẩn kỹ nghệ.      | **Low-Code / Record-Playback / Scripting cũ** (VBScript, JScript).        |

### 2. 3 Luận Điểm Then Chốt Trước Hội Đồng Giảng Viên

1. **Về Chi Phí Đầu Tư & Rào Cản Doanh Nghiệp:** TestComplete đặt ra gánh nặng tài chính khổng lồ cho doanh nghiệp vừa và nhỏ với chi phí bản quyền hàng năm, trong khi Playwright là mã nguồn mở hoàn toàn miễn phí được bảo trợ vững chắc bởi Microsoft.
2. **Về Khả Năng Mở Rộng Trên Hạ Tầng Hiện Đại (Cloud & Containerization):** Playwright được sinh ra cho kỷ nguyên Cloud-native, có thể đóng gói vào các Docker Image Linux siêu nhẹ (~$500\text{MB}$) để chạy song song hàng nghìn bài test trên GitHub Actions/GitLab CI mà không tốn chi phí duy trì máy ảo Windows nặng nề.
3. **Về Tính Thống Nhất & Tốc Độ Phát Triển:** Playwright cho phép đội ngũ SDET và Developer cùng làm việc trên cùng một ngôn ngữ lập trình (TypeScript), chia sẻ chung types và luồng kiểm thử từ tầng API đến Web UI.

---

## Acceptance Criteria & Definition of Done (DoD Checklist)

- [ ] **Báo cáo Word (`67_Bao_cao.docx`):**
  - [ ] Soạn thảo đầy đủ Mục 4.1A Chương 4: Bảng ma trận so sánh 7 tiêu chí giữa Playwright và TestComplete.
  - [ ] Phân tích sâu 3 luận điểm chứng minh tính vượt trội của Playwright so với TestComplete trong môi trường công nghiệp.
  - [ ] Định dạng bảng biểu chuẩn, canh lề đẹp mắt.
- [ ] **Review & Bàn Giao:**
  - [ ] Nộp bản thảo Word và Slide cho Trưởng nhóm nghiệm thu đúng hạn.

## Related Notes

- [[Playwright_vs_TestComplete_Architectural_Comparison]]
- [[Playwright_Hard_Technical_Boundaries_and_Non_Goals]]
- [[Team_Work_Breakdown_and_Contribution_Matrix_Template]]
