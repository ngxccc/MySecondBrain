---
tags: [project/viettridao, type/concept]
date: 2026-06-25
aliases:
  - Tài liệu thiết kế giao diện hệ thống quản lý viện dưỡng lão Mỹ
  - US Nursing Home UI/UX Design Standards
---

# 🎨 US Nursing Home UI/UX Design Standards

## TL;DR

Tài liệu định hướng và đặc tả quy chuẩn thiết kế giao diện (UI/UX) cho hệ thống Quản lý viện dưỡng lão tại Mỹ (LTPAC EHR/EMR & ERP), lấy cảm hứng từ các hệ thống dẫn đầu thị trường như **PointClickCare** và **MatrixCare**. Hướng dẫn tập trung vào phối màu y tế chuyên nghiệp, tối ưu hóa bố cục bảng điều khiển và các quy tắc tương tác bảo vệ an toàn y khoa.

---

## 🎨 1. Hệ Màu Sắc & Nhận Diện (Color Palette & Typography)

### A. Màu Sắc Chủ Đạo (Color Palette)

Giao diện y tế tại Mỹ yêu cầu sự tin cậy, sạch sẽ và độ tương phản cao để tránh nhầm lẫn khi đọc hồ sơ bệnh án:

- **Primary Color (Xanh biển đậm):** `#0F172A` (Slate 900) hoặc `#1E3A8A` (Blue 900).
  - _Ý nghĩa:_ Đại diện cho sự tin cậy, chuyên nghiệp, cấu trúc hệ thống doanh nghiệp (Enterprise).
- **Secondary Color (Xanh mòng két / Slate xám):** `#0D9488` (Teal 600) hoặc `#475569` (Slate 600).
  - _Ý nghĩa:_ Mang lại cảm giác lâm sàng sạch sẽ, vệ sinh và dịu mắt cho nhân viên ca trực đêm.
- **Background (Nền sáng):** `#F8FAFC` (Slate 50) hoặc `#FFFFFF`.
  - _Ý nghĩa:_ Tối ưu hóa độ tương phản. Trong môi trường y tế, giao diện nền sáng (Light Mode) được ưu tiên tuyệt đối cho các bảng điều khiển lâm sàng nhằm tăng khả năng đọc dưới ánh đèn bệnh viện.
- **Status Alert Colors (Màu trạng thái theo tiêu chuẩn lâm sàng):**
  - $\colorbox{#EF4444}{\color{white}{\text{Đỏ (Rose 500) - Overdue / Critical}}}$ (`#EF4444`): Cảnh báo phát thuốc trễ, hoặc các trường hợp nguy cấp như té ngã, mạch tụt.
  - $\colorbox{#F59E0B}{\color{white}{\text{Vàng (Amber 500) - Upcoming / Pending}}}$ (`#F59E0B`): Việc cần làm sắp tới, ca trực sắp đến, hoặc trạng thái cần xem xét lại.
  - $\colorbox{#10B981}{\color{white}{\text{Xanh lá (Emerald 500) - Administered / Completed}}}$ (`#10B981`): Đã phát thuốc, đã hoàn thành nhiệm vụ chăm sóc.

### B. Typography (Phông chữ & Cỡ chữ)

- **Font Family:** Ưu tiên hàng đầu các phông chữ Sans-serif như `Inter`, `Segoe UI`, hoặc hệ thống `system-ui`. Tránh hoàn toàn các font có chân (Serif) để tăng tốc độ quét thông tin bằng mắt của y tá.
- **Kích thước & Độ tương phản:** Cỡ chữ nội dung từ `14px` đến `16px`. Chữ màu đen hoặc xám đậm trên nền trắng để đạt tỷ lệ tương phản tối thiểu **4.5:1** theo tiêu chuẩn WCAG 2.1 AA của Mỹ.

---

## 📐 2. Bố Cục Giao Diện Tổng Thể (Layout Structure)

Hệ thống được thiết kế theo cấu trúc **3 vùng chức năng cố định** để người dùng không bị mất phương hướng khi chuyển đổi giữa các phân hệ:

1. **Sidebar Navigation (Thanh điều hướng trái):**
   - Có thể thu gọn (collapsible) để tiết kiệm không gian trên máy tính bảng.
   - Chứa các phân hệ cốt lõi: Dashboard, Resident Directory (Danh bạ cư dân), eMAR (Quản lý phát thuốc), CNA Tasks (Việc chăm sóc hàng ngày), Billing & Financials (Hóa đơn & Bảo hiểm), và Intake Assessment (Đánh giá nhập viện).
2. **Top Header (Thanh đầu trang):**
   - Chứa thanh **Global Search** (Tìm kiếm cư dân tức thời theo Tên hoặc Ngày sinh).
   - Bộ lọc cơ sở (Facility Picker) - cho phép chuyển đổi giữa các chi nhánh hoặc khu nhà.
   - Nút Notification Center (Hiển thị các cảnh báo khẩn cấp từ hệ thống eMAR).
3. **Main Content Area (Vùng nội dung chính):**
   - Thiết kế dạng thẻ (Card-based) giúp phân nhóm thông tin trực quan.
   - Tận dụng cơ chế cuộn độc lập cho các bảng danh sách lớn để tiêu đề cột luôn cố định ở đầu trang.

---

## ⚡ 3. Nguyên Tắc Thiết Kế UX Đặc Thù Y Khoa (Clinical UX Principles)

### A. Quy Trình "5 Rights" eMAR Verification (Thiết kế Modal Phát Thuốc)

Để ngăn ngừa lỗi y khoa, khi y tá bấm vào nút phát thuốc ("Pass Med"), hệ thống phải hiển thị một hộp thoại xác thực từng bước (Wizard Modal) yêu cầu check đủ 5 yếu tố:

1. **Right Resident (Đúng cư dân):** Quét mã vạch trên vòng đeo tay (simulated barcode scan) để khớp hồ sơ.
2. **Right Medication (Đúng loại thuốc):** Quét mã vạch trên vỉ thuốc/hộp thuốc.
3. **Right Dose (Đúng liều lượng):** Hiển thị rõ số lượng viên/ml cần uống bằng font chữ lớn.
4. **Right Route (Đúng đường dùng):** Ghi rõ uống, tiêm, hoặc bôi ngoài da.
5. **Right Time (Đúng thời gian):** Hệ thống ghi nhận dấu thời gian thực (Timestamp) khi nút bấm hoàn tất được nhấn.

### B. Thiết Kế Hỗ Trợ Thiết Bị Di Động của CNA (CNA Point-of-Care)

CNAs (Certified Nursing Assistants) là những người trực tiếp tắm rửa, cho ăn và dìu cư dân đi lại. Họ thường sử dụng máy tính bảng nhỏ khi di chuyển:

- **Click Targets lớn:** Các ô checkbox hoàn thành tác vụ ADL (Bathing, Eating, Toileting) phải có kích thước tối thiểu **48px x 48px** để dễ dàng chạm bằng một tay.
- **Nhập liệu nhanh (One-tap logging):** Sử dụng các nút chọn nhanh thay vì bắt nhập văn bản bằng bàn phím ảo.

### C. Tự Động Hóa Dòng Chảy Dữ Liệu (Centralized Data Flow Visualization)

- Khi thực hiện **Intake Assessment** đánh giá khả năng tự sinh hoạt (ADL), điểm phụ thuộc của cư dân sẽ tự động tính toán ra **Level of Care (LOC) Rate** tương ứng. Giao diện cần cập nhật tức thì phần tiền phòng/học phí tương ứng của cư dân để người nhà/kế toán kiểm tra trực quan.

---

## Related Notes

- Project MOC: [[000_VietTriDao_MOC]]
- Nghiên cứu hệ thống: [[Nursing_Home_System_Research]]
- Phân hệ cốt lõi: [[US_Nursing_Home_Core_Modules]]
- Quy trình đánh giá: [[US_Nursing_Home_Intake_Assessment]]
