---
noteId: 1787479800001
---

How do you correctly use singular countable nouns and articles in software engineering commands and prompts (such as **commit**, **folder**, **endpoint**, **branch**)?

---

- **Formula / Pattern**:
  ```text
               ⎧ Write a commit message for the [Folder/Service]  (Countable noun: a + commit message)
               ⎪
  Action   -> ⎨ Create a branch / Checkout a branch              (Countable noun: a + branch)
  Commands     ⎪
               ⎪ Trigger a build / Send a request                 (Countable noun: a + build / request)
               ⎩ Modify the [Component] folder                    (Definite article: the + folder)
  ```
- **Core Explanation**:
  - Trong tiếng Anh kỹ thuật, các từ như `commit` (khi dùng làm danh từ chỉ lượt commit), `branch`, `folder`, `endpoint`, `request`, `token` là **Danh từ đếm được số ít (Singular Countable Nouns)**.
  - **Quy tắc bất biến**: Không bao giờ để một danh từ đếm được số ít đứng "trơ trọi" (bare noun) mà không có mạo từ (`a/an`, `the`) hoặc tính từ sở hữu (`my`, `this`).
  - Khi `commit` đứng một mình sau động từ (như `Write commit`), nó gây nhầm lẫn ngữ pháp giữa động từ (`to commit`) và cụm danh từ (`a commit message` / `a commit`).
- **Usage & Anchor Cues**:
  - ❌ `Write commit for folder 10_Projects`
  - ✅ `Write a commit message for the 10_Projects folder`
  - ❌ `Create branch for new feature`
  - ✅ `Create a branch for the new feature`
- **Concrete Examples**:
  - _`Please write a concise commit message following Conventional Commits.`_ (Vui lòng viết một commit message ngắn gọn theo chuẩn Conventional Commits.)
  - _`The CI pipeline runs automated checks for the target folder.`_ (Pipeline CI chạy các bài kiểm tra tự động cho thư mục đích.)
