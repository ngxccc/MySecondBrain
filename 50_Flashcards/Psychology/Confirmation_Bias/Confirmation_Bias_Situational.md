---
noteId: 1785165552701
---

Tình huống: Bạn vừa viết xong một tính năng mới và tự tin rằng nó chạy hoàn hảo. Phản xạ phòng chống Thiên kiến xác nhận (Confirmation Bias) khi kiểm thử là gì?

---

- **Nhận diện thiên kiến:** Lập trình viên có xu hướng tự nhiên chỉ viết test-case cho luồng chạy thành công (Happy Path) để "chứng minh" mình đúng.
- **Phản xạ phòng thủ (Disconfirming Evidence):**
  1. Chủ động đi tìm dữ liệu chứng minh code mình sai (Falsificationism): Nhập input âm, null, chuỗi cực dài, rủi ro race condition.
  2. Áp dụng kỹ thuật tách biệt kiểm thử (Testing Concerns): Nhờ đồng nghiệp hoặc QA viết test-case độc lập.
