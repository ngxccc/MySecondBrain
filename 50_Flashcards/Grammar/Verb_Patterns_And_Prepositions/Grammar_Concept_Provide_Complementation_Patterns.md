---
noteId: 1786700700101
---

What are the 2 valid complementation patterns and common preposition traps for the transitive verb **provide** in technical English?

---

- **Core Invariant (Luật bất biến của Transitive Verb 'provide')**:
  - `provide` là một **Ngoại động từ (Transitive Verb)**, bắt buộc phải có một Danh từ làm Direct Object đứng ngay liền kề sau nó.
  - **FATAL ERROR TRAP**: Nhồi nhét cả 2 giới từ `to` và `with` vào cùng một câu:
    - ❌ `The service provides to developers with tokens.` (Sai nghiêm trọng: thừa giới từ `to`).
- **2 Valid Syntactic Patterns (2 Cấu trúc Cú pháp Đúng)**:
  1. **Pattern A (`provide + [THING] + to + [PERSON / ENTITY]` - Cung cấp CÁI GÌ cho AI)**:
     - Direct Object là **vật/dịch vụ** (`THING`), theo sau bởi giới từ `to` chỉ người/thực thể nhận.
     - Formula: `Subject + provide + [Thing (Noun)] + to + [Recipient]`
     - _`The auth service provides JWT tokens to developers.`_
     - _`The database provides data to the cache layer.`_
  2. **Pattern B (`provide + [PERSON / ENTITY] + with + [THING]` - Cung cấp cho AI với CÁI GÌ)**:
     - Direct Object là **người/thực thể nhận** (`RECIPIENT`), theo sau bởi giới từ `with` chỉ vật được cấp.
     - Formula: `Subject + provide + [Recipient (Noun)] + with + [Thing]`
     - _`The auth service provides developers with JWT tokens.`_
     - _`The cloud provider provides users with scalable storage.`_
- **Concrete Technical Comparisons**:
  - ❌ `Provides to clients API keys.` (Sai: `provide` không đi trực tiếp với `to + person`).
  - ✅ `Provides API keys to clients.` (Pattern A)
  - ✅ `Provides clients with API keys.` (Pattern B)
