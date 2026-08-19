---
tags: [type/concept, topic/english, topic/learning]
date: 2026-04-29
aliases: [Gom nhóm ngữ âm, Sound Clustering]
description: "Hack não học từ vựng bằng cách gom nhóm âm tiết."
---

# Phonetic Chunking

## TL;DR

Kỹ thuật tối ưu hóa trí nhớ bằng cách gom các từ vựng có chung một gốc phát âm (Sound Root) thành từng nhóm (Cluster). Giúp não bộ học theo quy luật thay vì phải ghi nhớ vẹt từng từ đơn lẻ.

## Core Concept

- **Tư duy mạng lưới:** Cách học truyền thống (theo danh sách bảng chữ cái) tạo ra các điểm thông tin rời rạc, rất dễ rơi rụng. Chunking giải quyết bằng cách lấy một âm làm "Hạt nhân" (ví dụ: gốc `/er/`), và xếp các từ "Vệ tinh" xung quanh nó (Chair, Hair, Stair).
- **Sức mạnh của Nhận diện mẫu:** Khi nắm được quy luật của một gốc âm, bạn có thể tự tin phát âm đúng hàng chục từ mới có chứa gốc đó mà không cần tra từ điển.

## Practical Implementation

- **Tử huyệt (Từ mượn / Bạn giả):** Cạm bẫy lớn nhất là những từ có mặt chữ tuân theo quy luật, nhưng nguồn gốc ngôn ngữ lại khác. Ví dụ: `Message` đọc là `/ˈmes.ɪdʒ/`, nhưng `Massage` (gốc Pháp) lại đọc là `/məˈsɑːʒ/`.
- **Sự dịch chuyển trọng âm:** Cùng một mặt chữ, nhưng nếu trọng âm (Word stress) rơi vào vị trí khác nhau, nguyên âm gốc có thể bị biến đổi. Ví dụ: Hậu tố `-age` trong `Percentage` (/ɪdʒ/) khác hoàn toàn với `Teenager` (/eɪ.dʒɚ/).

---

**Related Notes:**

- Ngoại lệ mặt chữ giống nhưng đọc khác: [[Linguistic_False_Friends]]
- Phương pháp lập lịch ôn tập các cụm âm này: [[Spaced_Repetition_SM2]]
