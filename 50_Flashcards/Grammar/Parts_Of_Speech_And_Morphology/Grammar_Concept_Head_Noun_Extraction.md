---
noteId: 1786698560101
---

What are the core mechanics, rule, and 3 tests for **Head Noun Extraction in Compound Noun Phrases**?

---

- **Core Difference (Linguistic Operating System)**:
  - **Tiếng Việt (Left-Headed)**: Danh từ chính đứng ĐẦU (bên trái), bổ nghĩa đứng sau (ví dụ: _Chính sách [chính] thu hồi cache [phụ]_).
  - **Tiếng Anh (Right-Headed)**: Danh từ chính (Head Noun) đứng CUỐI CÙNG (tận cùng bên phải), các từ đứng trước chỉ là nhãn dán bổ nghĩa phụ (Noun Adjuncts / Modifiers).
- **The Rightmost Noun Rule (Quy tắc Tận cùng bên phải)**:
  ```text
  [Modifier 1] + [Modifier 2] + [Modifier 3] + ... + [HEAD NOUN (BOSS)]
  (Không có giới từ of/for)                         (Quyết định số ít/nhiều & Thì)
  ```
- **3 Practical Tests to Identify the Head Noun**:
  1. **Test 1: "What is it fundamentally?"**: Tự hỏi thực thể này về bản chất thực tế là cái gì? (Trong `cache eviction policy`, nó không phải là cái `cache`, không phải hành động `eviction`, mà là một `policy` $\rightarrow$ `policy` là Head Noun).
  2. **Test 2: Rightmost Position**: Trong chuỗi danh từ ghép kỹ thuật, từ nằm tận cùng bên phải luôn là Head Noun.
  3. **Test 3: Preposition Inversion (of/for)**: Đảo cụm từ với `of/for` $\rightarrow$ từ đứng TRƯỚC `of/for` là Head Noun (`the cache eviction policy` $\Longleftrightarrow$ `the POLICY for cache eviction`).
- **Concrete Technical Examples**:
  - `system architecture diagram` $\rightarrow$ Head Noun: `diagram` (1 bản vẽ $\rightarrow$ số ít $\rightarrow$ `Does / Is`).
  - `background worker threads` $\rightarrow$ Head Noun: `threads` (nhiều luồng $\rightarrow$ số nhiều $\rightarrow$ `Do / Are`).
  - `user profile settings` $\rightarrow$ Head Noun: `settings` (các cài đặt $\rightarrow$ số nhiều $\rightarrow$ `Do / Are`).
- **Usage Drill**:
  - _`Does the system architecture diagram show microservices?`_
  - _`Do these background worker threads consume much CPU?`_
