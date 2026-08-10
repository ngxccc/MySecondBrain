---
tags: [type/concept, topic/architecture, pattern/clean-code, layer/architecture]
date: 2026-04-28
aliases: [SDP, Stable Dependencies Principle, Circular Dependency]
description: "Quy tắc mũi tên một chiều chống Circular Dependency."
---

# Shared Module Dependency Rule

## TL;DR

Quy tắc kiến trúc quy định luồng phụ thuộc (import) một chiều bất di bất dịch: Các Module Nghiệp vụ (Features) được phép gọi đến Module Dùng chung (Shared), nhưng Shared tuyệt đối KHÔNG ĐƯỢC biết sự tồn tại của Features.

## Core Concept

- **Vấn đề (Circular Dependency & Spaghetti):** Nếu Shared import ngược lại Feature, ứng dụng sẽ dính vòng lặp phụ thuộc (File A chờ File B, File B chờ File A) dẫn đến crash runtime. Đồng thời, Shared sẽ bị nhiễm "Domain Logic" và mất đi khả năng tái sử dụng (Reusable) cho các dự án khác.
- **Stable Dependencies Principle (SDP):** Nguyên lý mũi tên một chiều. Trong đồ thị hệ thống, mũi tên phụ thuộc phải luôn trỏ về phía Component "khó thay đổi/ổn định nhất". `Shared` (UI Kit, Utils) cực kỳ ít thay đổi, trong khi `Features` (Nghiệp vụ) thay đổi mỗi ngày.

## Practical Implementation

- **Trade-offs (Chống rò rỉ Logic):** Cạm bẫy lớn nhất của Frontend Dev là import React Router (`useNavigate`, `useRouter`) hoặc Redux Store trực tiếp vào một Shared Component (như `<Card />` hay `<Button />`). Điều này biến Shared thành Feature ngay lập tức.
- **Cách khắc phục (Dependency Injection / Props Drilling):** Shared component phải hoàn toàn "ngu ngốc" (Dumb Component). Mọi logic nghiệp vụ, điều hướng (Navigation), hay data fetching phải được thực hiện ở Feature, sau đó truyền (inject) xuống Shared thông qua arguments (với function) hoặc props (với UI component).
- **Code Snippet (React Example):**

```tsx
// ❌ BAD: Shared Component vi phạm luật (Import từ Feature)
import { navigateToProfile } from "@/features/users";

export const SharedButton = ({ userId }) => {
  return <button onClick={() => navigateToProfile(userId)}>Click</button>;
};

// ✅ GOOD: Shared Component tuân thủ luật (Dùng DI qua Props)
interface ButtonProps {
  onClick: () => void; // Chờ Feature tiêm (inject) logic vào
}
export const SharedButton = ({ onClick }: ButtonProps) => {
  return <button onClick={onClick}>Click</button>;
};
```

---

**Related Notes:**

- Nơi áp dụng quy tắc này nhiều nhất: [[Modular_Monolith_Architecture]]
- Kỹ thuật dùng để lách luật một chiều: [[Dependency_Injection]]
