---
tags: [type/moc, topic/tech]
date: 2026-04-28
aliases: [Tech Index, Tech Map]
description: "Bản đồ điều hướng trung tâm cho toàn bộ tri thức kỹ thuật. Phân loại theo các Domain cốt lõi và tự động truy vấn dữ liệu động bằng DataviewJS."
---

# Tech Knowledge Map of Content

## TL;DR

Bản đồ điều hướng trung tâm cho toàn bộ tri thức kỹ thuật. Phân loại theo các Domain cốt lõi và tự động truy vấn dữ liệu động bằng DataviewJS.

---

```dataviewjs
dv.header(2, "Architecture & Patterns");
dv.table(["Note Title", "Description"],
  dv.pages('"30_Resources/Tech/Architecture_and_Patterns"')
    .where(p => p.file.name !== "000_Tech_MOC")
    .sort(p => p.file.name, 'asc')
    .map(p => [
      p.file.link,
      p.description || (p.aliases ? (Array.isArray(p.aliases) ? p.aliases.join(", ") : p.aliases) : "")
    ])
);

dv.header(2, "Frameworks & Ecosystem");
dv.table(["Note Title", "Description"],
  dv.pages('"30_Resources/Tech/Frameworks_and_Ecosystem"')
    .where(p => p.file.name !== "000_Tech_MOC")
    .sort(p => p.file.name, 'asc')
    .map(p => [
      p.file.link,
      p.description || (p.aliases ? (Array.isArray(p.aliases) ? p.aliases.join(", ") : p.aliases) : "")
    ])
);

dv.header(2, "API & Data Design");
dv.table(["Note Title", "Description"],
  dv.pages('"30_Resources/Tech/API_and_Data_Design"')
    .where(p => p.file.name !== "000_Tech_MOC")
    .sort(p => p.file.name, 'asc')
    .map(p => [
      p.file.link,
      p.description || (p.aliases ? (Array.isArray(p.aliases) ? p.aliases.join(", ") : p.aliases) : "")
    ])
);

dv.header(2, "Infrastructure & Cloud");
dv.table(["Note Title", "Description"],
  dv.pages('"30_Resources/Tech/Infrastructure_and_Cloud"')
    .where(p => p.file.name !== "000_Tech_MOC")
    .sort(p => p.file.name, 'asc')
    .map(p => [
      p.file.link,
      p.description || (p.aliases ? (Array.isArray(p.aliases) ? p.aliases.join(", ") : p.aliases) : "")
    ])
);

dv.header(2, "Web Client & Security");
dv.table(["Note Title", "Description"],
  dv.pages('"30_Resources/Tech/Web_Client_and_Security"')
    .where(p => p.file.name !== "000_Tech_MOC")
    .sort(p => p.file.name, 'asc')
    .map(p => [
      p.file.link,
      p.description || (p.aliases ? (Array.isArray(p.aliases) ? p.aliases.join(", ") : p.aliases) : "")
    ])
);

dv.header(2, "Language & Core");
dv.table(["Note Title", "Description"],
  dv.pages('"30_Resources/Tech/Language_and_Core"')
    .where(p => p.file.name !== "000_Tech_MOC")
    .sort(p => p.file.name, 'asc')
    .map(p => [
      p.file.link,
      p.description || (p.aliases ? (Array.isArray(p.aliases) ? p.aliases.join(", ") : p.aliases) : "")
    ])
);
```
