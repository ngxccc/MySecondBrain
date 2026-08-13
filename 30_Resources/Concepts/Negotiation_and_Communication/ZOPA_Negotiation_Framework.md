---
tags: [type/concept, topic/psychology, topic/negotiation, topic/decision-making]
date: 2026-07-27
aliases: [ZOPA, Zone of Possible Agreement, Vùng thỏa thuận khả thi]
description: "Vùng thỏa thuận khả thi - Khoảng không gian giao thoa ranh giới chấp nhận được giữa hai bên."
---

# ZOPA Negotiation Framework

## TL;DR

ZOPA (Zone of Possible Agreement - Vùng thỏa thuận khả thi) là khoảng không gian giao thoa giữa các giới hạn chấp nhận được của hai bên đàm phán. Nếu ranh giới tối thiểu của bên bán nằm dưới ranh giới tối đa của bên mua, một ZOPA dương tồn tại và thỏa thuận có thể đạt được. Ngược lại, nếu hai giới hạn không đè lên nhau, ZOPA bằng không và cuộc đàm phán sẽ bế tắc trừ khi các điều kiện được thay đổi.

## Application Context & Maslow Alignment

- **Phân tầng Maslow phù hợp**: **Tầng 3 (Cognitive Stack / Hệ thống 2)** - Định vị logic, phân tích biên giới hạn và tính toán thặng dư giá trị.
- **Điều kiện tiên quyết**: Đòi hỏi hai bên phải tạm thời bước ra khỏi cảm xúc phòng thủ (Hệ thống 1) để đánh giá các con số và điều kiện một cách lý trí. Phải xác định trước BATNA ([[BATNA_Negotiation_Model]]) để tính ra Reservation Price của chính mình.
- **Đối tượng áp dụng**: Người đàm phán thương mại, Lập trình viên/Project Lead đàm phán scope & timeline dự án, Người giao dịch bất động sản/tài sản.

## Core Concept

ZOPA đại diện cho vùng đất chung nơi cả hai bên đều cảm thấy kết quả thương lượng tốt hơn hoặc bằng điểm dừng của họ.

- **Reservation Price / Point (Giá giới hạn):** Mức giá trần (tối đa bên mua có thể trả) hoặc mức giá sàn (tối thiểu bên bán có thể chấp nhận).
- **Phân loại ZOPA:**
  - **Positive ZOPA (ZOPA dương):** Điểm sàn của bên bán thấp hơn điểm trần của bên mua (Ví dụ: Bên bán chấp nhận từ $100, Bên mua sẵn sàng trả đến $150 $\rightarrow$ ZOPA = $100 - $150).
  - **Negative ZOPA (ZOPA âm / Không có ZOPA):** Điểm sàn của bên bán cao hơn điểm trần của bên mua (Ví dụ: Bên bán đòi tối thiểu $200, Bên mua chỉ có tối đa $150 $\rightarrow$ Không thể đạt thỏa thuận tiền mặt thuần túy).
- **Chiến lược mở rộng ZOPA:** Khi rơi vào ZOPA âm hoặc ZOPA hẹp, thay vì chỉ mặc cả một biến số duy nhất (như giá tiền), hãy đưa thêm các giá trị phi tiền tệ vào bàn đàm phán (như tiến độ thanh toán, thời gian bảo hành, cam kết hợp tác dài hạn) để tạo ra ZOPA mới.

## Concrete Examples

- **Mua bán phần mềm doanh nghiệp:**
  - Bên mua có ngân sách tối đa $50.000/năm.
  - Bên bán có chi phí tối thiểu chấp nhận được là $40.000/năm.
  - $\rightarrow$ ZOPA nằm trong khoảng $40.000 đến $50.000. Cuộc thương lượng sẽ xoay quanh việc phân chia thặng dư $10.000 này.
- **Thương lượng tuyển dụng dự án IT:**
  - Ứng viên yêu cầu mức lương tối thiểu 30 triệu/tháng. Công ty chỉ có quỹ lương 25 triệu/tháng (ZOPA âm về tiền mặt).
  - **Giải pháp mở rộng ZOPA:** Công ty đề xuất lương 25 triệu + thưởng theo KPI dự án + cho phép làm việc từ xa 2 ngày/tuần. Ứng viên chấp nhận gói giá trị này vì nó vượt ngưỡng thỏa mãn tổng thể.

## Practical Implementation

- **Trade-offs (Điểm mù cần tránh):**
  - _Mơ hồ về Reservation Price:_ Đàm phán mà không biết rõ giá sàn/trần của chính mình dễ dẫn đến việc chấp nhận thỏa thuận thua lỗ hoặc vô tình bác bỏ một thỏa thuận tốt.
  - _Định kiến cố định tổng (Fixed-pie bias):_ Giả định sai lầm rằng ZOPA chỉ là một chiếc bánh cố định, quên mất khả năng sáng tạo điều khoản để nới rộng ZOPA.

---

## Related Notes

- Mô hình điểm tựa đàm phán: [[BATNA_Negotiation_Model]]
- Đàm phán dựa trên lợi ích cốt lõi: [[Principled_Negotiation_Getting_To_Yes]]
- Kỹ thuật thấu cảm mở khóa đàm phán: [[Tactical_Empathy_Chris_Voss]]
