---
tags: [type/concept, topic/web, topic/seo]
date: 2026-07-07
aliases: [SEO, Search Engine Optimization, Tối ưu hóa công cụ tìm kiếm]
description: "Tối ưu hóa công cụ tìm kiếm (SEO) là tập hợp các kỹ thuật tối ưu hóa website để tăng thứ hạng tự nhiên trên trang kết quả tìm kiếm (SERPs). Mục tiêu là thu hút lượng truy cập tự nhiên (organic traf..."
---

# Search Engine Optimization

## TL;DR

Tối ưu hóa công cụ tìm kiếm (SEO) là tập hợp các kỹ thuật tối ưu hóa website để tăng thứ hạng tự nhiên trên trang kết quả tìm kiếm (SERPs). Mục tiêu là thu hút lượng truy cập tự nhiên (organic traffic) chất lượng cao và giảm thiểu chi phí quảng cáo trả phí (PPC).

---

## Core Concept

SEO hoạt động dựa trên cơ chế thu thập thông tin (crawling), lập chỉ mục (indexing) và xếp hạng (ranking) của các thuật toán tìm kiếm (như Google RankBrain, PageRank). Để tối ưu hóa hiệu quả và phù hợp với các bản cập nhật mới nhất, SEO được chia thành ba trụ cột chính:

### 1. Technical SEO

Tập trung vào phần hạ tầng và cấu trúc kỹ thuật của website để các bot tìm kiếm dễ dàng crawl và index trang.

- **Crawlability & Indexability:** Quản lý bằng tệp `robots.txt` và `sitemap.xml` để đảm bảo bot tìm kiếm không bị chặn hoặc lãng phí ngân sách thu thập thông tin (crawl budget).
- **Core Web Vitals:** Tối ưu hóa các chỉ số đo lường trải nghiệm thực tế của người dùng:
  - **INP (Interaction to Next Paint):** Thay thế hoàn toàn cho FID cũ, đo lường toàn bộ độ trễ tương tác trong suốt vòng đời của trang (mục tiêu: **under 200 ms**).
  - **LCP (Largest Contentful Paint):** Tốc độ tải nội dung chính (mục tiêu: **under 2.0 - 2.5s**).
  - **CLS (Cumulative Layout Shift):** Tính ổn định thị giác của giao diện (mục tiêu: **under 0.1**).
- **Field Data vs Lab Data:** Google ưu tiên đánh giá dựa trên **Field Data** (dữ liệu thực tế từ báo cáo CrUX của người dùng ở phân vị thứ 75) thay vì chỉ chấm điểm trong môi trường giả lập (Lab Data như Lighthouse).
- **HTTPS & SSL / Mobile-First Indexing:** Bảo mật kết nối và tối ưu hóa hiển thị/hiệu năng trên thiết bị di động (ưu tiên hàng đầu của Google).
- **Structured Data (Schema Markup):** Cung cấp siêu dữ liệu dưới dạng JSON-LD để hiển thị rich snippets trên kết quả tìm kiếm.

### 2. On-Page SEO

Tối ưu hóa trực tiếp nội dung và các phần tử hiển thị trên website.

- **E-E-A-T Framework:** Nội dung phải thể hiện được Tính trải nghiệm (Experience), Chuyên môn (Expertise), Uy tín (Authoritativeness) và Độ tin cậy (Trustworthiness) để tối ưu cho cả kết quả tìm kiếm truyền thống và các công cụ tìm kiếm AI (AI Overviews / SGE).
- **Content Quality & Search Intent:** Nội dung hữu ích, độc bản và đáp ứng chính xác ý định tìm kiếm của người dùng thay vì chỉ nhồi nhét từ khóa.
- **HTML Elements:** Tối ưu hóa thẻ `<title>`, `<meta name="description">`, và phân cấp tiêu đề `<h1>` đến `<h6>`.
- **Internal Linking & Friendly URL:** Xây dựng mạng lưới liên kết nội bộ khoa học để phân phối PageRank và tối ưu cấu trúc URL ngắn gọn, rõ nghĩa.

### 3. Off-Page SEO

Xây dựng uy tín và độ tin cậy của website thông qua các tín hiệu từ bên ngoài.

- **Backlink Profile:** Thu hút các liên kết tự nhiên, chất lượng cao từ các trang web có độ uy tín lớn (domain authority) trỏ về.
- **Social Signals & Brand Mentions:** Tần suất thương hiệu được đề cập trên mạng xã hội và các phương tiện truyền thông trực tuyến.

### 4. Generative Engine Optimization

Tối ưu hóa để trang web dễ dàng được các mô hình ngôn ngữ lớn (LLMs) và các tác nhân AI (AI Agents) thu thập, hiểu và lựa chọn làm nguồn trích dẫn (citations) cho các câu trả lời do AI tổng hợp (zero-click answers).

- **Conversational & Answer-First Structure:** Cấu trúc bài viết trả lời thẳng vào trọng tâm câu hỏi của người dùng ở ngay đầu đoạn, giúp các AI Agent dễ dàng trích xuất thông tin.
- **Machine Readability:** Sử dụng HTML ngữ nghĩa chuẩn và định dạng Schema.org (JSON-LD) chặt chẽ. Hạn chế phụ thuộc vào JavaScript ở client-side (nên dùng SSR/RSC) để các AI crawler dễ đọc.
- **AI Crawler Access:** Đảm bảo cấu hình `robots.txt` cho phép các bot AI (như `GPTBot`, `ClaudeBot`, `Google-Extended`) truy cập.
- **llms.txt Standard:** Triển khai file `/llms.txt` dạng Markdown súc tích ở thư mục gốc để cung cấp bản đồ tóm tắt nội dung tối ưu riêng cho AI Agents.

---

## Practical Implementation

### Tối ưu hóa SEO trong mã nguồn HTML

Dưới đây là cách khai báo cấu trúc dữ liệu bài viết (Article Schema) bằng JSON-LD để cung cấp siêu dữ liệu chi tiết cho công cụ tìm kiếm:

```html
<head>
  <title>SEO là gì? Hướng dẫn tối ưu hóa SEO cho Web Developers</title>
  <meta
    name="description"
    content="Khái niệm SEO và hướng dẫn từng bước tối ưu hóa Technical, On-Page, Off-Page giúp tăng thứ hạng website."
  />

  <!-- JSON-LD Structured Data -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": "SEO là gì? Hướng dẫn tối ưu hóa SEO cho Web Developers",
      "image": [
        "https://example.com/photos/1x1/photo.jpg",
        "https://example.com/photos/4x3/photo.jpg",
        "https://example.com/photos/16x9/photo.jpg"
      ],
      "datePublished": "2026-07-07T08:00:00+07:00",
      "dateModified": "2026-07-07T09:00:00+07:00",
      "author": [
        {
          "@type": "Person",
          "name": "Nguyễn Gia Khánh",
          "url": "https://example.com/profile/ngxc"
        }
      ]
    }
  </script>
</head>
```

| Chi phí                | SEO (Organic)                                                                     | PPC (Google Ads)                                                                |
| :--------------------- | :-------------------------------------------------------------------------------- | :------------------------------------------------------------------------------ |
| **Chi phí**            | Miễn phí cho mỗi lượt click. Cần đầu tư thời gian và tài nguyên xây dựng ban đầu. | Trả tiền trên mỗi lượt click (Pay-Per-Click). Dừng trả tiền sẽ dừng có traffic. |
| **Thời gian hiệu quả** | Cần thời gian lâu dài để xếp hạng (từ vài tuần đến vài tháng).                    | Xuất hiện ngay lập tức trên đỉnh SERPs khi kích hoạt chiến dịch.                |
| **Tính bền vững**      | Bền vững, tiếp tục mang lại traffic ngay cả khi ngừng tối ưu hóa tạm thời.        | Biến mất hoàn toàn ngay khi ngân sách quảng cáo cạn kiệt.                       |

### Cấu trúc nội dung tối ưu cho AI Agents

Các tác nhân AI (AI Agents) và Answer Engines (như Perplexity, SearchGPT) ưu tiên trích dẫn các đoạn văn bản có cấu trúc phân cấp mạch lạc và đi trực tiếp vào câu trả lời:

- **Cách viết thông thường (dành cho người đọc lướt truyền thống):**

> _"Khi lập trình một website y tế, nếu bạn đang thắc mắc không biết làm sao để nâng cao trải nghiệm người bệnh thì việc cải thiện khả năng điều hướng đóng vai trò vô cùng quan trọng giúp nâng cao thứ hạng..."_

- **Cách viết tối ưu hóa cho AI Agents / LLMs (Answer-First):**

> **Làm thế nào để cải thiện trải nghiệm người dùng trên website y tế?**
> Cải thiện trải nghiệm người dùng (UX) trên website y tế được thực hiện thông qua tối ưu hóa điều hướng bệnh nhân (patient navigation) và cải thiện hiệu năng kỹ thuật. [Answer-First]
> Các bước thực hiện bao gồm:
>
> 1. Xây dựng bộ lọc tìm kiếm bác sĩ theo tên/chuyên khoa/ngôn ngữ.
> 2. Đặt lịch khám nhanh thông qua các nút Call-to-Action (CTA) nổi bật.
> 3. Tối ưu hóa chỉ số phản hồi INP dưới 200ms để tăng tốc tương tác. [Supporting Details]

---

## Related Notes

- [[Next_Intl.md|Next_Intl (Đồng bộ vs Bất đồng bộ trong SEO Metadata)]]
