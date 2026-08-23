---
tags: [type/guide, topic/engineering, topic/testing, layer/quality]
date: 2026-06-07
aliases:
  [Stress Test Local, Kế hoạch Stress Test, k6 Benchmark, Phỏng vấn Stress Test]
description: "SOP thiết lập kịch bản và tư duy stress test an toàn trên máy local."
---

# Local Stress Testing & Benchmarking Guide

## TL;DR

Hướng dẫn thiết lập và tư duy thực hiện Stress Test (kiểm thử tải cực hạn) an toàn trong môi trường phát triển cục bộ (Localhost). Sử dụng các công cụ nhẹ nhàng như **k6**, **wrk**, **ab** thay vì JMeter để tìm ra giới hạn lỗi (Breaking Point) của ứng dụng mà không gây nghẽn phần cứng cục bộ.

## Safe Local Stress Testing Workflow

1. **Start Small**: Bắt đầu chạy test với số lượng người dùng ảo thấp (ví dụ: 50 Virtual Users - VUs).
2. **Ramp Up**: Tăng dần tải theo chu kỳ lên 100, 500, rồi 1000 VUs.
3. **Hardware Monitor**: Theo dõi sát sao mức tiêu thụ phần cứng (sử dụng `htop` trên Linux/macOS hoặc Task Manager trên Windows).
   - **Quy tắc dừng**: Nếu CPU chạm ngưỡng 100% hoặc RAM cạn kiệt, hãy lập tức **dừng test**. Đó chính là điểm nghẽn vật lý (Breaking Point) của môi trường hiện tại.

## Tool Selection

Do máy tính cá nhân thường giới hạn tài nguyên (ví dụ: 8GB-16GB RAM), cần tránh các công cụ ngốn RAM như JMeter (chạy trên máy ảo Java). Hãy ưu tiên:

- **k6 (Khuyên dùng)**: Viết bằng Go, viết kịch bản test bằng JavaScript. Rất nhẹ, hiển thị báo cáo CLI đẹp mắt và trực quan.
- **wrk**: Tool viết bằng C, tối ưu cực tốt, hiệu năng cao nhưng khó tùy biến các kịch bản logic phức tạp.
- **Apache Bench (ab)**: Cổ điển, có sẵn mặc định trên hầu hết hệ điều hành Linux, phù hợp cho kiểm thử endpoint đơn giản, nhanh gọn.

## Interview Q&A

**Câu hỏi:** _"Em stress test ở localhost thấy phản hồi nhanh, nhưng ra thực tế có độ trễ mạng (Network Latency) thì kết quả đó còn đúng không?"_

**Trả lời (Flow ghi điểm tư duy):**

> "Dạ, em hiểu rõ localhost bỏ qua **Network Latency** và **Real-world Bandwidth** nên kết quả thực tế ngoài Production sẽ chậm hơn.
> Tuy nhiên, mục tiêu của em khi Stress Test ở Local là để **Benchmark hiệu quả của Code và Query**:
>
> 1. Đảm bảo logic nghiệp vụ không bị rò rỉ bộ nhớ (Memory Leak) hay làm nghẽn CPU (CPU Spike) khi tải cao.
> 2. Xác nhận Database Indexing đã được tối ưu (Query chạy nhanh) trong môi trường tài nguyên hạn chế.
>
> Tư duy của em là: **Nếu chạy ở Local (môi trường lý tưởng nhất) mà ứng dụng còn chạy chậm hoặc sập, thì khi ra Production chắc chắn sẽ sập.** Em tối ưu phần Application trước, còn vấn đề Network Latency sẽ đo đạc chính xác hơn khi deploy lên môi trường Staging/Cloud."

---

## Related Notes

- Tổng hợp phương pháp làm việc: [[000_Methods_MOC]]
- Thiết kế API Newsfeed hiệu năng cao: [[Newsfeed_Architecture_Fanout]]
