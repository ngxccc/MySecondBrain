---
tags:
  - project/idea
  - english
  - web-app
  - inbox
date: 2026-08-06
aliases:
  - English Learning Web App Spec
  - Dự án Web App Học Tiếng Anh Chuyên Biệt
---

# Project Specification: Specialized English Learning Web App (Phase 2 Roadmap)

> **Status**: Idea / Draft (Phase 2 Upgrade Roadmap)  
> **Source**: Nâng cấp từ hệ thống Vault Obsidian + AI Agent sang Web App Fullstack độc lập.

---

## TL;DR

Tài liệu đặc tả ý tưởng và kiến trúc tính năng cho dự án **Web App Học Tiếng Anh Chuyên Biệt cho Lập Trình Viên & Kỹ Sư Công Nghệ**. Hệ thống giúp giải quyết dứt điểm các điểm đau: học vẹt từ vựng, lặp lại lỗi sai ngữ pháp, nhầm lẫn dạng từ (Word Form / Part of Speech) và thiếu môi trường thực hành thuyết trình kỹ thuật.

---

## 🎯 Target Audience & Core Objectives

- **Đối tượng**: Lập trình viên, kỹ sư phần mềm, Tech Lead (CEFR A2 $\rightarrow$ B1 $\rightarrow$ B2 $\rightarrow$ C1).
- **Mục tiêu cốt lõi**:
  1. Tự động lượng hóa và khắc phục các lỗi sai lặp đi lặp lại (Error Frequency Tracking).
  2. Làm chủ ma trận dạng từ (Word Family Matrix: Verb, Noun, Adj, Adv) và phản xạ vị trí câu.
  3. Cung cấp bài tập phản xạ tương tác, không bắt học thuộc vẹt hay mở Anki thủ công.
  4. Tạo môi trường thực hành thuyết trình kỹ thuật theo khung Feynman Whiteboard.

---

## 🧩 Core Modules & Feature Breakdown

### 1. Error Frequency Tracker & Targeted Review Dashboard

- **Silent Auto-Tracking**: AI ngầm phân tích ngữ pháp trong từng đoạn văn/câu hỏi người dùng nhập vào, tự động tính tần suất mắc lỗi (`frequency += 1`).
- **Error Analytics Dashboard**: Biểu đồ thống kê Top các lỗi hay sai nhất phân theo nhóm (Question Grammar, Preposition Complements, Word Form Confusion).
- **Targeted Active Review**: Chế độ sinh bài tập phản xạ chữa lỗi trực tiếp (Sửa lỗi sai, điền từ, biến đổi câu). Khi làm đúng 3 lần liên tiếp $\rightarrow$ đánh dấu `mastered`.

### 2. Word Family Matrix & Part of Speech Module (Bộ Họ Từ & Từ Loại)

- **Word Family Matrix**: Mỗi gốc từ lưu trọn bộ 4 dạng từ (Verb, Noun, Adjective, Adverb).
- **Morphemic Anchor Engine**: Hướng dẫn nhận biết loại từ qua kỹ thuật Neo Từ Mẫu (Anchor Words: `-tion` $\rightarrow$ `action`, `-able` $\rightarrow$ `able`, `-ize` $\rightarrow$ `visualize`).
- **Substitution Loop Trainer**: Bài tập luyện phản xạ thay thế từ mẫu (`cat`, `good`, `make`) để xác định đúng loại từ cần điền vào câu mà không cần nhớ công thức khô khan.

### 3. Grammar & Sentence Structure Master (Ngữ Pháp & Cấu Trúc Câu Thực Chiến)

- **Technical Question Patterns**: Luyện tập các mẫu câu hỏi giao tiếp kỹ thuật chuẩn bản ngữ (`What is the difference between A and B?`, `How do you pronounce X?`, `Is X translated as Y?`).
- **Verb Complements & Prepositions**: Làm chủ các cụm cố định (`be responsible for + V-ing`, `have an obligation to + V-bare`, `rather than + V-ing`).
- **First Principles Grammar**: Giải thích bản chất ngữ pháp dưới góc nhìn logic thay vì học vẹt quy tắc.

### 4. Built-in Spaced Repetition System (SRS Native - Không phụ thuộc Anki)

- Tích hợp thuật toán lặp lại ngắt quãng (SM-2 / FSRS) trực tiếp trên Web App.
- Tự động lên lịch nhắc ôn thẻ Ma trận Họ từ, Cụm từ Collocation và Mẫu câu giao tiếp hàng ngày mà không cần sinh file Markdown hay dùng Anki bên ngoài.

### 5. Feynman Whiteboard & Presentation Simulator (Mô Phỏng Thuyết Trình)

- **Interactive Canvas**: Tích hợp bảng vẽ Excalidraw / Canvas ngay trong app.
- **5-Step Feynman Blueprint**: Hướng dẫn kịch bản thuyết trình kỹ thuật từng bước (Setting stage $\rightarrow$ Baseline $\rightarrow$ Core mechanism $\rightarrow$ Tradeoffs $\rightarrow$ Wrap up).
- **Speech/Text Assessment**: Thu âm hoặc nhập kịch bản nói để AI đánh giá độ mượt, từ vựng kỹ thuật và câu nối chuyển slide (Slide Transition Bridge Sentences).

### 6. Tips & Learning Methodology Repository (Kho Phương Pháp Học)

- **Low-Friction Speaking Techniques**: Hướng dẫn kỹ thuật nói thầm (Subvocalization & Whispering) để luyện cơ miệng khi sống chung phòng.
- **Card-by-Card Visual Eye-Tracking**: Kỹ thuật điều phối ánh mắt khán giả từ thẻ bên trái (Problem) sang thẻ bên phải (Solution).
- **Linguistic False Friends & Pronunciation Mechanics**: Phân biệt từ dễ nhầm lẫn và cơ chế phát âm nối âm (Liaison), âm chặn (Held stops), đuôi `-s`/`-ed`.

### 7. CEFR Diagnostic Placement Assessment (Hệ Thống Kiểm Tra Trình Độ)

- Bài test chẩn đoán 4 phần (Grammar, Technical Vocab, Reading Comprehension, Feynman Presentation Output).
- Chấm điểm tự động thang 100, quy đổi trình độ CEFR (A2, B1, B2, C1) và theo dõi biểu đồ tăng trưởng trình độ theo thời gian.

---

## 🛠️ Proposed Tech Stack

- **Frontend**: Next.js 16 (App Router), Tailwind CSS, Shadcn UI, Excalidraw Canvas API.
- **Backend / API**: Next.js Server Actions / Bun Runtime API + Drizzle ORM.
- **Database**: PostgreSQL (Prisma/Drizzle) / SQLite (Better-SQLite3).
- **AI Integration**: Vercel AI SDK (Gemini 2.5 / Claude 3.5 API) cho tính năng tự động chấm điểm, tính tần suất lỗi sai và sinh bài tập phản xạ.

---

## 📅 Execution Strategy (Lộ Trình Triển Khai)

1. **Phase 1 (Hiện tại - Obsidian Vault & Managed Skill)**:
   - Tối ưu hóa file Profile tại `20_Areas/Learning/English_Learner_Profile.md`.
   - Lưu tần suất lỗi ngầm tại file `english-error-tracker.json` trong skill.
   - Lưu thẻ Ma trận Họ từ tại `50_Flashcards/Vocabulary/`.
2. **Phase 2 (Tương lai - Web App MVP)**:
   - Khởi tạo repo Next.js fullstack.
   - Migrate dữ liệu từ JSON & Flashcards Markdown sang Database.
   - Triển khai Dashboard tracking lỗi sai và hệ thống SRS Native.
