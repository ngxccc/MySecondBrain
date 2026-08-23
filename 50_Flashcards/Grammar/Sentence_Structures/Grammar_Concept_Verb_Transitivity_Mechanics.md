---
noteId: 1786700500101
---

What are the first-principles mechanics of **Verb Transitivity (Intransitive vs Transitive vs Ergative Verbs)** in English clauses?

---

- **First-Principles Invariant (Cơ chế Truyền tải Năng lượng của Động từ)**:
  - **1. Intransitive Verbs ($V_i$ - Nội động từ / Năng lượng tự thân)**:
    - Hành động chỉ diễn ra trong nội tại của Chủ ngữ, KHÔNG truyền năng lượng ra bên ngoài $\rightarrow$ **KHÔNG CÓ Direct Object**.
    - **Invariant Bất biến**: **TUYỆT ĐỐI KHÔNG BAO GIỜ CÓ THỂ CHIA BỊ ĐỘNG** (vì không có Object để đẩy lên làm Subject).
    - Core Technical Verbs: `occur`, `happen`, `crash`, `exist`, `fail`, `expire`, `persist`, `terminate`.
    - ❌ `The bug was occurred.` $\rightarrow$ ✅ `The bug occurred.`
    - ❌ `The database was crashed.` $\rightarrow$ ✅ `The database crashed.`
  - **2. Transitive Verbs ($V_t$ - Ngoại động từ / Năng lượng hướng đích)**:
    - Bắt buộc phải có một Direct Object đón nhận hành động ($S + V_t + O$).
    - **Invariant Bất biến**: **KHÔNG ĐƯỢC BỎ LỬNG TÂN NGỮ**. Có thể chuyển sang dạng Bị động ($O + \text{be} + V_3$).
    - Core Technical Verbs: `require`, `provide`, `contain`, `affect`, `trigger`, `fetch`, `execute`.
    - ❌ `This function requires to pass auth.` $\rightarrow$ ✅ `This function requires a valid JWT token.`
  - **3. Ergative / Labile Verbs (Động từ Lưỡng tính Công nghệ)**:
    - Động từ có thể vừa đóng vai trò Nội động từ (hệ thống tự chuyển trạng thái) vừa làm Ngoại động từ (tác nhân kích hoạt chuyển trạng thái).
    - Core Technical Verbs: `start`, `stop`, `restart`, `compile`, `increase`, `decrease`, `improve`, `scale`.
    - _Intransitive (Tự thân): `The worker thread restarted.`_
    - _Transitive (Tác nhân): `The supervisor daemon restarted the worker thread.`_
    - _Passive (Bị động): `The worker thread was restarted by the daemon.`_
- **Concrete Error Checks**:
  - _Sai: "An exception was happened during parsing."_ $\rightarrow$ _Đúng: "An exception occurred / happened during parsing."_
  - _Sai: "This API provides to users."_ $\rightarrow$ _Đúng: "This API provides real-time analytics to users."_
