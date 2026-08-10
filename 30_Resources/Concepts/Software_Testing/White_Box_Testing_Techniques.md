---
tags: [type/concept, topic/testing, layer/quality]
date: 2026-07-07
aliases:
  [
    Kiểm thử hộp trắng,
    White-box Testing Techniques,
    Độ phủ dòng lệnh Độ phủ nhánh,
  ]
description: "Kỹ thuật kiểm thử hộp trắng tập trung vào độ phủ dòng lệnh và độ phủ nhánh/quyết định."
---

# Kỹ thuật Kiểm thử Hộp trắng

## TL;DR

Kiểm thử hộp trắng là kỹ thuật thiết kế test case dựa trên việc phân tích cấu trúc mã nguồn bên trong của chương trình. Hai độ phủ cơ bản của kiểm thử hộp trắng là Độ phủ dòng lệnh (Statement Coverage) và Độ phủ nhánh/quyết định (Branch/Decision Coverage), giúp đo lường mức độ kiểm thử mã nguồn và hạn chế sót mã chưa chạy qua.

---

## Core Concept

Kiểm thử hộp trắng tập trung vào cấu trúc code bên trong (cú pháp, điều kiện rẽ nhánh, luồng điều khiển). Bộ tiêu chuẩn ISTQB định nghĩa hai độ phủ cốt lõi:

### 1. Độ phủ dòng lệnh

- **Nguyên lý:** Đo lường tỷ lệ các câu lệnh thực thi (executable statements) trong mã nguồn được chạy qua bởi các ca kiểm thử.
- **Mục tiêu:** Đảm bảo tất cả mã nguồn viết ra phải được chạy qua ít nhất một lần để tránh mã "chết" hoặc sai sót cú pháp cơ bản.
- **Công thức:**
  $$\text{Độ phủ dòng lệnh} = \frac{\text{Số câu lệnh đã thực thi}}{\text{Tổng số câu lệnh khả thi}} \times 100\%$$

### 2. Độ phủ quyết định

- **Nguyên lý:** Đo lường tỷ lệ các kết quả quyết định (decision outcomes) - tức là các nhánh Đúng (True) và Sai (False) tại mỗi điểm rẽ nhánh (như `if`, `switch`, vòng lặp) được chạy qua bởi các ca kiểm thử.
- **Mục tiêu:** Đảm bảo tất cả các điều kiện logic logic phải được đánh giá cả hai mặt True và False.
- **Công thức:**
  $$\text{Độ phủ quyết định} = \frac{\text{Số kết quả quyết định đã thực thi}}{\text{Tổng số kết quả quyết định có thể xảy ra}} \times 100\%$$

### 3. Quan hệ bao hàm

- **Nguyên lý:** Đạt được **100% Độ phủ quyết định** sẽ **đảm bảo đạt 100% Độ phủ dòng lệnh**.
- **Ngược lại:** Đạt được 100% Độ phủ dòng lệnh **chưa chắc** đã đạt được 100% Độ phủ quyết định (vì nhánh rẽ nhánh trống - không có mã thực thi bên trong - có thể bị bỏ qua).

---

## Practical Examples

### Bài toán phân tích độ phủ mã nguồn

Cho hàm JavaScript đơn giản sau:

```javascript
function checkLimit(value) {
  let status = "NORMAL"; // Dòng 1 (Câu lệnh 1)
  if (value > 100) {
    // Dòng 2 (Điểm quyết định: True/False)
    status = "ALERT"; // Dòng 3 (Câu lệnh 2)
  }
  return status; // Dòng 4 (Câu lệnh 3)
}
```

#### Phân tích cấu trúc

- **Tổng số câu lệnh thực thi:** 3 câu lệnh (Dòng 1, Dòng 3, Dòng 4).
- **Tổng số kết quả quyết định:** 2 kết quả (Dòng 2 rẽ nhánh `True` khi `value > 100` hoặc `False` khi `value <= 100`).

---

#### Kịch bản 1: Chỉ chạy duy nhất 1 Test Case với `value = 150`

- **Luồng thực thi:** Dòng 1 $\rightarrow$ Dòng 2 (`value > 100` $\rightarrow$ True) $\rightarrow$ Dòng 3 $\rightarrow$ Dòng 4.
- **Độ phủ dòng lệnh:**
  - Các câu lệnh được chạy qua: Dòng 1, Dòng 3, Dòng 4 (3/3 câu lệnh).
  - Tỷ lệ: $100\%$.
- **Độ phủ quyết định:**
  - Kết quả rẽ nhánh được chạy qua: Chỉ có nhánh `True` (1/2 kết quả).
  - Tỷ lệ: $50\%$.

> **Nhận xét:** Dù đạt 100% Độ phủ dòng lệnh, ta vẫn bỏ sót nhánh `False` của điều kiện ở Dòng 2. Nếu logic khi `value <= 100` bị lỗi, kiểm thử này sẽ không phát hiện ra.

---

#### Kịch bản 2: Bổ sung Test Case 2 với `value = 50` để đạt 100% Độ phủ quyết định

Ta thực hiện hai test case:

1. **TC1:** `value = 150` (Chạy qua nhánh `True`).
2. **TC2:** `value = 50` (Chạy qua nhánh `False`).

- **Luồng thực thi của TC2:** Dòng 1 $\rightarrow$ Dòng 2 (`value > 100` $\rightarrow$ False) $\rightarrow$ Dòng 4.
- **Độ phủ dòng lệnh:** Đã được phủ đầy đủ từ TC1 ($100\%$).
- **Độ phủ quyết định:**
  - Cả hai nhánh `True` (từ TC1) và `False` (từ TC2) đều được thực thi (2/2 kết quả).
  - Tỷ lệ: $100\%$.

---

## Related Notes

- [[Error_Defect_Failure]]: Các khái niệm cơ bản về sai sót phần mềm.
- [[7_Principles_of_Testing]]: 7 nguyên lý kiểm thử định hình hoạt động kiểm định.
- [[Black_Box_Testing_Techniques]]: So sánh đối chiếu với kỹ thuật kiểm thử hộp đen.
- [[30_Resources/Concepts/000_Concepts_MOC.md|Concepts MOC]]
