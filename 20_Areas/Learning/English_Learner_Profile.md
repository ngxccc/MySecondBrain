---
docType: learning-profile
tags: [topic/english, topic/learning, topic/knowledge-management]
date: 2026-08-06
aliases:
  - English Learner Profile
  - Hồ sơ học tiếng Anh
---

# English Learner Profile & Strategy SSOT

## TL;DR

Hồ sơ cá nhân và **Single Source of Truth (SSOT)** theo dõi lộ trình phát triển năng lực tiếng Anh (CEFR A2 $\rightarrow$ B1 $\rightarrow$ B2). Phân cấp rõ ràng: Ưu tiên số 1 là **Technical English Communication** phục vụ phỏng vấn Backend Developer trước ngày 06/12/2026; các lộ trình luyện thi chứng chỉ như TOEIC/IELTS chỉ đóng vai trò bài tập bổ trợ phương pháp nghe/viết.

---

## 1. Master Strategy & Hierarchy

```
[ PRIMARY TRACK ]     ──> B1 ──> B2 Technical English Communication (Feynman Presentation & Mock Interview)
                                        │
                                        ▼
[ SUPPORTING MODULE ] ──> [[TOEIC_Self_Study_Roadmap_0_To_900]] (Dictation Part 1 & Part 2)
                                        │
                                        ▼
[ REFERENCE METHODS ] ──> [[IELTS_Simon_Writing_Method]], [[Card_By_Card_Presentation_Delivery_Technique]]
```

---

## 2. Current CEFR Profile

- **Current Level**: **A2 (High-Beginner) $\rightarrow$ B1 (Lower-Intermediate)**
- **Target Level**: **B2 (Upper-Intermediate / Technical Professional)**
- **Last Evaluated**: 2026-08-06
- **Vocabulary Vault**: Auto-synced via Yanki plugin in `50_Flashcards/` _(Flashcard từng từ lẻ lưu độc lập tại thẻ Anki, không ghi log vụn vặt vào profile này)_.

## Core Competencies & Strengths

- **Technical & Engineering Domain Vocab**: Hiểu và sử dụng thành thạo từ vựng chuyên ngành lập trình (`codebase`, `concurrency`, `Escape Analysis`, `Garbage Collection`, `Value Semantics`, `Slice Header Fields`, `Memory Allocation`, `Overhead`).
- **Phonetics & Pronunciation Mechanics**: Nắm vững cơ chế phát âm phụ âm vô thanh/hữu thanh (Voiceless vs Voiced sounds), phụ âm huýt (Sibilants), nối âm (Phonetic liaison), âm chặn (Held stops), và quy tắc phát âm đuôi `-s`, `-es`, `-ed`.
- **Feynman Whiteboard Presentation**: Sử dụng thành thạo kịch bản thuyết trình 5 bước trên bảng vẽ Excalidraw kết hợp cử chỉ tay (`Open Box Zone`).
- **Low-Friction Speaking Adaptability**: Áp dụng kỹ thuật nói thầm (Subvocalization & Whispering) để luyện cơ miệng tự nhiên trong không gian sống chia sẻ phòng.

---

## 80/20 Pareto High-Leverage Syntax Framework (Checklist)

### Phase 1: Core Syntax Invariants & State Machine (Mastered)

- [x] **1. Do-Support & The 2-Switch Binary Parser**:
  - **Switch 1 (Predicate Type)**: Adjective / State / Noun $\rightarrow$ `BE` (`Is / Are`) vs. Action / Lexical Verb $\rightarrow$ `DO` (`Do / Does`).
  - **Switch 2 (Entity Count)**: 1 Entity (He, She, It, singular noun) $\rightarrow$ `Is / Does` vs. Multiple Entities / You / They / We $\rightarrow$ `Are / Do`.
- [x] **2. Head Noun Extraction & The 1-2-3 Numeric Mirror**:
  - Trong cụm danh từ ghép kỹ thuật (Compound Noun Phrases), từ nằm **TẬN CÙNG BÊN PHẢI** luôn là **Head Noun (Danh từ chính)** định đoạt số ít/nhiều (`system architecture [diagram]` $\rightarrow$ singular $\rightarrow$ `Does / Is`; `background worker [threads]` $\rightarrow$ plural $\rightarrow$ `Do / Are`).
  - Thứ tự từ trong tiếng Anh là hình ảnh phản chiếu ngược 180 độ so với tiếng Việt (`[1] Chính sách [2] dọn dẹp [3] cache` $\Longleftrightarrow$ `[3] cache [2] eviction [1] policy`).
- [x] **3. Strict Non-Pro-Drop & Dummy Subject Operators**:
  - **Existential `There + be`**: Diễn đạt sự tồn tại/hiện diện của thực thể (_"Có một lỗi..."_ $\rightarrow$ `There is an error`, không dùng `Have an error`).
  - **Ambient / Prop `Dummy It`**: Đưa ra nhận định về hành động hoặc trạng thái (_"Rất khó để..."_ $\rightarrow$ `It is very hard to optimize this query`).
- [x] **4. The Copula Bridge Invariant**:
  - Tính từ không thể tự thân làm vị ngữ (No Zero-Copula); bắt buộc phải có động từ `To Be` làm cầu nối năng lượng (`The database is scalable`, không viết `The database scalable`).

### Phase 2: High-Leverage Kinetic Engines (In Progress / Next)

- [ ] **5. Verb Transitivity & Core Clause Patterns**:
  - **Pattern A (Intransitive)**: `S + V_intransitive` (Hành động tự thân, cấm chia bị động: `occur`, `happen`, `crash`, `exist`, `fail`).
  - **Pattern B (Transitive)**: `S + V_transitive + O` (Bắt buộc có tân ngữ trực tiếp: `require`, `provide`, `contain`, `affect`).
- [ ] **6. The 3 Golden Tenses & Time-Axis Alignment (>90% Corpus Usage)**:
  - **Present Simple**: Kiến trúc, nguyên lý mặc định, định nghĩa (`Redis stores data in memory`).
  - **Past Simple**: Sự kiện cụ thể đã chấm dứt trong quá khứ (`The query timed out at 10:00 AM`).
  - **Present Perfect**: Hành động vừa hoàn tất tạo ra trạng thái/hệ quả hiện tại (`The deployment has completed`).
- [ ] **7. Participle Packaging & Clause Reduction**:
  - **Active V-ing**: `A worker that processes the queue` $\rightarrow$ `A worker processing the queue`.
  - **Passive V-ed**: `Payloads that are compressed by gzip` $\rightarrow$ `Payloads compressed by gzip`.
- [ ] **8. Modal Vectors & Engineering Conditionals**:
  - **Real Fact**: `If we add an index, latency drops.`
  - **Speculative Architecture Scenario**: `If we scaled to 10M users, the cache would bottleneck.`
- [ ] **9. Technical Causation & Result Operators**:
  - `[Cause] causes / leads to / results in [Effect]`.
  - `[Effect] is due to / caused by [Cause]`.
- [ ] **10. Prepositional & Verb Complementation Patterns**:
  - `be responsible for + V-ing`, `have an obligation to + V-bare`, `depend on`, `rely on`, `rather than + V-ing`.

---

## 80/20 High-Leverage Strategic Architecture (Top 5 Pillars)

| Trụ cột (Pillar)                                | Cơ chế Cốt lõi (Core Engine)                                      | Tác động Đòn bẩy (High Leverage Impact)                                                                                                |
| :---------------------------------------------- | :---------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| **1. The 3 Golden Tenses**                      | Hiện tại đơn + Quá khứ đơn + Hiện tại hoàn thành                  | Chiếm **>90%** tần suất sử dụng thực tế (Corpus LGSWE / COCA); giải phóng $80\%$ gánh nặng của 9 thì hiếm gặp.                         |
| **2. Verb Transitivity & 2 Clause Patterns**    | `S + V_intransitive` vs `S + V_transitive + O`                    | Tránh $100\%$ lỗi chia bị động sai cho nội động từ (`occur`, `crash`) và lỗi bỏ lửng tân ngữ cho ngoại động từ (`require`, `provide`). |
| **3. Participle Packaging & Reduction**         | Rút gọn chủ động `V-ing` và bị động `V-ed`                        | Nén thông tin câu kỹ thuật dài lê thê thành câu cô đọng, tự nhiên chuẩn văn phong Senior Engineer.                                     |
| **4. Modal Vectors & Engineering Conditionals** | Real Fact (`If S+V, S+V`) vs Speculative (`If S+V-ed, S+would+V`) | Làm chủ toàn bộ logic tranh luận kiến trúc, đánh giá trade-off và giả định kịch bản trong RFC / System Design.                         |
| **5. Causation & Result Operators**             | `causes`, `leads to`, `results in`, `is due to`                   | Cung cấp bộ khung toán tử nhân-quả chuẩn xác cho phân tích nguyên nhân gốc rễ (RCA) và viết tài liệu kỹ thuật.                         |

---

## Competency Boundary & Application Matrix

| Mục tiêu / Ứng dụng                                  | Khung 20% Cú pháp giải quyết được gì? (What it solves)                                                                                                              | Ranh giới: Cần bổ sung gì? (What is missing?)                                                                                                         | Đánh giá độ khó sau khi nắm chắc 20%                                                                             |
| :--------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------- |
| **1. Đọc Technical Docs (RFC, Specs, Architecture)** | **Giải quyết 80% cấu trúc câu phức tạp.** Bóc tách chính xác Head Noun trong cụm 4-5 từ và giải mã mệnh đề phân từ rút gọn mà không bị lạc trôi.                    | **Cần thêm Từ vựng Chuyên ngành (20%).** Bổ sung các thuật ngữ domain (`idempotency`, `backpressure`, `concurrency`).                                 | **DỄ HƠN RẤT NHIỀU (80% Effort Drop).** Vì cấu trúc văn bản kỹ thuật cực kỳ lặp lại và chuẩn mực.                |
| **2. Thuyết trình Kỹ thuật (Feynman Whiteboard)**    | **Giải quyết 100% tính logic của lập luận.** Nối câu nhân-quả mượt mà, giả định kịch bản (`If we scale... it would...`) mà không bị nghẽn trật tự từ.               | **Cần thêm Kỹ thuật Cơ miệng & Kịch bản.** Luyện nối âm (Phonetic Liaison), ngắt cụm (Phonetic Chunking) và kịch bản 5 bước Feynman.                  | **TỰ TIN VÀ MẠCH LẠC HƠN.** Loại bỏ hoàn toàn sự ấp úng vì phải vừa nghĩ nội dung vừa lo chia thì.               |
| **3. Luyện thi TOEIC (Part 5, 6, 7)**                | **Giải quyết 90% phần Ngữ pháp Part 5 & 6.** Toàn bộ các câu hỏi về từ loại, chia thì, mệnh đề quan hệ rút gọn, câu điều kiện, chủ ngữ giả đều nằm trong khung này. | **Cần thêm Từ vựng Môi trường Doanh nghiệp/Văn phòng.** Nạp từ vựng công sở, hợp đồng, du lịch, nhân sự (`invoice`, `itinerary`, `personnel`).        | **RẤT DỄ (800+ trong tầm tay).** Vì TOEIC là bài thi kiểm tra tính chính xác của các quy tắc cố định.            |
| **4. Luyện thi IELTS (Writing & Speaking)**          | **Giải quyết 100% tiêu chí Grammatical Range & Accuracy (GRA).** Viết câu phức, câu điều kiện, mệnh đề phân từ chuẩn xác, không bị lỗi ngữ pháp sơ đẳng.            | **Cần thêm Collocations học thuật C1/C2 (Lexical Resource) & Tư duy phân tích Task Response.** Nạp từ vựng học thuật trừu tượng và lập luận đa chiều. | **BÀN ĐẠP VỮNG CHẮC (Bứt phá từ 5.5 lên 7.0+).** Cú pháp đã thông suốt, chỉ cần tập trung nạp từ vựng học thuật. |

---

## Major CEFR Assessment & Milestone History

- **2026-08-06**: Relocated learner profile to `20_Areas/Learning/English_Learner_Profile.md` per PARA framework. Operational error frequency tracking moved to skill data JSON (`english-tutor/data/english-error-tracker.json`).
- **2026-08-06**: Restructured profile to Macro-Tracking architecture. Separated individual word flashcards (`50_Flashcards/`) from profile milestones. Operational assessment framework relocated to skill references (`english-tutor/references/assessment-framework.md`).
- **2026-08-06**: Completed vault flashcard standardization (Strategy A: Pure English Immersion with English Front, IPA Pronunciation, Meaning, and Example).
- **2026-08-05**: Mastered Feynman Whiteboard Presentation blueprint, Subvocalization speaking technique, and Go Memory Mechanics vocabulary.
- **2026-07-28**: Profile initialized. Baseline evaluation: A2 $\rightarrow$ B1.
