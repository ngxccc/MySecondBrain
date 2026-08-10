---
tags: [type/moc, topic/productivity]
date: 2026-04-29
aliases: [Methods Index, Actionable Frameworks, The Toolbox]
description: "Bản đồ quy tụ các quy trình, thuật toán và framework thực chiến có thể lấy ra áp dụng ngay để giải quyết vấn đề (Actionable Toolbox). Tự động truy vấn dữ liệu động bằng DataviewJS."
---

# Methods & Frameworks MOC

## TL;DR

Bản đồ quy tụ các quy trình, thuật toán và framework thực chiến có thể lấy ra áp dụng ngay để giải quyết vấn đề (Actionable Toolbox). Tự động truy vấn dữ liệu động bằng DataviewJS.

---

```dataviewjs
dv.header(2, "1. Problem Solving & Thinking");
dv.table(["Note Title", "Description"],
  dv.pages('"30_Resources/Methods"')
    .where(p => p.file.name !== "000_Methods_MOC" && (p.file.name.includes("First_Principles") || p.file.name.includes("Socratic") || p.file.name.includes("Top_University") || p.file.name.includes("Mental_Model_Automation") || p.file.name.includes("Problem_Solving")))
    .sort(p => p.file.name, 'asc')
    .map(p => [
      p.file.link,
      p.description || (p.aliases ? (Array.isArray(p.aliases) ? p.aliases.join(", ") : p.aliases) : "")
    ])
);

dv.header(2, "2. Engineering & Execution");
dv.table(["Note Title", "Description"],
  dv.pages('"30_Resources/Methods"')
    .where(p => p.file.name !== "000_Methods_MOC" && (p.file.name.includes("Agile") || p.file.name.includes("WBS") || p.file.name.includes("Timeline") || p.file.name.includes("Benchmark") || p.file.name.includes("Vim") || p.file.name.includes("Pipeline") || p.file.name.includes("Roadmap") || p.file.name.includes("Model") || p.file.name.includes("Waterfall") || p.file.name.includes("Framework")))
    .sort(p => p.file.name, 'asc')
    .map(p => [
      p.file.link,
      p.description || (p.aliases ? (Array.isArray(p.aliases) ? p.aliases.join(", ") : p.aliases) : "")
    ])
);

dv.header(2, "3. Career & Communication");
dv.table(["Note Title", "Description"],
  dv.pages('"30_Resources/Methods"')
    .where(p => p.file.name !== "000_Methods_MOC" && (p.file.name.includes("STAR") || p.file.name.includes("IELTS") || p.file.name.includes("Presentation") || p.file.name.includes("TOEIC")))
    .sort(p => p.file.name, 'asc')
    .map(p => [
      p.file.link,
      p.description || (p.aliases ? (Array.isArray(p.aliases) ? p.aliases.join(", ") : p.aliases) : "")
    ])
);

dv.header(2, "4. Personal Finance");
dv.table(["Note Title", "Description"],
  dv.pages('"30_Resources/Methods"')
    .where(p => p.file.name !== "000_Methods_MOC" && (p.file.name.includes("Dollar") || p.file.name.includes("Saving") || p.file.name.includes("Income")))
    .sort(p => p.file.name, 'asc')
    .map(p => [
      p.file.link,
      p.description || (p.aliases ? (Array.isArray(p.aliases) ? p.aliases.join(", ") : p.aliases) : "")
    ])
);

dv.header(2, "5. All Methods Index");
dv.table(["Note Title", "Description"],
  dv.pages('"30_Resources/Methods"')
    .where(p => p.file.name !== "000_Methods_MOC")
    .sort(p => p.file.name, 'asc')
    .map(p => [
      p.file.link,
      p.description || (p.aliases ? (Array.isArray(p.aliases) ? p.aliases.join(", ") : p.aliases) : "")
    ])
);
```
