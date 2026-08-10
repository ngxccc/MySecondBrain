# Master Control Dashboard

## Quick Navigation Hub

| Chuyên Môn & Kiến Trúc                          | Khái Niệm & Mô Hình                                         | SOP & Phương Pháp                                        | Tiêu Chuẩn Tag                             |
| :---------------------------------------------- | :---------------------------------------------------------- | :------------------------------------------------------- | :----------------------------------------- |
| [[30_Resources/Tech/000_Tech_MOC.md\|Tech MOC]] | [[30_Resources/Concepts/000_Concepts_MOC.md\|Concepts MOC]] | [[30_Resources/Methods/000_Methods_MOC.md\|Methods MOC]] | [[99_Meta/Tag_Taxonomy_SSOT.md\|Tag SSOT]] |

---

## Track 1: Lộ Trình Backend Engineering (4-Layer Cognitive Stack - Dynamic Auto-Query)

```dataviewjs
dv.header(3, "Layer 1: Core Mechanics & Memory (#layer/core-mechanics)");
dv.table(["Note Title", "Aliases / Key Concepts"],
  dv.pages("#layer/core-mechanics")
    .sort(p => p.file.name, 'asc')
    .map(p => [p.file.link, p.aliases ? (Array.isArray(p.aliases) ? p.aliases.join(", ") : p.aliases) : ""])
);

dv.header(3, "Layer 2: Architecture & Clean Code (#layer/architecture)");
dv.table(["Note Title", "Aliases / Key Concepts"],
  dv.pages("#layer/architecture")
    .sort(p => p.file.name, 'asc')
    .map(p => [p.file.link, p.aliases ? (Array.isArray(p.aliases) ? p.aliases.join(", ") : p.aliases) : ""])
);

dv.header(3, "Layer 3: System Infrastructure & Ops (#layer/infrastructure)");
dv.table(["Note Title", "Aliases / Key Concepts"],
  dv.pages("#layer/infrastructure")
    .sort(p => p.file.name, 'asc')
    .map(p => [p.file.link, p.aliases ? (Array.isArray(p.aliases) ? p.aliases.join(", ") : p.aliases) : ""])
);

dv.header(3, "Layer 4: Quality & Software Testing (#layer/quality)");
dv.table(["Note Title", "Aliases / Key Concepts"],
  dv.pages("#layer/quality")
    .sort(p => p.file.name, 'asc')
    .map(p => [p.file.link, p.aliases ? (Array.isArray(p.aliases) ? p.aliases.join(", ") : p.aliases) : ""])
);
```

---

## Track 2: Mental Models & Strategy (Dynamic Auto-Query)

```dataviewjs
dv.table(["Mental Model / Strategy Note", "Category Folder", "Aliases"],
  dv.pages('"30_Resources"')
    .where(p => p.file.folder.includes("Psychology_and_Mental_Models") || (p.tags && (p.tags.includes("type/mental-model") || p.tags.includes("type/strategy"))) || p.file.name.includes("T_Shaped") || p.file.name.includes("First_Principles") || p.file.name.includes("Systems_Thinking") || p.file.name.includes("Critical_Thinking"))
    .sort(p => p.file.name, 'asc')
    .map(p => [
      p.file.link,
      p.file.folder.replace("30_Resources/Concepts/", "").replace("30_Resources/", ""),
      p.aliases ? (Array.isArray(p.aliases) ? p.aliases.join(", ") : p.aliases) : ""
    ])
);
```

---

## Recently Created Notes (Auto-Scan)

```dataviewjs
const recentPages = dv.pages('"30_Resources"')
    .sort(p => p.file.ctime, 'desc')
    .slice(0, 7);

dv.table(
    ["Note Title", "Category", "Created Date"],
    recentPages.map(p => [
        p.file.link,
        p.file.folder.replace("30_Resources/", ""),
        dv.date(p.file.ctime).toFormat("yyyy-MM-dd HH:mm")
    ])
);
```

---

## Pending Tasks (Last 7 Days)

```dataviewjs
const targetFolder = '"20_Areas/Daily_Logs"';
const scanWindow = dv.date('today').minus({days: 7});

const pendingTasks = dv.pages(targetFolder)
    .where(page => page.file.cday >= scanWindow)
    .file.tasks
    .where(task => !task.completed && task.text.trim() !== "");

if (pendingTasks.length > 0) {
    dv.taskList(pendingTasks, false);
} else {
    dv.paragraph("Clear! Hệ thống không còn task tồn đọng.");
}
```
