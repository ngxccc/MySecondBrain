---
tags: [type/concept, topic/testing, layer/quality]
status: permanent
date: 2026-08-14
description: Critical hard technical boundaries, unsupported use cases, and explicit non-goals of Microsoft Playwright
---

# Playwright Hard Technical Boundaries and Non Goals

## TL;DR

Hiểu rõ các ranh giới kỹ thuật cứng (Hard Technical Boundaries) và những mục tiêu nằm ngoài phạm vi thiết kế (Non-Goals) của Playwright là điều kiện tiên quyết để kiến trúc sư kiểm thử không đưa ra các quyết định sai lầm trong sản xuất. Playwright được tối ưu hóa cho kiểm thử chức năng Web và API trong môi trường Staging/CI; nó **hoàn toàn không phù hợp** cho kiểm thử đồ họa Canvas/WebGL, vượt rào bảo mật Cloudflare WAF, kiểm thử chịu tải quy mô lớn (Load Testing), hay kiểm thử ứng dụng Native di động trên phần cứng thật.

## 6 Hard Technical Boundaries in Production

```text
┌────────────────────────────────────────────────────────────────────────┐
│             BẢN ĐỒ 6 RANH GIỚI KỸ THUẬT CỦA PLAYWRIGHT                 │
├────────────────────────────────┬───────────────────────────────────────┤
│ 1. Canvas & WebGL Blackbox     │ Thẻ <canvas> chỉ là mảng pixel bitmap,│
│                                │ không có cây DOM bên trong để định vị.│
├────────────────────────────────┼───────────────────────────────────────┤
│ 2. Cloudflare & Bot Protection │ Bị WAF chặn do cờ CDP, navigator flag │
│                                │ và hành vi headless không tự nhiên.  │
├────────────────────────────────┼───────────────────────────────────────┤
│ 3. Load Testing Fallacy        │ Mỗi browser tốn ~150MB RAM; không thể │
│                                │ giả lập 10,000 users (Phải dùng k6).  │
├────────────────────────────────┼───────────────────────────────────────┤
│ 4. Closed Shadow DOM           │ Chế độ mode: "closed" chặn đứng mọi   │
│                                │ nỗ lực xuyên thấu của CDP/JS ngoài.   │
├────────────────────────────────┼───────────────────────────────────────┤
│ 5. Worker Memory Accumulation  │ Rò rỉ bộ nhớ dài ngày do event CDP    │
│                                │ khi chạy test suite khổng lồ liên tục.│
├────────────────────────────────┼───────────────────────────────────────┤
│ 6. Real Mobile Hardware & OS   │ Chỉ là Device Emulation trên desktop; │
│                                │ không test được Camera/GPS/iOS Safari.│
└────────────────────────────────┴───────────────────────────────────────┘
```

---

### Deep Dive 1: Hộp đen Canvas, WebGL & Sơ đồ Rạp Chiếu Phim

- **Cơ chế gốc:** Playwright định vị phần tử dựa trên Accessibility Tree (AOM) và DOM Tree.
- **Ranh giới:** Khi ứng dụng vẽ sơ đồ chọn ghế hoặc biểu đồ chứng khoán bằng HTML5 `<canvas>` / WebGL, toàn bộ vùng vẽ chỉ là **1 thẻ `<canvas>` duy nhất**. Không có bất kỳ thẻ `<button>` hay `<div>` nào tồn tại trong DOM.
- **Giải pháp:**
  1. Sử dụng tọa độ tương đối (`page.mouse.click(x, y)` - rất dễ gãy khi đổi kích thước màn hình).
  2. Sử dụng Visual Snapshot Testing để so sánh hình ảnh.
  3. Hoặc yêu cầu Frontend cung cấp API/Custom Event để trigger hành động chọn ghế thay vì cố click vào canvas.

---

### Deep Dive 2: Hàng rào Chống Bot, WAF & Cloudflare Turnstile

- **Ranh giới:** Các hệ thống bảo mật hiện đại (Cloudflare, Akamai, DataDome) chủ động phát hiện automation bằng cách kiểm tra:
  - Cờ `navigator.webdriver = true`.
  - Sự tồn tại của các hàm CDP ngầm trong window (`window.cdc_adoQpoasnfa76pfcZLmcfl_Array`).
  - Dấu vân tay TLS (TLS Fingerprinting) và tính đồng nhất của font chữ / GPU canvas.
- **Non-Goal:** Đội ngũ Playwright **chủ động từ chối** biến Playwright thành một công cụ lách luật (Stealth Tool). Playwright được thiết kế cho môi trường kiểm thử nội bộ nơi WAF được cấu hình tắt hoặc cho phép IP Whitelist.

---

### Deep Dive 3: Ảo tưởng Kiểm thử Tải (The Load Testing Fallacy)

- **Sai lầm phổ biến:** Kỹ sư cố gắng dùng Playwright để chạy 5,000 bài test đồng thời nhằm kiểm tra khả năng chịu tải của Backend.
- **Hậu quả kiến trúc:**
  - Mỗi Browser Process ngốn từ $150\text{MB}$ đến $300\text{MB}$ RAM.
  - Để chạy 5,000 browser thực sự, bạn cần máy chủ có ít nhất **$1\text{TB}$ RAM**! Máy chủ test sẽ bị sập vì nghẽn CPU/RAM trước khi Backend kịp nhận tải.
- **Quy tắc $20/80$:** Kiểm thử tải (Performance/Load Testing) bắt buộc phải sử dụng các công cụ tạo tải socket tầng mạng nhẹ như **k6, Locust, Gatling, JMeter** (1 máy tính có thể bắn hàng trăm ngàn TCP requests/giây).

---

### Deep Dive 4: Closed Shadow DOM Encapsulation

```html
<!-- Open Shadow DOM: Playwright tự động xuyên qua (Piercing) -->
<custom-button>
  #shadow-root (open)
  <button>Xác nhận</button>
  <!-- Playwright tìm thấy dễ dàng -->
</custom-button>

<!-- Closed Shadow DOM: Playwright BỊ CHẶN HOÀN TOÀN -->
<secure-input>
  #shadow-root (closed)
  <input type="password" />
  <!-- JavaScript và CDP không thể chạm tới -->
</secure-input>
```

Khi một Web Component được đóng gói với `mode: "closed"`, thuộc tính `element.shadowRoot` trả về `null`. Playwright tuân thủ nghiêm ngặt chuẩn Web Component và không thể tương tác trực tiếp với các phần tử bên trong Shadow DOM đóng này.

## Related Notes

- [[Playwright_Auto_Waiting_and_Actionability_Checks]]
- [[Role_Based_Locators_and_Accessibility_Tree]]
- [[APIRequestContext_vs_Browser_Engine]]
- [[Playwright_vs_Selenium_and_Puppeteer_Comparison]]
- [[000_Software_Testing_Playwright_MOC]]
