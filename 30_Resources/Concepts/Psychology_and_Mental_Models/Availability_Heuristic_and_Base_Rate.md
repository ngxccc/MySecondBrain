---
tags:
  [type/concept, topic/psychology, topic/decision-making, topic/mental-models]
date: 2026-08-22
aliases:
  [
    Availability Heuristic and Base Rate,
    Availability Heuristic,
    Base Rate Fallacy,
    Thiên kiến sẵn có và tỷ lệ nền,
    Hiệu ứng sẵn có,
  ]
description: "Thiên kiến sẵn có và tỷ lệ nền - Lỗi đánh giá xác suất dựa trên độ dễ nhớ của sự kiện thay vì tần suất thống kê thực tế."
---

# Availability Heuristic and Base Rate

## TL;DR

- **Bản chất**: Xu hướng tâm lý đánh giá tần suất, xác suất hoặc tầm quan trọng của một hiện tượng dựa trên mức độ dễ dàng gợi nhớ lại các ví dụ về nó trong tâm trí (Availability Heuristic), dẫn đến việc phớt lờ hoàn toàn dữ liệu thống kê nền (Base-Rate Fallacy).
- **Mục đích**: Chặn đứng các đánh giá sai lầm về rủi ro xã hội, tài chính, kỹ thuật do bị thao túng bởi các sự kiện giật gân, nổi cộm trên truyền thông.
- **Điểm mấu chốt**: Mức độ xuất hiện dày đặc của một sự việc trên màn hình không đồng nghĩa với xác suất xảy ra của sự việc đó trong thế giới thực.

---

## Context: When to apply?

- **Good for:**
  - Định giá rủi ro đầu tư, kinh doanh, chuyển đổi nghề nghiệp.
  - Phân tích hiện trạng kinh tế - xã hội, bảo vệ bản thân trước các làn sóng tin tức giật gân (tai nạn máy bay, khủng hoảng y tế, tội phạm).
  - Ra quyết định kỹ thuật (tránh việc từ chối một công nghệ tốt chỉ vì vừa chứng kiến một lỗi hiếm gặp trên mạng).
- **Bad for:**
  - Các phản ứng khẩn cấp trong môi trường rủi ro cao (nơi trực giác dựa trên kinh nghiệm sẵn có là cần thiết để cứu mạng).
- **Phân tầng Maslow phù hợp**: **Tầng 4 (Esteem)** và **Tầng 5 (Cognitive & Self-Actualization)**.
- **Điều kiện tiên quyết**: Khả năng phân biệt rạch ròi giữa cảm xúc ấn tượng (Salience) và dữ liệu định lượng (Statistical Distribution).

---

## Core Concept & Mechanics

### 1. Cơ chế hoạt động của não bộ (Kahneman System 1)

Khi cần ước lượng xác suất của một sự kiện $E$, thay vì lục tìm dữ liệu thống kê toàn cầu (tốn năng lượng), Hệ thống 1 thực hiện một phép thế nhận thức (Cognitive Substitution):
$$\text{Đánh giá xác suất } P(E) \approx \text{Độ dễ dàng khi truy xuất ký ức về } E$$

```
[Sự kiện kịch tính / Giật gân] ──► Ký ức sâu đậm (High Salience) ──► Dễ nhớ lại ──► Não kết luận: "Xảy ra cực kỳ phổ biến"
                                                                                               │ (Lỗi phớt lờ Base-Rate)
[Hiện thực vận hành bình thường] ──► Không có tin tức ───────────► Khó nhớ lại ──► Não kết luận: "Không tồn tại / Vô hình"
```

### 2. Sự bóp méo của Base-Rate trong thời đại số

- **Base Rate (Tỷ lệ nền)**: Tần suất thực tế của một hiện tượng trong toàn bộ tập mẫu dân số (ví dụ: tỷ lệ tai nạn giao thông trên 1 triệu km di chuyển, tỷ lệ phá sản của doanh nghiệp theo ngành).
- **Cơ chế bóp méo**: Một video về sự cố bạo lực học đường hay ngộ độc thực phẩm nhận được 10 triệu view sẽ tạo ảo giác rằng "học đường đang hoàn toàn hỗn loạn" hoặc "mọi quán ăn đều có độc", trong khi tỷ lệ nền thực tế là $0.001\%$.

---

## Practical Implementation & De-biasing Framework

### 1. Bảng đối chiếu các tình huống thực tế

| Tình huống               | Bị bẫy bởi Availability Heuristic                                                                       | Phân tích dựa trên Base-Rate (Đúng chuẩn)                                                                                                             |
| :----------------------- | :------------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **An toàn xã hội**       | Xem 3 video cướp giật trên Facebook $\rightarrow$ Kết luận cả thành phố đang mất an ninh nghiêm trọng.  | Tra cứu chỉ số tội phạm/100,000 dân $\rightarrow$ Thấy thành phố thuộc nhóm có tỷ lệ tội phạm bạo lực thấp nhất khu vực.                              |
| **Đánh giá quốc gia**    | Đọc tin tức về thủ tục hành chính trì trệ $\rightarrow$ Kết luận đất nước hoàn toàn không có tương lai. | Đối chiếu báo cáo FDI, kim ngạch xuất nhập khẩu, tốc độ mở rộng đường cao tốc của World Bank $\rightarrow$ Thấy nền kinh tế vẫn đang mở rộng mạnh mẽ. |
| **Quyết định sự nghiệp** | Đọc bài báo về một người làm TikTok kiếm tiền tỷ $\rightarrow$ Bỏ học, bỏ việc đi làm nội dung.         | Nhìn vào Base-Rate: $99\%$ người làm nội dung kiếm không đủ tiền trả tiền trọ, chỉ top $0.1\%$ thành công nổi bật.                                    |

### 2. Quy trình 3 bước hiệu chuẩn dữ liệu (Base-Rate Calibration)

1. **Truy vấn Mẫu số (Search for the Denominator)**:
   - Khi nghe: _"Có $N$ trường hợp tiêu cực vừa xảy ra!"_
   - Ngay lập tức đặt câu hỏi: _"$N$ trường hợp này nằm trên tổng số bao nhiêu (mẫu số)? Tỷ lệ phần trăm là bao nhiêu?"_
2. **Kích hoạt quy tắc Bayes (Bayesian Thinking)**:
   - Luôn bắt đầu từ niềm tin tiên lượng dựa trên tỷ lệ nền khách quan (Prior Probability).
   - Chỉ cập nhật góc nhìn khi có bằng chứng thống kê quy mô lớn, không đổi góc nhìn chỉ vì một vài video ngắn xúc động (Anecdotal Evidence).
3. **Đa dạng hóa nguồn dữ liệu sơ cấp**:
   - Sử dụng các cổng dữ liệu mở và báo cáo thường niên (Tổng cục Thống kê, World Bank Open Data, UN Data) để làm nền tảng thế giới quan, thay vì các hội nhóm mạng xã hội.

---

## Related Notes

- Cơ chế tiến hóa ưu tiên tin tức giật gân: [[Negativity_Bias_and_Outrage_Economy]]
- Lỗi ảo tưởng về nguyên nhân kết quả: [[Swimmers_Body_Illusion]]
- Bẻ gãy tư duy hai thái cực: [[False_Dichotomy]]
- Khung phân cấp nhận thức toàn diện: [[Cognitive_Stack_Framework]]
- Bóc tách bản chất từ dữ liệu gốc: [[First_Principles_Thinking]]
