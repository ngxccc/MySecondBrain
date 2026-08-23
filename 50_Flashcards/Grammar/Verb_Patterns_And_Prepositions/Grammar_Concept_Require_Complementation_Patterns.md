---
noteId: 1786700600101
---

What are the valid complementation patterns and common traps for the transitive verb **require** in technical English?

---

- **Core Invariant (Luật bất biến của Transitive Verb 'require')**:
  - `require` là một **Ngoại động từ (Transitive Verb)** mang nghĩa bắt buộc, đòi hỏi.
  - **FATAL ERROR TRAP**: Trong tiếng Việt ta hay nói _"Middleware này yêu cầu xác thực..."_ $\rightarrow$ Người học dịch thô thành `This middleware requires to authenticate...` $\rightarrow$ **SAI NGHIÊM TRỌNG** (vì `require` không bao giờ đi trực tiếp với `to-V` mà không có tân ngữ đối tượng).
- **3 Valid Syntactic Patterns (3 Cấu trúc Cú pháp Đúng)**:
  1. **`Subject + require + [Direct Object (Noun Phrase)]`**:
     - _`This middleware requires authentication for every incoming request.`_
     - _`This endpoint requires a valid JWT token.`_
  2. **`Subject + require + [Target Object] + to-V`**:
     - _`This middleware requires users to authenticate before accessing data.`_
     - _`The policy requires developers to write unit tests.`_
  3. **Passive Form (`Subject + is/are required + to-V`)**:
     - _`This middleware is required to authenticate every incoming request.`_ (Middleware có nghĩa vụ phải xác thực).
     - _`All microservices are required to implement health checks.`_
  4. **Need/Require Passive Gerund (`Subject + require + V-ing`)**:
     - _`This payload requires authenticating / sanitizing.`_ (Dữ liệu này cần được xác thực/làm sạch).
- **Concrete Comparison**:
  - ❌ `The API requires to pass an API key.` (Lỗi lửng tân ngữ)
  - ✅ `The API requires an API key.` (Pattern 1)
  - ✅ `The API requires clients to pass an API key.` (Pattern 2)
  - ✅ `Clients are required to pass an API key.` (Pattern 3)
