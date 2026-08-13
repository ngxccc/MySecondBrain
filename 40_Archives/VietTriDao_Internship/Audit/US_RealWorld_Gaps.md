# Lỗ hổng so với hệ thống thực tế tại Mỹ (US Real-World Systems)

**Ngày:** 2026-07-03
**Nguồn:** Phân tích schema V3 (`csdl.txt`) so với PointClickCare, MatrixCare, WellSky, Aline, ECP

Các hệ thống thực tế (PointClickCare chiếm ~65% SNF, MatrixCare đa môi trường, WellSky, Aline, ECP) đều có module chuyên biệt: MDS/PDPM, Infection Control (tiêu chí McGeer), Wound Care (ảnh + staging), Dietary/MealTracker, Family Portal (nhắn tin/video), Grievance, AI dự đoán rủi ro. Schema V3 chủ yếu dùng bảng chung.

## Các lỗ hổng nghiêm trọng

### 1. Thiếu cấu trúc MDS 3.0 (Nghiêm trọng)

**Schema hiện tại:** Chỉ có `assessments` + `assessment_details` chung (ADL/IADL/Braden/Morse).

**Thực tế:** PointClickCare/MatrixCare có MDS Management Center đầy đủ 100+ item, section A-Z, tự động đẩy sang PDPM/billing.

**Phản biện:**

- RegulatoryExpert: “CMS hoàn toàn dựa vào MDS để hoàn trả; điểm số chung không đủ cho audit.”
- IndustryResearcher: “Thiếu ở 100% top 5 nền tảng.”

**Khuyến nghị:** Thêm bảng `mds_assessments`, `mds_sections`, `mds_items` (phiên bản hóa).

---

### 2. Thiếu trường PDPM (Nghiêm trọng)

**Schema hiện tại:** `invoices` chỉ tách mức cao, thiếu NTA, phút PT/OT/SLP, thành phần nursing, CMI.

**Thực tế:** Hai nền tảng lớn tích hợp PDPM trực tiếp từ clinical → billing.

**Phản biện:**

- SchemaArchitect: “Làm hỏng độ chính xác tài chính của SNF.”

**Khuyến nghị:** Mở rộng `invoices`/`invoice_line_items` hoặc bảng `pdpm_calculations`.

---

### 3. Thiếu module Infection Control / Outbreak / Antibiotic Stewardship (Cao)

**Schema hiện tại:** Chỉ có `incidents` (FALL/MED_ERROR…).

**Thực tế:** PointClickCare giám sát thời gian thực; MatrixCare dùng tiêu chí McGeer.

**Phản biện:**

- RegulatoryExpert: “Khảo sát bang/liên bang yêu cầu bắt buộc; thiếu = vi phạm tuân thủ.”

**Khuyến nghị:** Thêm `infections`, `infection_events`, `antibiotic_orders`, `outbreak_logs`.

---

### 4. Thiếu module Wound/Pressure Injury chuyên biệt (Cao)

**Schema hiện tại:** Chỉ dùng `clinical_records` + `vital_signs`.

**Thực tế:** Upload ảnh, đo tự động, staging, theo dõi lành.

**Phản biện:**

- IndustryResearcher: “Chăm sóc vết thương là lĩnh vực doanh thu/rủi ro lâm sàng hàng đầu.”

**Khuyến nghị:** `wound_assessments`, `wound_photos`, `wound_staging`.

---

### 5. Thiếu Dietary/Nutrition/Meal Management (Cao)

**Schema hiện tại:** Hoàn toàn không có ngoài `care_plans`.

**Thực tế:** MatrixCare MealTracker, menu tích hợp, dị ứng, theo dõi lượng ăn.

**Phản biện:**

- HIPAA Auditor: “Hạn chế ăn uống là PHI, cần mã hóa + kiểm soát truy cập như `resident_sensitive_info`.”

**Khuyến nghị:** `dietary_orders`, `meal_plans`, `nutrition_assessments`, `food_allergies`.

---

### 6. Thiếu mô hình dữ liệu Family/Resident Portal (Cao)

**Schema hiện tại:** Chỉ có `contacts` + `notifications`.

**Thực tế:** PointClickCare Connected Care Center, MatrixCare Connect/Engage (nhắn tin, video, chia sẻ tài liệu, xem care plan).

**Phản biện:** Tất cả agent đồng ý đây là điểm khác biệt lớn của nhà vận hành hiện đại.

**Khuyến nghị:** `portal_messages`, `family_consents`, `portal_access_logs`, `video_calls`.

---

### 7. Thiếu theo dõi Grievance/Complaint riêng biệt (Trung bình-Cao)

**Schema hiện tại:** Chỉ có `incidents`.

**Thực tế:** Module grievance riêng trong risk/incident để sẵn sàng khảo sát.

**Phản biện:**

- RegulatoryExpert: “CMS yêu cầu log grievance; gộp chung với incident làm mất audit trail.”

**Khuyến nghị:** `grievances`, `grievance_resolutions`.

---

### 8. Thiếu tích hợp Lab/Pharmacy + HL7/FHIR (Trung bình)

**Schema hiện tại:** Không có.

**Thực tế:** e-prescribe, nhập kết quả lab, giao diện nhà thuốc.

**Phản biện:**

- SchemaArchitect: “Rủi ro mở rộng; cần bảng `integration_events` + cột `external_id`.”

**Khuyến nghị:** Thêm bảng `integration_events` và các cột external reference.

---

### 9. Thiếu theo dõi Staff Competency/Training/License Renewal (Trung bình)

**Schema hiện tại:** Chỉ có `users.license_number` (tĩnh).

**Thực tế:** Theo dõi CE, checklist competency cho tỷ lệ DON/RN/CNA.

**Khuyến nghị:** `staff_credentials`, `training_records`, `license_renewals`.

---

### 10. Hạn chế Corporate/Multi-Facility Hierarchy & QAPI (Trung bình)

**Schema hiện tại:** Chỉ có `user_facilities` dạng phẳng.

**Thực tế:** Báo cáo chuỗi, theo dõi QAPI (Quality Assurance Performance Improvement).

**Khuyến nghị:** `organizations`, `facility_groups`, `qapi_projects`.

---

**Ghi chú:** File này dùng để audit và process từng issue riêng biệt. Kết hợp với file `MDS_3.0_Gaps.md` để có cái nhìn đầy đủ.
