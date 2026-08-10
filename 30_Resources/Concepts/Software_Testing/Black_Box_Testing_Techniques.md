---
tags: [type/concept, topic/testing, layer/quality]
date: 2026-07-07
aliases:
  [
    Kiểm thử hộp đen,
    Black-box Testing Techniques,
    Phân vùng tương đương Phân tích giá trị biên,
  ]
description: "Kỹ thuật kiểm thử hộp đen tập trung vào phân vùng tương đương (EP) và phân tích giá trị biên (BVA)."
---

# Kỹ thuật Kiểm thử Hộp đen

## TL;DR

Kiểm thử hộp đen là kỹ thuật thiết kế test case dựa trên yêu cầu hệ thống mà không cần biết cấu trúc mã nguồn bên trong. Hai phương pháp cốt lõi và phổ biến nhất của kiểm thử hộp đen là Phân vùng tương đương (Equivalence Partitioning) và Phân tích giá trị biên (Boundary Value Analysis), giúp giảm tối đa số lượng test case cần thực thi nhưng vẫn đảm bảo độ phủ cao nhất.

---

## Core Concept

Bộ tiêu chuẩn ISTQB tập trung sâu vào hai kỹ thuật thiết kế ca kiểm thử hộp đen sau:

### 1. Phân vùng tương đương

- **Nguyên lý:** Chia miền dữ liệu đầu vào của một trường (hoặc hệ thống) thành các nhóm (phân vùng) mà hệ thống sẽ xử lý **tương tự như nhau**.
- **Phân loại:**
  - _Phân vùng hợp lệ (Valid Partition):_ Các giá trị đầu vào mà hệ thống chấp nhận và xử lý bình thường.
  - _Phân vùng không hợp lệ (Invalid Partition):_ Các giá trị đầu vào mà hệ thống phải từ chối hoặc báo lỗi.
- **Quy tắc chọn dữ liệu:** Chỉ cần chọn **duy nhất một giá trị bất kỳ** nằm trong mỗi phân vùng để kiểm thử. Nếu giá trị đó chạy đúng/sai, giả định rằng mọi giá trị khác trong cùng phân vùng cũng sẽ chạy đúng/sai như vậy.

### 2. Phân tích giá trị biên

- **Nguyên lý:** Tập trung kiểm thử tại các **đường ranh giới (biên)** của các phân vùng tương đương, vì thực tế lập trình viên rất hay viết nhầm toán tử so sánh (ví dụ: nhầm lẫn giữa `>` và `>=`, `<` và `<=`).
- **Quy tắc chọn dữ liệu (Biên 2 giá trị hoặc 3 giá trị):**
  - _Biên 2 giá trị:_ Chọn chính xác giá trị tại biên (Boundary Value) và giá trị ngay sát ngoài biên (nhỏ hơn biên dưới hoặc lớn hơn biên trên).
  - _Biên 3 giá trị (ISTQB CTFL v4.0):_ Chọn giá trị tại biên, giá trị ngay sát trong biên, và giá trị ngay sát ngoài biên.

```text
Phân vùng không hợp lệ          Phân vùng hợp lệ (Từ A đến B)          Phân vùng không hợp lệ
----------------------*|--------------------------------------------|*-----------------------
                     (A-1)   A                                      B  (B+1)
                     [Biên ngoài]                                     [Biên ngoài]
                             [Biên trong]                      [Biên trong]
```

---

## Practical Examples

### Bài toán thiết kế Test Case thực tế

Thiết kế test case cho ô nhập liệu **"Số lượng mua hàng"** của một trang thương mại điện tử. Hệ thống chỉ cho phép mua số lượng từ **1 đến 100 sản phẩm** (chấp nhận số nguyên).

#### Bước 1: Áp dụng Phân vùng tương đương

Ta chia dữ liệu đầu vào thành 3 phân vùng tương đương:

1. **Phân vùng 1 (Không hợp lệ):** Số lượng < 1 (Ví dụ chọn số: 0, hoặc số âm -5).
2. **Phân vùng 2 (Hợp lệ):** Số lượng từ 1 đến 100 (Ví dụ chọn số: 50).
3. **Phân vùng 3 (Không hợp lệ):** Số lượng > 100 (Ví dụ chọn số: 150).

_Kết quả EP:_ Cần **3 test cases** đại diện (0, 50, 150).

#### Bước 2: Áp dụng Phân tích giá trị biên

Các đường biên ranh giới ở đây là 1 và 100. Ta chọn các giá trị kiểm thử:

1. **Tại biên dưới (1):**
   - Giá trị tại biên: 1 (Hợp lệ).
   - Giá trị sát ngoài biên: 0 (Không hợp lệ).
2. **Tại biên trên (100):**
   - Giá trị tại biên: 100 (Hợp lệ).
   - Giá trị sát ngoài biên: 101 (Không hợp lệ).

_Kết quả BVA:_ Cần **4 test cases** biên (0, 1, 100, 101).

#### Kết luận bảng thiết kế Test Data tối ưu kết hợp EP & BVA

| STT | Số lượng nhập vào | Loại phân vùng | Kết quả mong đợi                   | Kỹ thuật áp dụng               |
| :-- | :---------------- | :------------- | :--------------------------------- | :----------------------------- |
| 1   | 0                 | Không hợp lệ   | Báo lỗi số lượng không hợp lệ      | BVA (Biên ngoài dưới)          |
| 2   | 1                 | Hợp lệ         | Chấp nhận thanh toán               | BVA (Biên dưới)                |
| 3   | 50                | Hợp lệ         | Chấp nhận thanh toán               | EP (Đại diện phân vùng hợp lệ) |
| 4   | 100               | Hợp lệ         | Chấp nhận thanh toán               | BVA (Biên trên)                |
| 5   | 101               | Không hợp lệ   | Báo lỗi vượt quá số lượng cho phép | BVA (Biên ngoài trên)          |

---

## Related Notes

- [[Error_Defect_Failure]]: Khái niệm lỗi nhầm lẫn và sự cố trong kiểm thử phần mềm.
- [[7_Principles_of_Testing]]: 7 nguyên lý kiểm thử định hình tư duy kiểm thử biên.
- [[30_Resources/Concepts/000_Concepts_MOC.md|Concepts MOC]]
