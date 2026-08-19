---
tags: [type/concept, topic/testing, layer/quality]
status: permanent
date: 2026-08-14
description: Architectural differences, resource overhead, and network execution pipeline between APIRequestContext and Browser Engine in Playwright
---

# APIRequestContext vs Browser Engine

## TL;DR

`APIRequestContext` (fixture `{ request }`) là một HTTP Client độc lập thực thi trực tiếp trên Node.js/Bun Runtime, **hoàn toàn không khởi chạy tiến trình trình duyệt (Chromium/WebKit/Firefox)**. So với `page.goto()` tốn hàng trăm MB RAM và hàng giây để parse DOM, tính toán CSSOM, render layout và thực thi script giao diện, `APIRequestContext` chỉ mở kết nối TCP Socket thuần túy để gửi/nhận raw HTTP bytes, giúp tăng tốc độ thực thi $50 - 100\times$ và giảm $95\%$ tài nguyên bộ nhớ.

## Browser Rendering Pipeline vs TCP Socket Stream

Sự chênh lệch về hiệu năng và tài nguyên giữa hai phương pháp bắt nguồn từ số lượng tầng xử lý (Layers) mà dữ liệu phải đi qua:

```text
[UI Path: page.goto('/theaters')]
Node.js ──(CDP WebSocket)──▶ Chromium Process (~150MB RAM)
                                ├── 1. TCP Socket Handshake
                                ├── 2. HTTP Request / Response Transfer
                                ├── 3. Parse HTML ──▶ Build DOM Tree
                                ├── 4. Parse CSS  ──▶ Build CSSOM Tree
                                ├── 5. Execute Frontend JavaScript (V8 Engine)
                                ├── 6. Layout (Reflow) ──▶ Paint ──▶ Composite (GPU)
                                └── 7. Calculate Accessibility Tree (AOM)
                            (Thời gian: 500ms - 2500ms)

─────────────────────────────────────────────────────────────────────────────

[API Path: request.get('/theaters')]
Node.js Runtime (~15MB RAM)
   └── Node.js HTTP/HTTPS Client (Native TCP Stream)
          ├── 1. TCP Handshake
          ├── 2. Gửi raw HTTP byte buffer: GET /theaters HTTP/1.1\r\n...
          └── 3. Đọc raw HTTP response buffer ──▶ JSON.parse()
      (Thời gian: 2ms - 15ms)
```

## So Sánh Kỹ Thuật Chi Tiết

| Tiêu Chí                 | UI Engine (`page`)                          | API Engine (`request`)                            |
| :----------------------- | :------------------------------------------ | :------------------------------------------------ |
| **Tiến trình khởi chạy** | `chromium` / `webkit` / `firefox` binary    | Node.js process hiện hành                         |
| **Tài nguyên RAM**       | $100\text{ MB} - 300\text{ MB}$ mỗi Context | $< 5\text{ MB}$ cho HTTP connection pool          |
| **Độ trễ trung bình**    | $500\text{ms} - 3000\text{ms}$              | $2\text{ms} - 20\text{ms}$                        |
| **Xử lý tài nguyên phụ** | Tải CSS, JS, WebFonts, Hình ảnh, Tracking   | Không tải bất kỳ tài nguyên phụ nào               |
| **Tính toán Giao diện**  | DOM, CSSOM, Layout, Paint, AOM Tree         | Bỏ qua hoàn toàn ($0\%$ render overhead)          |
| **Mục đích sử dụng**     | End-to-End User Journey, Visual Testing     | API Contracts, Concurrency, Seed Data, Auth State |

## 20/80 Pareto Leverage: Testing Pyramid Alignment

Theo mô hình Kim Tự Tháp Kiểm Thử (Testing Pyramid), việc lạm dụng UI Test cho mọi kịch bản là nguyên nhân hàng đầu gây chậm CI/CD và sinh lỗi chập chờn (Flaky Test).

Áp dụng nguyên lý 20/80 với `APIRequestContext`:

1. **Kiểm thử nghiệp vụ cốt lõi qua API:** Xác thực phân quyền (RBAC), logic tính tiền vé, validation dữ liệu, mã lỗi RFC 9457 qua `request` để đạt độ phủ $80\%$ với thời gian chạy dưới vài giây.
2. **Dành UI Test cho luồng trọng yếu (Critical Path):** Chỉ sử dụng `page` để kiểm tra trải nghiệm người dùng thực tế (giao diện chọn ghế rạp chiếu phim, responsive, visual interaction).

## Related Notes

- [[Browser_Automation_IPC_Fundamentals]]
- [[Browser_Context_Isolation]]
- [[Network_Interception_and_Mocking_Mechanics]]
- [[000_Software_Testing_Playwright_MOC]]
