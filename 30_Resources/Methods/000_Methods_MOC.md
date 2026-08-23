---
tags: [type/moc, topic/productivity]
date: 2026-04-29
aliases: [Methods Index, Actionable Frameworks, The Toolbox]
description: "Bản đồ quy tụ các quy trình, thuật toán và framework thực chiến có thể lấy ra áp dụng ngay để giải quyết vấn đề (Actionable Toolbox). Tự động truy vấn dữ liệu động bằng DataviewJS."
---

# Methods & Frameworks MOC

## TL;DR

Bản đồ quy tụ các quy trình, thuật toán và framework thực chiến có thể lấy ra áp dụng ngay để giải quyết vấn đề (Actionable Toolbox). Tự động truy vấn dữ liệu động bằng DataviewJS.

> [!IMPORTANT]
> **Master Strategic Compass**: [[Master_Backend_Engineering_SSOT]] - Kim chỉ nam chiến lược và lộ trình 4 tầng nhận thức Backend.

---

```dataviewjs
dv.header(2, "1. Engineering & Execution");
dv.table(["Note Title", "Description"],
  dv.pages('"30_Resources/Methods/Engineering"')
    .where(p => p.file.name !== "000_Methods_MOC")
    .sort(p => p.file.name, 'asc')
    .map(p => [
      p.file.link,
      p.description || (p.aliases ? (Array.isArray(p.aliases) ? p.aliases.join(", ") : p.aliases) : "")
    ])
);

dv.header(2, "2. Learning & Cognition");
dv.table(["Note Title", "Description"],
  dv.pages('"30_Resources/Methods/Learning_and_Cognition"')
    .where(p => p.file.name !== "000_Methods_MOC")
    .sort(p => p.file.name, 'asc')
    .map(p => [
      p.file.link,
      p.description || (p.aliases ? (Array.isArray(p.aliases) ? p.aliases.join(", ") : p.aliases) : "")
    ])
);

dv.header(2, "3. Finance & Wealth");
dv.table(["Note Title", "Description"],
  dv.pages('"30_Resources/Methods/Finance"')
    .where(p => p.file.name !== "000_Methods_MOC")
    .sort(p => p.file.name, 'asc')
    .map(p => [
      p.file.link,
      p.description || (p.aliases ? (Array.isArray(p.aliases) ? p.aliases.join(", ") : p.aliases) : "")
    ])
);

dv.header(2, "4. All Methods Index");
dv.table(["Note Title", "Category", "Description"],
  dv.pages('"30_Resources/Methods"')
    .where(p => p.file.name !== "000_Methods_MOC")
    .sort(p => p.file.name, 'asc')
    .map(p => [
      p.file.link,
      p.file.folder.replace("30_Resources/Methods/", "").replace("30_Resources/Methods", "Root"),
      p.description || (p.aliases ? (Array.isArray(p.aliases) ? p.aliases.join(", ") : p.aliases) : "")
    ])
);
```
