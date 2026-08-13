---
tags: [type/method, topic/productivity, topic/engineering]
date: 2026-08-12
aliases:
  [
    GPS Goal Problem Solution Framework,
    Khung GPS ghim mục tiêu ban đầu,
    GPS Framework,
    Goal Problem Solution Anchor,
  ]
description: "Khung tư duy GPS ghim mục tiêu ban đầu giúp quản lý bối cảnh khi phân rã bài toán kỹ thuật phức tạp mà không bị trôi bối cảnh."
---

# GPS Goal Problem Solution Framework

## TL;DR

**GPS (Goal - Problem - Solution) Framework** là phương pháp quản lý bối cảnh và duy trì định hướng bài toán bằng cách ghim chặt **North Star Goal (Mục tiêu tối thượng)** và các **Core Constraints (Ràng buộc cứng)** ở vị trí trên cùng của tài liệu. Phương pháp này triệt tiêu rủi ro Context Loss và Goal Drift khi người làm việc đào sâu vào các chi tiết kỹ thuật ở mức độ thấp.

---

## Core Concept

### 1. Hiện Tượng Trôi Bối Cảnh (Context Loss & Goal Drift)

Khi thảo luận hoặc lập trình một bài toán phức tạp, người làm việc thường phân rã bài toán thành nhiều cấp độ con. Khi đi sâu vào cấp độ 3 hoặc cấp độ 4, bộ não chịu tải nhận thức cao và vô tình quên mất lý do tại sao nhánh con đó lại được tạo ra, dẫn đến hai cạm bẫy:

- **Analysis Paralysis:** Sa lầy vào việc giải quyết một vấn đề phụ không thực sự đóng góp cho mục tiêu chính.
- **Over-Engineering Trap:** Xây dựng giải pháp quá phức tạp cho một nhánh nhỏ mà vi phạm các ràng buộc ban đầu.

### 2. Nguyên Lý Neo Mục Tiêu (Goal Anchoring)

$$\text{North Star Goal} \rightarrow \text{Core Constraints} \rightarrow \text{Blockers} \rightarrow \text{Actionable Sub-problems}$$

Mọi suy nghĩ, tranh luận và dòng code đều phải có tuyến liên kết trực tiếp quay ngược trở lại North Star Goal. Nếu một nhánh vấn đề không thể chứng minh được đóng góp của nó cho North Star Goal, nhánh đó lập tức bị loại bỏ hoặc đưa ra ngoài phạm vi (Out of Scope).

---

## Practical Implementation

### 3-Level Context Architecture

Một tài liệu quản lý bài toán theo khung GPS chuẩn bao gồm 3 tầng thông tin:

```
[TẦNG 1: NEOMỤC TIÊU & RÀNG BUỘC - PINNED HEADER]
   ├── North Star Goal: Mục tiêu tối thượng không bao giờ được sửa
   └── Core Constraints: Các giới hạn cứng (Thời gian, Chi phí, System Boundary)

[TẦNG 2: PHÂN RÃ VẤN ĐỀ - ISSUE TREE]
   ├── Problem 1: Vấn đề lớn cản trở North Star Goal
   │      ├── Sub-problem 1.1: Vấn đề nhỏ hơn kèm Giả thuyết (Hypothesis)
   │      └── Sub-problem 1.2: Vấn đề nhỏ hơn kèm bài kiểm tra (Verification Test)
   └── Problem 2: Vấn đề lớn thứ hai

[TẦNG 3: NHẬT KÝ QUYẾT ĐỊNH & THỰC THI - VERIFICATION LOG]
   ├── Milestones: Kết quả sau khi hoàn thành từng sub-problem
   └── Decisions Made: Các quy tắc đã được chốt để không thảo luận lại
```

### Quy Tắc Rút Rơi (Pop Back Rule)

Khi làm việc ở Tầng 2 hoặc Tầng 3, trước khi chuyển sang một sub-problem mới, người thực hiện bắt buộc phải tự vấn:

1. _Sub-problem vừa làm xong đã đóng góp được gì cho North Star Goal ở Tầng 1?_
2. _Có ràng buộc cứng (Core Constraint) nào bị vi phạm hay không?_

---

## Related Notes

- Mẫu ghi chú áp dụng khung GPS: [[Problem_Note_Template]]
- Khung bóc tách cây vấn đề: [[McKinsey_Issue_Tree_Framework]]
- Quy trình 5 bước đánh giá vấn đề: [[Problem_Solving_Mental_Model_Pipeline]]
- Tư duy kiến trúc theo nhu cầu thực tế: [[Problem_Driven_System_Design_Framework]]
