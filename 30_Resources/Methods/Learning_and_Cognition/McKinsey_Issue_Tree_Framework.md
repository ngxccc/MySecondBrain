---
tags: [type/method, topic/productivity, topic/engineering]
date: 2026-08-12
aliases:
  [
    McKinsey Issue Tree Framework,
    Cây vấn đề McKinsey,
    Issue Tree Framework,
    MECE Hypothesis Driven Framework,
  ]
description: "Khung tư duy bóc tách cây vấn đề MECE kết hợp kiểm chứng giả thuyết giúp tìm nguyên nhân gốc rễ và xử lý triệt để bài toán kỹ thuật."
---

# McKinsey Issue Tree Framework

## TL;DR

**McKinsey Issue Tree Framework** là phương pháp phân rã một bài toán phức tạp thành cấu trúc cây phân cấp tuân theo nguyên tắc **MECE (Mutually Exclusive, Collectively Exhaustive - Không trùng lặp, Không bỏ sót)** kết hợp với mô hình **Hypothesis-Driven Approach (Hướng giả thuyết)**. Phương pháp này giúp cô lập nguyên nhân gốc rễ (Root Cause) và đưa ra bài kiểm tra xác nhận (Verification Test) cho từng nhánh vấn đề.

---

## Core Concept

### 1. Nguyên Tắc MECE (Mutually Exclusive, Collectively Exhaustive)

Khi phân rã một vấn đề lớn thành các sub-problems:

- **Mutually Exclusive (Không trùng lặp):** Các nhánh con ở cùng một cấp không được chồng chéo phạm vi lên nhau.
- **Collectively Exhaustive (Không bỏ sót):** Tổng các nhánh con ở cùng một cấp phải bao phủ toàn bộ không gian của vấnede cha.

### 2. Tiếp Cận Hướng Giả Thuyết (Hypothesis-Driven Approach)

Một cây vấn đề thuần túy chỉ liệt kê câu hỏi sẽ dẫn đến sa lầy. Phương pháp McKinsey yêu cầu mỗi nhánh sub-problem phải có 3 thành tố:

1. **Sub-problem:** Vấn đề con là gì?
2. **Hypothesis:** Dự đoán nguyên nhân gốc rễ dựa trên dữ liệu hiện có là gì?
3. **Verification Test:** Đo lường hoặc chạy thử nghiệm nào sẽ chứng minh giả thuyết đúng hay sai?

---

## Practical Implementation

### Quy Trình 4 Bước Dựng Cây Vấn Đề

```
[BƯỚC 1: XÁC ĐỊNH VẤN ĐỀ TRUNG TÂM]
   └── Phát biểu bài toán dạng một câu hỏi rõ ràng

[BƯỚC 2: PHÂN RÃ THEO NGUYÊN TẮC MECE]
   └── Chia thành 2 - 4 nhánh lớn không chồng chéo

[BƯỚC 3: ĐẶT GIẢ THUYẾT & THIẾT LẬP TEST]
   └── Với mỗi nhánh, đưa ra Hypothesis & Verification Test

[BƯỚC 4: THỰC THI & LOẠI TRỪ (PRUNING)]
   └── Chạy Test -> Giả thuyết Sai -> Cắt bỏ nhánh -> Tập trung nhánh Đúng
```

### Cấu Trúc Mỗi Node Trong Note

```markdown
- [ ] **Problem 1: [Phát biểu vấn đề theo MECE]**
  - **Hypothesis:** [Giả thuyết nguyên nhân gốc rễ]
  - **Verification Test:** [Bài kiểm tra hoặc lệnh truy vấn xác nhận]
  - **Result:** [Passed / Failed]
```

---

## Related Notes

- Phương pháp ghim mục tiêu ban đầu: [[GPS_Goal_Problem_Solution_Framework]]
- Mẫu ghi chú phân rã bài toán: [[Problem_Note_Template]]
- Quy trình 5 bước đánh giá vấn đề: [[Problem_Solving_Mental_Model_Pipeline]]
- Tư duy thiết kế kiến trúc tiến hóa: [[Problem_Driven_System_Design_Framework]]
