---
tags: [type/pattern, lang/english, skill/pronunciation, level/B1]
aliases: []
date: <% tp.file.creation_date("YYYY-MM-DD") %>
description: "Tóm tắt ngắn gọn quy tắc ngữ âm/mẫu câu (để DataviewJS hiển thị trên MOC)."
---

# [Tên Pattern - VD: Homographs Stress Shift]

## TL;DR [BẮT BUỘC]

_(Quy tắc cốt lõi 1 dòng - The "Golden Rule")_

> **Rule:** Noun/Adj nhấn âm 1. Verb nhấn âm 2.
> **Why:** Thay đổi trọng âm để đổi từ loại (part of speech).

---

## The Logic (Backend) [BẮT BUỘC]

_(Tại sao lại có luật này? Giải thích cơ chế deep-down)_

- **Root Cause:** (Giải thích về ngữ âm học, lịch sử...)
- **Mechanism:** (VD: Khi trọng âm chuyển sang âm tiết 2, âm tiết 1 bị yếu đi và biến thành âm Schwa /ə/).

---

## Dataset (The Inventory) [BẮT BUỘC]

_(Danh sách các từ tuân theo luật này. Đã thêm cột Audio để check phát âm)_

| Word       | Type | IPA        | Meaning      | Context / Unit Test Case        |                        Audio                         |
| :--------- | :--- | :--------- | :----------- | :------------------------------ | :--------------------------------------------------: |
| **Record** | Noun | /ˈrek.ɚd/  | Hồ sơ/Kỷ lục | _I broke the world **record**._ | [🔊](https://youglish.com/pronounce/record/english?) |
|            | Verb | /rɪˈkɔːrd/ | Ghi âm       | _Please **record** my voice._   | [🔊](https://youglish.com/pronounce/record/english?) |

---

## Memory Hook / Mnemonic [TÙY CHỌN]

_(Mẹo nhớ nhanh - Hack não)_

- **Tip:** Noun (Danh từ) thường nặng nề -> Nhấn đầu. Verb (Động từ) cần năng lượng để hành động -> Nhấn sau.
- **Image:** (Nếu có hình ảnh minh họa quy tắc)

---

## Edge Cases / Exceptions (Bugs) [TÙY CHỌN]

_(Những thằng ngoại lệ phá game)_

- **Exception 1:** **Comment** (Luôn nhấn âm 1 dù là Noun hay Verb).
- **Exception 2:** **Report** (Luôn nhấn âm 2).

---

## Active Drill (Gym) [TÙY CHỌN]

_(Bài tập tự luyện - Che phần đáp án đi để test)_

1. Can you **[object]** to this plan? (Verb - Phản đối)
2. Look at this weird **[object]**. (Noun - Vật thể)

---

## Connections [BẮT BUỘC]

### Internal

- [[Phonetic_Schwa_Sound]]
- [[English_Intonation_Rules]]

### External

- [YouGlish Search for this pattern](https://youglish.com/)
