---
tags: [type/concept, topic/finance, topic/economics]
date: 2026-01-30
aliases: [Bid-Ask Spread, Bẫy thanh khoản, Paper Profit]
description: "Rủi ro thanh khoản khi thị trường hoảng loạn."
---

# Liquidity Trap & Bid-Ask Spread

## TL;DR

Hiện tượng chênh lệch giữa giá Mua vào (Bid) và giá Bán ra (Ask) nới rộng cực đại khi thị trường hoảng loạn. Người nắm giữ tài sản bị lỗ ngay lập tức khi cố gắng thanh khoản (chuyển thành tiền mặt), dù giá thị trường chưa thực sự giảm sâu.

## Core Concept

- **Lãi trên giấy (Paper Profit) vs. Lỗ thực hiện (Realized PnL):** Giá trị tài sản không nằm ở con số hiển thị trên bảng điện (Ask), mà nằm ở mức giá nhà cái chấp nhận mua lại từ bạn (Bid).
- **Cơ chế tự vệ của Market Maker:** Khi có làn sóng bán tháo (Panic Selling), nhà cái/tiệm vàng đối mặt với rủi ro cạn kiệt tiền mặt. Họ phòng thủ bằng cách giữ nguyên giá Bán ra để neo tâm lý, nhưng đánh sập giá Mua vào. Trọng số chênh lệch (Spread) bị kéo giãn từ 1-2% lên 5-10%.
- **Sự bốc hơi thanh khoản:** Khủng hoảng không làm tài sản bốc hơi, khủng hoảng làm "người mua" bốc hơi. Spread cao chính là phí phạt rủi ro nếu bạn muốn có tiền mặt ngay lập tức.

## Practical Implementation

- **Tử huyệt Vàng vật chất (SJC):** Spread vàng miếng tại VN cực cao và chịu ảnh hưởng bởi chính sách (quota nhập khẩu). Khi có biến, các tiệm vàng dễ dàng nới Spread lên 5 triệu/lượng hoặc ngừng thu mua. Tài sản trú ẩn (Safe Haven) biến thành tài sản giam vốn.
- **Rule of Thumb (Chống kẹt hàng):** - Khi Spread > 5%, tuyệt đối cấm bán tháo (trừ khi cần tiền cứu mạng). Việc bán lúc này là gánh rủi ro thay cho nhà cái.
  - Phải chấp nhận hold dài hạn (Bag holding). Chờ đợi thị trường qua cơn hoảng loạn, Spread co hẹp lại về mức bình thường (1-2 triệu) rồi mới tiến hành cắt lỗ hoặc chốt lời.

---

**Related Notes:**

- Công cụ tính toán điểm rơi vốn: [[Dollar_Cost_Averaging]]
- Nghịch lý của tài sản an toàn: [[Safe_Haven_Asset]]
