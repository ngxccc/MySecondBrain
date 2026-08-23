---
noteId: 1786698120101
---

What is the First-Principles mental model (Header Flag & Workload Division) explaining why English requires **Do-Support (`do / does / did`)** in questions?

---

- **Root Cause: The Linguistic OS Mismatch**:
  - **Tiếng Việt (Isolating OS)**: Giữ nguyên 100% trật tự từ, chỉ gắn hư từ (`không?`, `hả?`, `à?`) vào **CUỐI CÂU** để biến thành câu hỏi.
  - **Tiếng Anh (Word-Order & Inversion OS)**: Không có hư từ ở cuối câu. Người nghe cần **TÍN HIỆU ĐẢO NGỮ Ở ĐẦU CÂU** để kích hoạt cờ `is_question = true` ngay từ mili-giây đầu tiên.
- **Mental Model 1: Header Flag (Gói tin giao thức)**:
  - `Do / Does / Did` đóng vai trò như **Header trong gói tin mạng**, phát tín hiệu câu hỏi trước khi truyền tải Payload (Chủ ngữ + Hành động).
- **Mental Model 2: Workload Division (Phân chia công việc giữa 2 động từ)**:
  - **Trợ lý (`Do / Does / Did`)**: Nhảy lên đầu làm tín hiệu đảo ngữ + gánh Thì + gánh Ngôi thứ 3 số ít (`does`).
  - **Động từ chính (`mean, run, understand`)**: Được giải phóng hoàn toàn khỏi ngữ pháp, chỉ mang ngữ nghĩa thuần túy và giữ nguyên dạng **Bare Infinitive (V-bare)**.
- **The 2-Second Decision Tree**:
  ```text
                                 CÂU HỎI TRONG TIẾNG ANH
                                            │
               ┌────────────────────────────┴────────────────────────────┐
               ▼                                                         ▼
     Hỏi về TÍNH CHẤT / TRẠNG THÁI / DANH TÍNH                 Hỏi về HÀNH ĐỘNG / Ý NGHĨA
     (Tính từ, Danh từ, Giới từ)                               (Động từ thường)
     ──► DÙNG "TO BE" (Is / Are / Was / Were)                  ──► DÙNG "DO / DOES / DID"
     vd: Is it expensive? / Are you ready?                     vd: Does it work? / What does it mean?
  ```
- **Concrete Technical Examples**:
  - _`Does this API endpoint return JSON data?`_ (Chủ ngữ số ít `endpoint` $\rightarrow$ dùng `does`, động từ `return` giữ nguyên).
  - _`Is this API endpoint idempotent?`_ (Hỏi về tính chất `idempotent` $\rightarrow$ dùng `is`).
