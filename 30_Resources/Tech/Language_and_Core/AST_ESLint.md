---
tags: [type/concept, topic/tech, layer/core-mechanics]
aliases: [Abstract Syntax Tree, Custom Rules]
description: "AST (Abstract Syntax Tree) là cấu trúc cây đại diện cho mã nguồn. Bằng cách viết các bộ chọn (AST Selectors) kết hợp với ESLint (`no-restricted-syntax`), ta có thể ép buộc các quy chuẩn kiến trúc (..."
---

# Phân tích AST và Custom ESLint Rules

## TL;DR

AST (Abstract Syntax Tree) là cấu trúc cây đại diện cho mã nguồn. Bằng cách viết các bộ chọn (AST Selectors) kết hợp với ESLint (`no-restricted-syntax`), ta có thể ép buộc các quy chuẩn kiến trúc (Architectural Boundaries) và tối ưu hóa performance một cách tự động ngay lúc code, thay vì dùng Regex vốn không hiểu ngữ cảnh và dễ lỗi.

## Core Concept

- **Tại sao nó tồn tại?** Máy tính không hiểu code theo dạng text mà biên dịch/phân tích nó thành cây AST (gồm các Node, Identifier, Literal).
- **Giải quyết bài toán gì?** Giải quyết việc review code thủ công quá tốn thời gian cho các lỗi cấu trúc, kiến trúc. Thay thế các lệnh check regex dễ bị false positive (bắt nhầm comment).
- **Nó có thay thế cái gì hay không?** Thay thế cho việc nhắc nhở bằng lời nói, doc quy tắc, hay code review bằng mắt thường.
- **Áp dụng dụng vào những dự án nào?** Hyundai B2B E-commerce.
- **Cơ chế hoạt động (How it works under the hood).**
  - **Tối ưu Next/Image**: Truy vấn `"JSXOpeningElement[name.name='Image']:not(:has(JSXAttribute[name.name='sizes']))"` để bắt lỗi các thẻ `<Image>` quên truyền thuộc tính `sizes` (làm giảm điểm LCP).
  - **Chống Deep Imports**: Phân tích `ImportDeclaration` để chặn các module import thọc sâu vào ruột module khác, đảm bảo ranh giới Server/Client.

## Practical Implementation

- **Trade-offs**: Phải học cú pháp AST Selector. Việc viết các rule phức tạp đòi hỏi hiểu sâu về cấu trúc ngữ pháp của JavaScript/TypeScript.
- **Mẫu trả lời phỏng vấn (Flex)**: "Trong dự án, em không chỉ code feature mà còn setup Code Quality. Thay vì review code thủ công rất dễ sót những lỗi như quên thuộc tính `sizes` của Next/Image làm giảm điểm LCP, hay lỗi anh em phá vỡ ranh giới module (Architecture Boundaries), em đã tận dụng rule `no-restricted-syntax` để viết các **AST Selectors** (ví dụ query tìm thẻ JSXImage thiếu JSXAttribute 'sizes'). Việc dùng AST giúp phân tích chính xác ngữ cảnh thay vì Regex. Điều này tự động hóa việc bắt lỗi ngay trên editor, tiết kiệm cực nhiều công sức lúc Review PR."

---

**Related Notes:**

- [[NextJS_Route_Groups_and_Nested_Layouts]]
