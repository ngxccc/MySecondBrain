---
tags: [type/method, topic/project-management, layer/quality]
status: permanent
date: 2026-08-18
description: Task specification, academic formatting standards, chapter synthesis, and Definition of Done for WBS 4.1A - Report Compilation Chapters 1 and 2
---

# WBS 4.1A: Report Compilation - Chapters 1 and 2

## Metadata

- **WBS Code:** `4.1A`
- **Task Name:** Biên soạn & Format Báo cáo môn học Chương 1 & 2 (`67_Bao_cao.docx`)
- **Assignee:** Đặng Duy Lam (MSSV: 0306241125)
- **Task Weight:** `3.5%`
- **Deliverable Artifacts:** File tài liệu Word `67_Bao_cao.docx` (Phần Trang Bìa, Mục Lục, Chương 1 và Chương 2), cập nhật liên tục vào Google Drive / Git.

## TL;DR

Tài liệu đặc tả nhiệm vụ tổng hợp, biên tập và chuẩn hóa định dạng học thuật cho nửa đầu của cuốn Báo cáo đồ án môn học (`67_Bao_cao.docx`). Người phụ trách tiếp nhận các bản thảo nội dung thô từ các thành viên thuộc WBS $1.1\text{A} \to 1.4\text{B}$, tiến hành chuẩn hóa văn phong, căn lề văn bản chuẩn, đánh số bảng biểu / hình ảnh tự động và thiết lập hệ thống mục lục phân cấp.

## Core Architectural Content to Implement

### 1. Phạm Vi Biên Soạn & Nguồn Dữ Liệu Đầu Vào

Người phụ trách WBS 4.1A có trách nhiệm đôn đốc thu thập và hợp nhất các phần sau:

- **Trang Bìa & Đầu Báo Cáo:**
  - Bìa chính thức có logo Trường Cao đẳng Kỹ thuật Cao Thắng.
  - Trang nhận xét của Giảng viên hướng dẫn (ThS. Nguyễn Hoàng Việt).
  - Lời cảm ơn, Bảng phân công nhiệm vụ và tỷ lệ đóng góp của 7 thành viên.
  - Danh mục chữ viết tắt, Danh mục hình ảnh và Danh mục bảng biểu.
- **Chương 1: Tổng Quan Về Playwright & Cơ Sở Kiến Trúc:**
  - Mục 1.1: Tổng quan Playwright, Lịch sử & Triết lý Code-first (Thu thập từ WBS 1.1A).
  - Mục 1.2: Kiến trúc kết nối WebSocket CDP vs HTTP WebDriver (Thu thập từ WBS 1.1B).
  - Mục 1.3: Cơ chế Auto-waiting 5 bước & Actionability Checks (Thu thập từ WBS 1.2A).
  - Mục 1.4: Cơ chế Browser Context Isolation & Tối ưu RAM (Thu thập từ WBS 1.2B).
- **Chương 2: Hướng Dẫn Cài Đặt & Năng Lực Cốt Lõi Của Playwright:**
  - Mục 2.1: Quy trình cài đặt môi trường Node.js/Bun & TypeScript (Thu thập từ WBS 1.3A).
  - Mục 2.2: Hướng dẫn sử dụng CLI, Codegen, UI Mode & Trace Viewer (Thu thập từ WBS 1.3A & 1.3B).
  - Mục 2.3: Phân tích Năng lực Web UI với POM, COM & `page.route()` (Thu thập từ WBS 1.4A).
  - Mục 2.4: Phân tích Năng lực API với `APIRequestContext`, Hybrid Auth & SOM (Thu thập từ WBS 1.4B).

### 2. Quy Chuẩn Định Dạng Học Thuật Bắt Buộc (Academic Formatting Rules)

1. **Khổ giấy & Căn lề chuẩn văn bản hành chính:**
   - Khổ giấy: `A4` ($210\text{mm} \times 297\text{mm}$).
   - Căn lề: Top $2.0\text{cm}$, Bottom $2.0\text{cm}$, Left $3.0\text{cm}$ (để đóng gáy), Right $2.0\text{cm}$.
2. **Phông chữ & Giãn dòng:**
   - Phông chữ toàn văn bản: `Times New Roman`.
   - Cỡ chữ nội dung: `13pt`, màu đen tự động, căn đều hai bên (Justified).
   - Giãn dòng: `1.5 lines`, khoảng cách đoạn: `Before 3pt`, `After 3pt`.
3. **Tiêu đề phân cấp (Headings):**
   - `Heading 1` (Tên chương): `16pt`, In hoa, Đậm, Canh giữa (ví dụ: **CHƯƠNG 1: TỔNG QUAN VỀ PLAYWRIGHT**).
   - `Heading 2` (Mục cấp 1): `14pt`, Đậm (ví dụ: **1.1. Lịch sử phát triển**).
   - `Heading 3` (Mục cấp 2): `13pt`, Đậm, Nghiêng.
4. **Hình ảnh & Bảng biểu:**
   - Mọi hình ảnh phải được canh giữa, có chú thích bên dưới: _Hình 1.1: Sơ đồ kiến trúc WebSocket CDP_ (`11pt`, Nghiêng, Canh giữa).
   - Mọi bảng biểu phải có tiêu đề bên trên: _Bảng 1.1: So sánh thông số kỹ thuật_ (`11pt`, Đậm, Canh trái/giữa).

---

## Acceptance Criteria & Definition of Done (DoD Checklist)

- [ ] **Hợp Nhất Đầy Đủ Nội Dung:**
  - [ ] Thu thập đầy đủ 100% bản thảo từ các thành viên phụ trách WBS 1.1A, 1.1B, 1.2A, 1.2B, 1.3A, 1.3B, 1.4A, 1.4B.
  - [ ] Không bỏ sót các sơ đồ ASCII / hình chụp minh họa quan trọng.
- [ ] **Chuẩn Hóa Format Học Thuật:**
  - [ ] Canh lề, phông chữ, giãn dòng tuân thủ nghiêm ngặt quy định ở Mục 2.
  - [ ] Mục lục tự động (Table of Contents) cập nhật đúng số trang.
  - [ ] Không có lỗi chính tả hoặc lỗi dính từ.
- [ ] **Review & Bàn Giao:**
  - [ ] Gửi file bản thảo Word cho Trưởng nhóm nghiệm thu và tiến hành ghép nối với phần của WBS 4.1B.

## Related Notes

- [[WBS_1_1A_Playwright_Overview_and_Code_First_Philosophy]]
- [[WBS_1_1B_WebSocket_CDP_vs_HTTP_WebDriver_Architecture]]
- [[WBS_1_2A_Auto_Waiting_and_Actionability_Checks]]
- [[WBS_1_2B_Browser_Context_Isolation_and_Memory_Optimization]]
- [[WBS_1_3A_Environment_Setup_CLI_and_Codegen]]
- [[WBS_1_3B_Playwright_UI_Mode_and_Trace_Viewer_Diagnostics]]
- [[WBS_1_4A_Web_UI_Testing_Capabilities_and_Patterns]]
- [[WBS_1_4B_API_Testing_Capabilities_and_Patterns]]
- [[Team_Work_Breakdown_and_Contribution_Matrix_Template]]
