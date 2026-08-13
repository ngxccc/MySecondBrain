# MDS 3.0 Gaps Audit – NursingHomeManagement_V3

**Ngày:** 2026-07-03
**File nguồn:** `csdl.txt` (schema V3)
**Mục tiêu:** Phân tích chi tiết lỗ hổng so với MDS 3.0 RAI Manual (CMS) và PDPM requirements.

## 1. Tóm tắt MDS 3.0

MDS 3.0 là công cụ đánh giá bắt buộc cho viện dưỡng lão Mỹ (SNF) để:

- Chăm sóc & lập kế hoạch
- Hoàn trả Medicare/Medicaid (PDPM)
- Đo lường chất lượng (Quality Measures)
- Báo cáo CMS qua iQIES

**Các section chính (RAI Manual):**

- **A**: Identification Information
- **B**: Hearing, Speech, Vision
- **C**: Cognitive Patterns
- **D**: Mood
- **E**: Behavior
- **F**: Preferences for Customary Routine
- **GG**: Functional Abilities and Goals (thay thế Section G cũ, cực kỳ quan trọng cho PDPM PT/OT)
- **H**: Bladder and Bowel
- **I**: Active Diagnoses (dùng để phân loại PDPM clinical categories)
- **J**: Health Conditions (surgical procedures)
- **K**: Swallowing/Nutritional Status
- **L**: Oral/Dental Status
- **M**: Skin Conditions (wound staging, pressure ulcers – rất chi tiết)
- **N**: Medications
- **O**: Special Treatments, Procedures, Programs
- **P**: Restraints
- **Q**: Participation in Assessment and Goal Setting
- **V**: Care Area Assessment (CAA) Summary
- **X**: Correction Request
- **Z**: Assessment Administration (HIPPS code cho billing)

## 2. Lỗ hổng chi tiết trong schema V3

### 2.1. Thiếu hoàn toàn cấu trúc MDS

**Hiện tại:** Chỉ có bảng chung

- `assessments` (adl_total_score, suggested_care_level, confirmed_care_level)
- `assessment_details` (score, notes, metric_id)
- `assessment_metrics` (ADL, IADL, BRADEN, MORSE)

**Lỗ hổng:**

- Không có bảng riêng cho từng Section A–Z/GG.
- Không hỗ trợ item-level coding (ví dụ: A0310A, A0310B, GG0130, M0300, v.v.).
- Không có version control và effective date của từng item set (MDS có nhiều item set khác nhau theo năm).
- Không có trường cho `assessment_reference_date` (ARD), `entry_date`, `discharge_date` theo chuẩn MDS.

**Mức độ:** Critical

### 2.2. Section M – Skin Conditions (Wound Care) – Thiếu hoàn toàn

**Yêu cầu MDS:**

- M0300: Pressure Ulcer Stages (Stage 1–4, Unstageable, DTI)
- M0300A–G: Number of ulcers at each stage
- M0300D: Unhealed pressure ulcers with worsening
- M1040: Other skin conditions / lesions
- Photo documentation, measurements, location, exudate, tissue type

**Schema hiện tại:** Không có bảng nào hỗ trợ.

**Lỗ hổng:** Không thể ghi nhận vết loét, staging, healing progress, photo. Đây là một trong những phần quan trọng nhất cho survey và PDPM (có ảnh hưởng đến NTA component).

**Mức độ:** Critical

### 2.3. Section GG – Functional Abilities and Goals

**Yêu cầu:**

- GG0130: Self-Care (eating, oral hygiene, toileting hygiene, etc.)
- GG0170: Mobility (bed mobility, transfers, walking, wheeling)
- Coding 1–6 + 7–9 (refused, not applicable, etc.)
- Admission, Discharge, and Interim performance

**Schema:** Chỉ có `adl_total_score` (int) – quá thô.

**Lỗ hổng:** Không thể tính điểm PDPM PT/OT component chính xác.

**Mức độ:** Critical

### 2.4. Section I – Active Diagnoses

**Yêu cầu:** Danh sách chẩn đoán đang hoạt động (ICD-10), dùng để map sang 10 PDPM Clinical Categories.

**Schema:** Không có bảng `resident_diagnoses` hoặc tương tự.

**Lỗ hổng:** Không hỗ trợ PDPM Clinical Category classification.

**Mức độ:** Critical

### 2.5. Section K – Nutritional Status & Swallowing

**Yêu cầu:**

- K0200: Height/Weight
- K0300: Weight loss
- K0310: Weight gain
- K0520: Nutritional approaches (tube feeding, mechanically altered diet, etc.)
- Swallowing disorders

**Schema:** Không có.

**Mức độ:** High

### 2.6. Section Z & Billing (HIPPS Code)

**Yêu cầu:**

- Z0100: HIPPS code (5-character code for PDPM payment)
- Z0150: Is this a Medicare Part A stay?
- Transmission fields (A0410, etc.)

**Schema:** `invoices` chỉ có tổng tiền, không có HIPPS hay PDPM component breakdown.

**Mức độ:** Critical (liên quan trực tiếp đến doanh thu)

### 2.7. Các section còn thiếu khác

- **Section J** (Health Conditions – surgical procedures): Thiếu
- **Section O** (Special Treatments – dialysis, chemotherapy, radiation, etc.): Thiếu
- **Section V** (CAA – Care Area Assessment): Thiếu hoàn toàn
- **Section X** (Correction Request): Không hỗ trợ
- **Date fields chuẩn MDS**: Không có `entry_date`, `ARD`, `target_date`, `completion_date` theo định dạng MDS.

## 3. Tác động kinh doanh & tuân thủ

- Không thể gửi MDS lên CMS → không được thanh toán Medicare Part A.
- Không pass survey (infection control, wound care, nutrition là các tag hay bị phạt).
- Không hỗ trợ PDPM → mất doanh thu nghiêm trọng.
- Không có dữ liệu để tính Quality Measures (nhiều QM dựa trực tiếp vào MDS items).

## 4. Khuyến nghị thiết kế

1. Tạo schema mới cho MDS:
   - `mds_assessments` (id, resident_id, assessment_type, reference_date, status, transmitted_at)
   - `mds_items` (assessment_id, section, item_code, value, response_text)
   - Hoặc dùng JSONB cho linh hoạt (khuyến nghị ban đầu).

2. Bổ sung bảng chuyên biệt:
   - `wound_assessments` (Section M)
   - `functional_assessments` (Section GG)
   - `resident_diagnoses` (Section I – ICD10 + PDPM category)
   - `nutritional_assessments` (Section K)

3. Thêm trường PDPM:
   - `pdpm_classification` (clinical_category, PT_component, OT_component, NTA, Nursing, etc.)

4. Hỗ trợ transmission:
   - Thêm bảng `mds_transmissions` (file_name, status, cms_response, error_details)

**Lưu ý:** Nên tham khảo trực tiếp **CMS MDS 3.0 RAI User's Manual** (phiên bản mới nhất) khi implement.

---

_Audit document này dùng để process từng issue trong quá trình refactor schema._
