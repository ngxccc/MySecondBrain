---
tags: [type/concept, topic/testing, layer/quality]
date: 2026-07-07
aliases: [7 nguyên lý kiểm thử, Seven Principles of Testing]
description: "7 nguyên lý kiểm thử phần mềm nền tảng định hình hoạt động kiểm định."
---

# 7 Nguyên lý Kiểm thử Phần mềm

## TL;DR

7 Nguyên lý Kiểm thử Phần mềm là các quy tắc triết lý cơ bản được đúc kết từ thực tế ngành phát triển phần mềm. Chúng giúp người kiểm thử định hình tư duy đúng đắn, tránh những ảo tưởng phi thực tế (như kiểm thử hết mọi trường hợp) và tối ưu hóa nguồn lực kiểm thử để đạt hiệu quả cao nhất.

---

## Core Concept

Bộ tiêu chuẩn ISTQB định nghĩa 7 nguyên lý kiểm thử cốt lõi như sau:

### 1. Kiểm thử chỉ ra sự hiện diện của lỗi

- **Nội dung:** Kiểm thử giúp phát hiện lỗi đang tồn tại trong phần mềm, chứ không thể chứng minh phần mềm hoàn toàn sạch lỗi (100% bug-free).
- **Ý nghĩa:** Dù test kỹ đến đâu và không phát hiện lỗi nào nữa, ta cũng chỉ có thể nói: _"Chưa tìm thấy lỗi"_, chứ không được khẳng định _"Phần mềm không còn lỗi"_.

### 2. Kiểm thử kiệt quệ là bất khả thi

- **Nội dung:** Việc kiểm thử tất cả các tổ hợp dữ liệu đầu vào, điều kiện và kịch bản là không thể thực hiện được (trừ các trường hợp vô cùng đơn giản).
- **Ý nghĩa:** Thay vì cố gắng test tất cả, người kiểm thử phải dùng các kỹ thuật phân tích rủi ro, phân vùng tương đương và biên để tập trung vào các trường hợp có khả năng lỗi cao nhất.

### 3. Kiểm thử càng sớm càng tốt

- **Nội dung:** Các hoạt động kiểm thử (bao gồm review tài liệu, thiết kế) nên được bắt đầu ngay từ giai đoạn đầu của vòng đời phát triển phần mềm (SDLC).
- **Ý nghĩa:** Phát hiện và sửa lỗi ở giai đoạn thu thập yêu cầu (Requirements) hay thiết kế có chi phí rẻ hơn hàng chục đến hàng trăm lần so với khi phần mềm đã được lập trình xong hoặc đã bàn giao cho khách hàng.

```mermaid
graph LR
    A[Yêu cầu đặc tả] -->|Chi phí sửa lỗi rẻ| B[Thiết kế]
    B --> C[Lập trình]
    C -->|Chi phí sửa lỗi cực đắt| D[Vận hành]
```

### 4. Sự tập trung của lỗi

- **Nội dung:** Phần lớn các lỗi thường tập trung ở một số ít module cốt lõi hoặc phức tạp của hệ thống (tuân theo nguyên lý Pareto 80/20 - 80% lỗi nằm ở 20% lượng code).
- **Ý nghĩa:** Người kiểm thử cần xác định các "vùng nhạy cảm" này để phân bổ nhiều thời gian và nguồn lực kiểm thử hơn.

### 5. Nghịch lý thuốc trừ sâu

- **Nội dung:** Nếu một tập hợp các bài kiểm thử (test cases) được lặp đi lặp lại nhiều lần, đến một lúc nào đó chúng sẽ không phát hiện thêm lỗi mới.
- **Ý nghĩa:** Tương tự như sâu nhờn thuốc trừ sâu, người kiểm thử phải liên tục rà soát, cải tiến và viết thêm các test case mới để phát hiện các lỗi tiềm ẩn phát sinh khi hệ thống thay đổi.

### 6. Kiểm thử phụ thuộc vào bối cảnh

- **Nội dung:** Không có một phương pháp kiểm thử nào áp dụng chung cho tất cả các phần mềm.
- **Ý nghĩa:** Cách thức và mức độ kiểm thử của một phần mềm y tế ảnh hưởng trực tiếp đến tính mạng con người (cần độ an toàn cực cao) sẽ khác hoàn toàn với một trang web tin tức thông thường hoặc một game di động giải trí.

### 7. Sự sai lầm về việc không có lỗi

- **Nội dung:** Việc sửa hết tất cả các lỗi và xây dựng một hệ thống "sạch lỗi" sẽ vô nghĩa nếu hệ thống đó không đáp ứng được nhu cầu thực tế của người dùng hoặc không thể sử dụng được.
- **Ý nghĩa:** Chất lượng phần mềm không chỉ đo bằng số lượng bug, mà còn bằng mức độ đáp ứng nhu cầu khách hàng (Search Intent/User Intent) và tính hữu dụng thực tế.

---

## Practical Examples

- **Ví dụ về Nguyên lý 2 (Kiểm thử kiệt quệ):** Một form nhập liệu chỉ có 3 trường số nguyên: Tuổi (1 đến 100), Điểm số (0 đến 10), và Số năm kinh nghiệm (0 đến 50). Số lượng tổ hợp đầu vào có thể có là 100 _11_ 51 = 56.100 trường hợp. Ta không thể test tay hết được mà phải áp dụng kỹ thuật chọn giá trị đại diện và kiểm thử biên.
- **Ví dụ về Nguyên lý 6 (Phụ thuộc bối cảnh):** Khi phát triển ứng dụng ngân hàng di động (Mobile Banking), kiểm thử viên sẽ tập trung cao độ vào bảo mật (Security), mã hóa dữ liệu và tính chính xác của giao dịch. Nhưng khi kiểm thử game Flappy Bird, kiểm thử viên sẽ tập trung vào độ mượt (Performance), trải nghiệm chơi game (Playability) và đồ họa (GUI).

---

## Related Notes

- [[Error_Defect_Failure]]: Khái niệm lỗi nhầm lẫn và sự cố trong kiểm thử phần mềm.
- [[30_Resources/Concepts/000_Concepts_MOC.md|Concepts MOC]]
