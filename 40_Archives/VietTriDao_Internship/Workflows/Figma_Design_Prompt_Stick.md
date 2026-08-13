---
tags: [project/viettridao, type/guide]
date: 2026-06-26
aliases: [Figma Design Prompt for Stick, Prompt Thiết Kế Figma cho Stick]
---

# 🎨 Guide: UI/UX Research & Figma Design Prompt for Stick (US Nursing Home System)

## 💡 TL;DR

Tài liệu này tổng hợp kết quả nghiên cứu cấu trúc layout, UI/UX của hệ thống Quản lý viện dưỡng lão tại Mỹ (LTPAC EHR/EMR) dựa trên các tiêu chuẩn thực tế (PointClickCare, MatrixCare) và bản mẫu tương tác lâm sàng `us-nursing-home-dashboard.html`. Đồng thời cung cấp một prompt thiết kế Figma cực kỳ chi tiết bằng cả tiếng Việt và tiếng Anh để gửi cho Stick (Designer của nhóm) để dựng UI chuẩn chỉ trên Figma.

---

## 🔍 1. Kết Quả Nghiên Cứu Layout & UI/UX (LTPAC EHR/EMR Standards)

Dựa trên tài liệu đặc tả `US_Nursing_Home_UI_Design.md` và mã nguồn nguyên mẫu `us-nursing-home-dashboard.html`, giao diện của hệ thống **CareFlow LTPAC** cần tuân thủ các quy chuẩn nghiêm ngặt của môi trường lâm sàng tại Mỹ:

### A. Bố Cục 3 Vùng Cố Định (3-Zone Fixed Layout)

1. **Sidebar Navigation (Thanh điều hướng trái):**
   - Nên dùng màu tối (e.g. Slate 900 `#0F172A` hoặc Slate 950 `#020617`) để tạo ranh giới thị giác rõ ràng với nội dung chính.
   - Có thể thu gọn (collapsible) để tối ưu hóa không gian hiển thị trên máy tính bảng (CNA/Nurse Tablet).
   - Chứa logo: **CareFlow LTPAC** và danh sách Menu:
     - _Dashboard_ (Bảng điều khiển lâm sàng tổng quan)
     - _Resident Directory_ (Danh bạ & hồ sơ cư dân)
     - _eMAR (Med-Pass)_ (Quản lý phát thuốc lâm sàng)
     - _CNA Care Log_ (Nhật ký chăm sóc hàng ngày của hộ lý)
     - _Billing & RCM_ (Hóa đơn và doanh thu bảo hiểm)
     - _Intake & MDS_ (Đánh giá đầu vào & phân bậc Level of Care)
   - Chân trang hiển thị thông tin người dùng: **Sarah Jenkins, RN** (Floor Charge Nurse).

2. **Top Header (Thanh đầu trang cố định):**
   - Màu sáng (White) làm nổi bật các chức năng kiểm soát nhanh.
   - Chứa:
     - **Facility Picker** (Dropdown chọn khu vực/chi nhánh: _Silver Springs Care - East Wing_, _West Wing_, _Memory Unit_).
     - **Global Search Bar** (Tìm kiếm cư dân tức thời theo Tên, Số phòng, hoặc Ngày sinh).
     - **Notification Center** (Nút chuông hiển thị thông báo khẩn, đặc biệt từ eMAR phát thuốc trễ).
     - **Shift Time Indicator** (Hiển thị ca trực hiện tại: e.g. _Shift Time: 08:00 AM - 04:00 PM_).

3. **Main Content Area (Vùng nội dung chính):**
   - Nền màu Slate 50 (`#F8FAFC`) để các thẻ nội dung (Card-based layout) màu trắng (`#FFFFFF`) nổi lên một cách sạch sẽ, rõ ràng.
   - Sử dụng cơ chế cuộn độc lập cho bảng dữ liệu (Scrollable body with fixed table headers) để y tá luôn nhìn thấy tiêu đề cột khi cuộn.

### B. Hệ Màu Sắc & Typography Lâm Sàng

- **Primary Color:** Xanh biển đậm (`#0F172A` hoặc `#1E3A8A`) tạo cảm giác chuyên nghiệp, tin cậy của phần mềm doanh nghiệp (Enterprise SaaS).
- **Secondary Color:** Xanh mòng két / Teal (`#0D9488`) mang lại cảm giác lâm sàng sạch sẽ, dịu mắt.
- **Background:** Slate 50 (`#F8FAFC`) kết hợp nền trắng (`#FFFFFF`). Tránh dùng Dark Mode cho bảng lâm sàng chính để bảo vệ mắt của y tá dưới ánh đèn bệnh viện và tăng tốc độ đọc dữ liệu bệnh án.
- **Trạng thái cảnh báo (Status Alert Colors):**
  - **Đỏ (Rose 500 - `#EF4444`):** Overdue/Critical (Phát thuốc trễ, báo động lâm sàng, té ngã).
  - **Vàng (Amber 500 - `#F59E0B`):** Upcoming/Pending (Thuốc sắp phát, ca trực sắp đến, việc cần theo dõi).
  - **Xanh lá (Emerald 500 - `#10B981`):** Completed/Administered (Đã phát thuốc, đã hoàn thành nhiệm vụ chăm sóc).
- **Typography:** Sử dụng font Sans-serif sạch sẽ như `Inter` hoặc `Segoe UI`. Size chữ từ `14px` (nội dung bảng/nhập liệu) đến `16px` (đọc văn bản) để đảm bảo độ tương phản tối thiểu **4.5:1** theo tiêu chuẩn WCAG 2.1 AA của Mỹ. Tránh hoàn toàn Serif font.

### C. Các Màn Hình & Thành Phần Tương Tác Cốt Lõi (Interactive Components)

1. **Clinical Dashboard:**
   - Bộ 4 thẻ chỉ số nhanh (Metric Cards):
     - _Occupancy / Residents:_ 42 / 48 beds (88% capacity rate).
     - _Average Acuity Score:_ 3.2 / 5.0 (Moderate to High Care).
     - _Staffing Ratio:_ 1 : 6 (Compliant - Max 1:8).
     - _Overdue Med-Passes:_ 1 (Requires Immediate Action - Highlight màu Rose đỏ).
   - Bảng **eMAR Active Med-Pass (Current Shift)** hiển thị danh sách các cư dân cần phát thuốc trong ca, kèm nút hành động "Pass Med".

2. **Intake Assessment & Level of Care (LOC) Calculator:**
   - Thiết kế dạng 2 cột:
     - _Cột trái (Input):_ Form đánh giá 4 nhóm ADL cốt lõi (Bathing, Eating, Transferring, Toileting). Mỗi nhóm có 3 nút lựa chọn nhanh: **Independent** (Độc lập - 0 điểm), **Assisted** (Hỗ trợ - 2 điểm), **Dependent** (Phụ thuộc hoàn toàn - 4 điểm).
     - _Cột phải (Real-time Billing Output):_ Thẻ nền tối (`#0F172A`) hiển thị điểm ADL Score cập nhật thời gian thực, cấp độ chăm sóc (Level of Care Tier: e.g. Tier 1 - Light), giá tiền ước tính mỗi tháng (e.g. $4,000/month), danh sách công việc tự động kích hoạt cho CNA (Auto-injected CNA Care Checklist), và nút CTA "Confirm Intake & Save Record".

3. **"5 Rights" eMAR Verification Modal (Quy trình chống lỗi y khoa):**
   - Modal hiển thị khi y tá nhấn "Pass Med".
   - Chứa thông tin bệnh nhân và loại thuốc ở đầu.
   - Checklist 5 bước bắt buộc:
     1. _Right Resident:_ Nút "Scan Wristband" (mô phỏng quét mã vạch vòng tay cư dân).
     2. _Right Medication:_ Nút "Scan Medication" (mô phỏng quét mã vạch vỉ thuốc).
     3. _Right Dose:_ Hiển thị rõ số lượng (e.g. "1 Tablet").
     4. _Right Route:_ Hiển thị đường dùng (e.g. "Oral (PO)").
     5. _Right Time:_ Tự động điền timestamp khi xác nhận.
   - Nút "Confirm Administration" chỉ sáng lên khi 2 bước quét mã vạch ở trên đã được thực hiện thành công (có dấu tick xanh lá).

4. **CNA Mobile/Tablet UI (Giao diện hộ lý đi động):**
   - Tối ưu hóa cho màn hình cảm ứng: targets kích thước tối thiểu **48px x 48px** để dễ dàng chạm bằng một tay.
   - Thiết kế các nút chọn nhanh (One-tap logging) thay vì bắt nhập văn bản bằng bàn phím ảo.

---

## 📝 2. Figma Design Prompt for Stick (Bilingual)

Hãy gửi toàn bộ đoạn prompt dưới đây cho Stick (Designer) để bắt đầu thiết kế giao diện trên Figma.

---

### 🇻🇳 BẢN TIẾNG VIỆT: PROMPT THIẾT KẾ FIGMA CHO STICK

**Chủ đề thiết kế:** Hệ thống Quản lý Viện dưỡng lão tại Mỹ (CareFlow LTPAC - EHR/EMR & ERP System).
**Mục tiêu:** Tạo bộ giao diện Dashboard, màn hình Intake ADL Assessment, eMAR Modal phát thuốc và giao diện Mobile/Tablet cho CNA. Thiết kế cần thể hiện tính chuyên nghiệp (Enterprise B2B), sạch sẽ, trực quan y tế, giúp giảm tải sự mệt mỏi cho y tá/hộ lý và ngăn ngừa lỗi y khoa.

#### 1. Hệ Thống Thiết Kế (Design System & Variables)

- **Màu sắc chủ đạo (Colors):**
  - `Primary (60%):` Slate 900 (`#0F172A`) hoặc Blue 900 (`#1E3A8A`) cho Sidebar và text chính.
  - `Secondary/Clinical (30%):` Teal 600 (`#0D9488`) hoặc Slate 600 (`#475569`) cho các nút lâm sàng, icon và hover state.
  - `Background:` Slate 50 (`#F8FAFC`) cho nền trang; White (`#FFFFFF`) cho các thẻ (Cards) và bảng biểu.
  - `Alert States (10%):`
    - _Critical/Overdue (Đỏ):_ Rose 500 (`#EF4444`) kèm background tint nhạt (`#FEF2F2`).
    - _Warning/Upcoming (Vàng):_ Amber 500 (`#F59E0B`) kèm background tint nhạt (`#FEF3C7`).
    - _Completed/Success (Xanh lá):_ Emerald 500 (`#10B981`) kèm background tint nhạt (`#ECFDF5`).
- **Typography:** Sử dụng duy nhất font Sans-serif `Inter` (hoặc hệ thống `system-ui`).
  - Không dùng Serif font.
  - Cỡ chữ chính: `14px` cho dữ liệu bảng/nhập liệu, `16px` cho text dài. Đảm bảo tỷ lệ tương phản tối thiểu 4.5:1 (WCAG 2.1 AA) để dễ đọc dưới ánh đèn bệnh viện.

#### 2. Bố Cục Tổng Thể (Layout Structure - Desktop Web App)

- **Sidebar (Cố định bên trái, màu tối `#0F172A`):**
  - Chứa logo: **CareFlow LTPAC** và danh sách Menu: _Dashboard_, _Resident Directory_, _eMAR (Med-Pass)_, _CNA Care Log_, _Billing & RCM_, _Intake & MDS_.
  - Chân trang hiển thị User Profile: _Sarah Jenkins, RN | Floor Charge Nurse_ kèm avatar initials "SJ".
  - Hỗ trợ trạng thái Collapsed (thu gọn chỉ hiện icon).
- **Header (Cố định phía trên, màu trắng):**
  - Facility Picker: Dropdown chọn cơ sở (mẫu: _Silver Springs Care - East Wing_).
  - Global Search Bar: Tìm kiếm cư dân theo Tên, Số phòng, hoặc Ngày sinh (mẫu placeholder: "Search resident by name, room, or DOB...").
  - Notification Center (Nút chuông) hiển thị số thông báo khẩn (màu đỏ).
  - Shift Time: "Shift Time: 08:00 AM - 04:00 PM".
- **Vùng Nội Dung Chính (Main Content Area):**
  - Nền Slate 50. Các cụm chức năng được nhóm trong các thẻ Card trắng (`#FFFFFF`) có bo góc (`rounded-xl` / `12px`), bóng đổ nhẹ.

#### 3. Các Màn Hình Chi Tiết Cần Thiết Kế

##### Màn hình 1: Clinical Dashboard (Bảng điều khiển lâm sàng)

- **Bộ 4 thẻ chỉ số nhanh (Metric Cards):**
  1.  _Occupancy:_ "42 / 48 beds" (phụ: "● 88% capacity rate").
  2.  _Average Acuity Score:_ "3.2 / 5.0" (phụ: "▲ Moderate to High Care").
  3.  _Staffing Ratio:_ "1:6" (phụ: "✓ Compliant").
  4.  _Overdue Med-Passes:_ "1" (phụ: "Requires Immediate Action", toàn bộ card có viền đỏ Rose 500 hoặc chữ số màu đỏ để gây chú ý).
- **Bảng dữ liệu eMAR Active Med-Pass (Hàng đợi phát thuốc):**
  - Tiêu đề bảng cố định. Các hàng dữ liệu hiển thị thông tin cư dân: Avatar initials (ví dụ: "AP"), Tên ("Arthur Pendelton"), Số phòng ("Room 104-A"), Tên thuốc ("Lisinopril 10mg PO - Daily"), Giờ phát ("Scheduled: 09:00 AM").
  - Trạng thái hàng: Hàng quá giờ có nhãn "Overdue" màu đỏ; hàng sắp đến có nhãn "Upcoming" màu vàng; hàng đã phát có nhãn "Administered" màu xanh lá (và text bị gạch ngang mờ).
  - Nút hành động "Pass Med" nằm ở cuối mỗi hàng.

##### Màn hình 2: Intake ADL Assessment & Level of Care (Màn hình đánh giá nhập viện)

- Bố cục chia đôi (2 cột):
  - **Cột trái (Form nhập liệu):** Các nhóm đánh giá ADL: _Bathing, Eating, Transferring, Toileting_. Mỗi nhóm là một hàng có nhãn rõ ràng và cụm 3 nút lựa chọn lớn dạng Segmented Control: `Independent`, `Assisted (+2 pts)`, `Dependent (+4 pts)`.
  - **Cột phải (Billing & Care Summary):** Một thẻ màu tối (`#0F172A`) hiển thị kết quả thời gian thực:
    - Chỉ số _ADL Dependency Score_ to rõ màu Teal (`#0D9488`).
    - Cấp bậc _Level of Care Tier_ (ví dụ: Tier 1 - Light).
    - Giá tiền ước tính mỗi tháng (ví dụ: "$4,000 / month").
    - Danh sách checklist CNA tự động sinh ra tương ứng (ví dụ: "Standby oversight for daily ADLs").
    - Nút CTA lớn màu Teal: "Confirm Intake & Save Record".

##### Màn hình 3: Modal Xác Thực "5 Rights" eMAR

- Hộp thoại Modal đè lên màn hình Dashboard.
- Phần header của Modal hiển thị Tóm tắt thông tin: Tên cư dân, Số phòng, Tên thuốc, Liều lượng, Đường dùng.
- Thân Modal là danh sách 5 bước kiểm tra có đánh số tròn `1` đến `5`:
  1.  _Right Resident:_ Checkbox kèm nút bấm "Scan Wristband".
  2.  _Right Medication:_ Checkbox kèm nút bấm "Scan Medication".
  3.  _Right Dose:_ Trạng thái text tĩnh (ví dụ: "1 Tablet" font to đậm).
  4.  _Right Route:_ Trạng thái text tĩnh (ví dụ: "Oral (PO)").
  5.  _Right Time:_ Tự động hiển thị timestamp khi lưu.
      _(Lưu ý: Thể hiện trạng thái khi chưa quét (nút bấm nổi bật) và khi đã quét thành công (nút bấm ẩn đi, checkbox chuyển màu xanh lá có tick)._
- Nút CTA "Confirm Administration" ở dưới cùng.

##### Màn hình 4: Mobile/Tablet UI cho Hộ Lý (CNA Point-of-Care)

- Thiết kế khung viewport máy tính bảng/mobile (ví dụ: iPad Mini).
- Các vùng chạm bấm (click targets) như checkbox, nút hoàn thành tác vụ ADL phải to rõ, kích thước tối thiểu **48px x 48px** để dễ bấm bằng ngón tay khi đang di chuyển.
- Thiết kế dạng "One-tap log" (chạm 1 lần để hoàn thành) thay vì dùng bàn phím nhập liệu.

---

### 🇺🇸 ENGLISH VERSION: FIGMA DESIGN PROMPT FOR STICK

**Design Theme:** US Nursing Home Management System (CareFlow LTPAC - EHR/EMR & ERP System).
**Objective:** Create a professional, clinical-grade UI/UX design (Enterprise B2B look and feel) for a clinical dashboard, Intake ADL Assessment screen, eMAR Med-Pass modal, and a mobile/tablet view for CNAs. The design must emphasize high readability, intuitive data density, and clinical safety features to reduce clinician burnout and prevent medication errors.

#### 1. Design System & Variables

- **Color Palette:**
  - `Primary (60%):` Slate 900 (`#0F172A`) or Blue 900 (`#1E3A8A`) for Sidebar navigation and major text elements.
  - `Secondary/Clinical (30%):` Teal 600 (`#0D9488`) or Slate 600 (`#475569`) for buttons, active icons, and hovers.
  - `Background:` Slate 50 (`#F8FAFC`) for page background; White (`#FFFFFF`) for cards, tables, and dialogs.
  - `Alert States (10%):`
    - _Critical/Overdue:_ Rose 500 (`#EF4444`) with light red background tint (`#FEF2F2`).
    - _Warning/Upcoming:_ Amber 500 (`#F59E0B`) with light yellow background tint (`#FEF3C7`).
    - _Completed/Success:_ Emerald 500 (`#10B981`) with light green background tint (`#ECFDF5`).
- **Typography:** Use the Sans-serif `Inter` font family (or system default `system-ui`).
  - Strictly NO Serif fonts to ensure rapid scanning under bright hospital lighting.
  - Size hierarchy: `14px` for data tables/inputs, `16px` for body/forms. Target WCAG 2.1 AA compliance with at least 4.5:1 contrast ratio.

#### 2. Layout Structure (Desktop Web App)

- **Sidebar (Fixed Left, Dark theme `#0F172A`):**
  - Features the logo: **CareFlow LTPAC** and Menu list: _Dashboard_, _Resident Directory_, _eMAR (Med-Pass)_, _CNA Care Log_, _Billing & RCM_, _Intake & MDS_.
  - Footer features User Profile card: _Sarah Jenkins, RN | Floor Charge Nurse_ with initials avatar "SJ".
  - Must support collapsible state to icon-only mode for tablet viewport optimization.
- **Header (Fixed Top, White background):**
  - Facility Picker dropdown (e.g., "Silver Springs Care - East Wing").
  - Global Search Bar: Input box to search by Resident Name, Room, or DOB (e.g., "Search resident by name, room, or DOB...").
  - Notification Center bell icon with a red badge for critical alerts.
  - Shift Time indicator: "Shift Time: 08:00 AM - 04:00 PM".
- **Main Content Area:**
  - Slate 50 background. All information panels must be grouped in clean white (`#FFFFFF`) cards with rounded corners (`rounded-xl` / `12px`) and subtle shadows.

#### 3. Core Screens to Design

##### Screen 1: Clinical Dashboard

- **Metric Cards Row (4 cards):**
  1.  _Occupancy / Residents:_ "42 / 48 beds" (subtext: "● 88% capacity rate").
  2.  _Average Acuity Score:_ "3.2 / 5.0" (subtext: "▲ Moderate to High Care").
  3.  _Staffing Ratio:_ "1:6" (subtext: "✓ Compliant").
  4.  _Overdue Med-Passes:_ "1" (subtext: "Requires Immediate Action", styled with a Rose 500 red border or red text to indicate emergency status).
- **eMAR Active Med-Pass Table (Current Shift queue):**
  - Table layout with a sticky header. Rows represent scheduled medications: initials avatar, Resident Name ("Arthur Pendelton"), Room ("Room 104-A"), Medication Details ("Lisinopril 10mg PO - Daily"), Scheduled Time ("Scheduled: 09:00 AM").
  - Row states: Red "Overdue" badge, Yellow "Upcoming" badge, and Green "Administered" badge (with struck-through and faded text).
  - An active CTA button labeled "Pass Med" placed at the end of pending rows.

##### Screen 2: Intake ADL Assessment & Level of Care (LOC) Calculator

- Split-screen/2-column layout:
  - **Left Column (Input Form):** ADL assessment modules for _Bathing, Eating, Transferring, Toileting_. Each module is a row with clear labels and a segmented control consisting of 3 large buttons: `Independent`, `Assisted (+2 pts)`, `Dependent (+4 pts)`.
  - **Right Column (Billing Summary Card):** A dark-themed card (`#0F172A`) displaying real-time calculations:
    - Large Teal (`#0D9488`) _ADL Dependency Score_ display.
    - _Level of Care Tier_ indicator (e.g., Tier 1 - Light).
    - Estimated Monthly Rate (e.g., "$4,000 / month").
    - Auto-injected CNA care checklist items (e.g., "Standby oversight for daily ADLs").
    - Large Teal CTA button: "Confirm Intake & Save Record".

##### Screen 3: "5 Rights" eMAR Verification Modal

- A modal overlay centered over the Dashboard.
- Modal header displays summary: Resident Name, Room, Medication, Dosage, and Route.
- Modal body lists the 5 verification steps numbered `1` to `5`:
  1.  _Right Resident:_ Checkbox with a "Scan Wristband" button (simulates wristband barcode scanning).
  2.  _Right Medication:_ Checkbox with a "Scan Medication" button (simulates package barcode scanning).
  3.  _Right Dose:_ Static text indicator (e.g., "1 Tablet" in bold/large font).
  4.  _Right Route:_ Static text indicator (e.g., "Oral (PO)").
  5.  _Right Time:_ Automatically generated timestamp on action.
      _(Design note: Show state transitions: before scanning (action button highlighted) and after scanning (button hidden, green checkmark shown)._
- Disabled "Confirm Administration" CTA button at the bottom that becomes active only after steps 1 & 2 are successfully scanned.

##### Screen 4: CNA Mobile/Tablet UI (CNA Point-of-Care)

- Tablet viewport view (e.g., iPad Mini).
- All click/touch targets for daily ADL logging and checkboxes must be at least **48px x 48px** for easy one-handed tap controls.
- Focus on quick, one-tap selection states to log care tasks instead of keyboard-heavy entries.

---

## Related Notes

- Project MOC: [[000_VietTriDao_MOC]]
- UI Design Standards: [[US_Nursing_Home_UI_Design]]
- Core Modules Guide: [[US_Nursing_Home_Core_Modules]]
- Interactive Dashboard Prototype: [[us-nursing-home-dashboard.html]]
