---
tags: [type/concept, topic/testing, layer/quality]
status: permanent
date: 2026-08-14
description: Architectural deep dive comparing Selenium W3C WebDriver (HTTP Proxy) vs Playwright CDP (Direct WebSocket)
---

# WebDriver vs CDP Architectural Comparison

## TL;DR

Sự khác biệt cốt lõi giữa Selenium và Playwright nằm ở tầng kiến trúc mạng: Selenium sử dụng **HTTP REST API** qua một máy chủ trung gian (`chromedriver`), trong khi Playwright kết nối **WebSocket 2 chiều trực tiếp** vào Browser Engine qua giao thức **CDP**, mang lại tốc độ thực thi vượt trội và khả năng bắt sự kiện mạng theo thời gian thực.

## Architectural Models Comparison

```text
[Selenium W3C WebDriver Model]
Node.js/Java Script ──(HTTP REST)──▶ [chromedriver Proxy] ──(HTTP/IPC)──▶ [Browser Process]
(Mỗi command là 1 HTTP Request/Response tuần tự, cần khởi tạo TCP handshake và parse HTTP headers)

[Playwright CDP Model]
Node.js/Bun Script ◀══════(Single Full-Duplex WebSocket Connection)══════▶ [Browser Process]
(Duy trì 1 socket duy nhất, truyền nhận JSON-RPC hai chiều liên tục)
```

## Detailed Technical Comparison

| Khía cạnh kiến trúc       | Selenium W3C WebDriver                                                         | Playwright CDP / BiDi                                                   |
| :------------------------ | :----------------------------------------------------------------------------- | :---------------------------------------------------------------------- |
| **Giao thức mạng**        | HTTP/1.1 REST Requests                                                         | WebSocket (Full-Duplex)                                                 |
| **Thành phần trung gian** | Bắt buộc có binary driver riêng (`chromedriver`, `geckodriver`) làm proxy      | Kết nối trực tiếp vào Browser Engine, không qua proxy                   |
| **Overhead mỗi lệnh**     | Cao (chịu chi phí tạo HTTP Request/Response, headers)                          | Siêu thấp (chỉ là 1 chuỗi JSON trên kết nối socket có sẵn)              |
| **Mô hình bắt sự kiện**   | **Polling (Kéo):** Client phải liên tục hỏi server xem trạng thái đã xong chưa | **Event-Driven (Đẩy):** Browser chủ động bắn event ngay khi có thay đổi |
| **Network Interception**  | Khó khăn (phải dựng thêm HTTP Proxy Server ngoài như BrowserMob)               | Tích hợp sẵn và tức thời ở mức network layer của browser                |
| **Đa trình duyệt**        | Dựa trên chuẩn W3C WebDriver do từng vendor phát triển                         | Dùng chung một giao diện API thống nhất cho Chromium, Firefox, WebKit   |

## Related Notes

- [[Browser_Automation_IPC_Fundamentals]]
- [[Chrome_DevTools_Protocol_Mechanics]]
- [[Browser_Context_Isolation]]
- [[000_Software_Testing_Playwright_MOC]]
