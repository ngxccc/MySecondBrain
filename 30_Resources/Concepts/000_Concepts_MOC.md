---
tags: [type/moc, topic/concepts]
date: 2026-06-22
aliases: [Concepts Index, Concepts Map]
description: "Bản đồ điều hướng trung tâm cho toàn bộ tri thức khái niệm lý thuyết và mô hình tư duy (Psychology, Finance, Economics, Linguistics, Software Testing). Tự động truy vấn dữ liệu động bằng DataviewJS."
---

# Concepts Knowledge Map of Content

## TL;DR

Bản đồ điều hướng trung tâm cho toàn bộ tri thức khái niệm lý thuyết và mô hình tư duy (Psychology, Finance, Economics, Linguistics, Software Testing). Tự động truy vấn dữ liệu động bằng DataviewJS.

---

```dataviewjs
dv.header(2, "Finance & Economics");
dv.table(["Note Title", "Description"],
  dv.pages('"30_Resources/Concepts/Finance_and_Economics"')
    .where(p => p.file.name !== "000_Concepts_MOC")
    .sort(p => p.file.name, 'asc')
    .map(p => [
      p.file.link,
      p.description || (p.aliases ? (Array.isArray(p.aliases) ? p.aliases.join(", ") : p.aliases) : "")
    ])
);

dv.header(2, "Psychology & Mental Models");
dv.table(["Note Title", "Description"],
  dv.pages('"30_Resources/Concepts/Psychology_and_Mental_Models"')
    .where(p => p.file.name !== "000_Concepts_MOC")
    .sort(p => p.file.name, 'asc')
    .map(p => [
      p.file.link,
      p.description || (p.aliases ? (Array.isArray(p.aliases) ? p.aliases.join(", ") : p.aliases) : "")
    ])
);

dv.header(2, "Knowledge Management");
dv.table(["Note Title", "Description"],
  dv.pages('"30_Resources/Concepts/Knowledge_Management"')
    .where(p => p.file.name !== "000_Concepts_MOC")
    .sort(p => p.file.name, 'asc')
    .map(p => [
      p.file.link,
      p.description || (p.aliases ? (Array.isArray(p.aliases) ? p.aliases.join(", ") : p.aliases) : "")
    ])
);

dv.header(2, "Learning & Linguistics");
dv.table(["Note Title", "Description"],
  dv.pages('"30_Resources/Concepts/Learning_and_Linguistics"')
    .where(p => p.file.name !== "000_Concepts_MOC")
    .sort(p => p.file.name, 'asc')
    .map(p => [
      p.file.link,
      p.description || (p.aliases ? (Array.isArray(p.aliases) ? p.aliases.join(", ") : p.aliases) : "")
    ])
);

dv.header(2, "Software Testing");
dv.table(["Note Title", "Description"],
  dv.pages('"30_Resources/Concepts/Software_Testing"')
    .where(p => p.file.name !== "000_Concepts_MOC")
    .sort(p => p.file.name, 'asc')
    .map(p => [
      p.file.link,
      p.description || (p.aliases ? (Array.isArray(p.aliases) ? p.aliases.join(", ") : p.aliases) : "")
    ])
);
```
