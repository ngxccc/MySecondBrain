---
tags: [type/method, topic/project-management, layer/quality]
status: permanent
date: 2026-08-18
description: Task specification, visual slide structure, 6x6 design rules, and Definition of Done for WBS 4.2A - Slide Deck Theory and Tooling (Slides 1-14)
---

# WBS 4.2A: Slide Presentation Design - Theory and Tooling

## Metadata

- **WBS Code:** `4.2A`
- **Task Name:** Thiết kế Slide Mở đầu, Cơ sở lý thuyết & Tooling (Slide 1 $\to$ 14)
- **Assignee:** Nguyễn Quốc Đương (MSSV: 0306241102)
- **Task Weight:** `3.0%`
- **Deliverable Artifacts:** File slide thuyết trình `67_Slide.pptx` (Slide 1 đến 14) và bản xuất `67_Slide.pdf`.

## TL;DR

Tài liệu đặc tả kỹ thuật thiết kế nửa đầu của bộ Slide thuyết trình chính thức (`67_Slide.pptx` từ Slide 1 đến Slide 14). Nhiệm vụ trọng tâm là trực quan hóa các kiến thức nền tảng (Lịch sử, Triết lý Code-first, Kiến trúc WebSocket CDP, Auto-waiting, Browser Context) và bộ công cụ thực thi SDET (CLI, Codegen, UI Mode, Trace Viewer) theo quy chuẩn đồ họa chuyên nghiệp Widescreen 16:9, triệt tiêu văn bản dài.

## Core Architectural Content to Implement

### 1. Cấu Trúc Khung Slide Chi Tiết (Slide 1 $\to$ 14)

```text
SLIDE DECK PHAN 1: CO SO LY THUYET & BO CONG CU (Slide 1 -> 14)
├── 1. MO DAU & GIOI THIEU (Slide 1 - 3)
│   ├── Slide 1: Trang bia de tai (Logo Cao Thang, Khoa CNTT, De tai C, GVHD ThS. Nguyen Hoang Viet, Nhom 67)
│   ├── Slide 2: Danh sach 7 thanh vien & Bang phan cong nhiem vu (MSSV, Ty le dong gop SSOT)
│   └── Slide 3: Muc luc thuyet trinh (Agenda 5 phan)
├── 2. CO SO LY THUYET & KIEN TRUC COT LOI (Slide 4 - 10)
│   ├── Slide 4: Tong quan Playwright & Lich su phat trien (Microsoft, Apache 2.0)
│   ├── Slide 5: Triet ly thiet ke Code-First vs Low-Code/Record-Playback
│   ├── Slide 6: Kien truc ket noi WebSocket CDP vs HTTP WebDriver (So do ket noi truc tiep)
│   ├── Slide 7: Co che Auto-waiting 5 buoc (Attached, Visible, Stable, Enabled, Unobscured)
│   ├── Slide 8: Co che Browser Context Isolation & Toi uu RAM (Incognito in RAM)
│   ├── Slide 9: Chien luoc dinh vi Role-Based Locators tren Accessibility Tree
│   └── Slide 10: Ranh gioi ky thuat cung & Non-goals cua Playwright (Canvas, Captcha, Load testing)
└── 3. HUONG DAN CAI DAT & BO CONG CU SDET (Slide 11 - 14)
    ├── Slide 11: Khoi tao du an TypeScript & Cau hinh playwright.config.ts
    ├── Slide 12: Demo cong cu Playwright CLI & Codegen sinh ma tu dong
    ├── Slide 13: Demo cong cu Playwright UI Mode (Watch mode & Time-travel debugging)
    └── Slide 14: Demo cong cu Playwright Trace Viewer (4 luong du lieu kham nghiem su co)
```

### 2. Tiêu Chuẩn Trực Quan Hóa Kỹ Thuật (Visual & Presentation Standards)

1. **Quy tắc thiết kế $6 \times 6$:** Mỗi slide chỉ chứa tối đa 6 dòng, mỗi dòng tối đa 6 từ khóa quan trọng. Tuyệt đối không copy-paste các đoạn văn dài vào slide.
2. **Bảng màu chủ đạo:**
   - Xanh nhận diện học thuật (Navy / Royal Blue `#0F2027` hoặc `#203A43`).
   - Nền sáng tương phản cao (Trắng `#FFFFFF` hoặc Xám nhạt `#F8F9FA`).
   - Màu sắc trạng thái: Xanh lá cây (Pass / Success) và Đỏ (Fail / Error).
3. **Hình ảnh & Sơ đồ:** Toàn bộ sơ đồ kiến trúc phải ở dạng vector sắc nét hoặc hình ảnh chụp màn hình độ phân giải cao ($1920 \times 1080$), không bị mờ hay vỡ hạt.

---

## Acceptance Criteria & Definition of Done (DoD Checklist)

- [ ] **Hoàn Tất Slide 1 $\to$ 14:**
  - [ ] Đầy đủ 14 slides theo đúng cấu trúc khung ở Mục 1.
  - [ ] Slide bìa có đầy đủ Logo Trường Cao đẳng Kỹ thuật Cao Thắng và thông tin nhóm 67.
  - [ ] Không có lỗi chính tả kỹ thuật (Playwright, WebSocket, CDP, Auto-waiting, Locators).
- [ ] **Định Dạng & Đồng Bộ:**
  - [ ] Khung hình chuẩn Widescreen $16:9$.
  - [ ] Phông chữ đồng bộ (Arial, Segoe UI, Roboto hoặc Times New Roman), tiêu đề $\ge 32\text{pt}$, nội dung $\ge 18\text{pt}$.
- [ ] **Bàn Giao & Hợp Nhất:**
  - [ ] Ghép nối với phần Slide 15 $\to$ 26 của WBS 4.2B thành file `67_Slide.pptx` hoàn chỉnh để Trưởng nhóm nghiệm thu.

## Related Notes

- [[WBS_1_1A_Playwright_Overview_and_Code_First_Philosophy]]
- [[WBS_1_1B_WebSocket_CDP_vs_HTTP_WebDriver_Architecture]]
- [[WBS_1_2A_Auto_Waiting_and_Actionability_Checks]]
- [[WBS_1_2B_Browser_Context_Isolation_and_Memory_Optimization]]
- [[WBS_1_3A_Environment_Setup_CLI_and_Codegen]]
- [[WBS_1_3B_Playwright_UI_Mode_and_Trace_Viewer_Diagnostics]]
- [[Group_Presentation_Deck_Structure_and_Guidelines]]
- [[Team_Work_Breakdown_and_Contribution_Matrix_Template]]
