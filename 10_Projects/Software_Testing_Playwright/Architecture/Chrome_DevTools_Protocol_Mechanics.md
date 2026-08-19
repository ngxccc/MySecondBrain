---
tags: [type/concept, topic/testing, layer/quality]
status: permanent
date: 2026-08-14
description: Internal mechanics of Chrome DevTools Protocol (CDP), JSON-RPC serialization, and WebSocket multiplexing
---

# Chrome DevTools Protocol Mechanics

## TL;DR

Chrome DevTools Protocol (CDP) là giao thức điều khiển Chromium dựa trên **JSON-RPC qua WebSocket 2 chiều**. Giao thức này cho phép bắn các lệnh điều khiển bất đồng bộ (Asynchronous Command Multiplexing) và nhận luồng sự kiện DOM/Network theo thời gian thực từ Browser Engine theo **Mô hình Đẩy (Push Model)**.

## JSON-RPC Message Format & Multiplexing

Mọi giao tiếp giữa Playwright và Chromium đều diễn ra dưới dạng các bản tin JSON-RPC:

### 1. Cấu trúc lệnh gửi đi (Command SEND)

```json
{
  "id": 1,
  "method": "Page.navigate",
  "params": {
    "url": "https://www.saucedemo.com/"
  }
}
```

### 2. Cấu trúc phản hồi (Response RECV)

```json
{
  "id": 1,
  "result": {
    "frameId": "3F8A7D9C...",
    "loaderId": "5B2E1A4D..."
  }
}
```

### 3. Cơ chế ghép cặp ID (Multiplexing)

- Do kết nối WebSocket là bất đồng bộ (Asynchronous), Node.js có thể bắn liên tiếp hàng loạt lệnh (`id: 1`, `id: 2`, `id: 3`) mà không cần chờ lệnh trước hoàn thành.
- Chromium xử lý xong lệnh nào sẽ trả lời kèm đúng `id` đó, giúp Promise tương ứng trong Node.js được resolve tức thì mà không bị tắc nghẽn đường truyền (No Head-of-Line Blocking ở tầng ứng dụng).

## Event-Driven Push Model (Mô hình Đẩy)

Khác với các API truyền thống bắt buộc Client phải liên tục thăm dò (Polling), Chromium có thể chủ động **đẩy sự kiện (Events)** về cho Client ngay khi phát sinh trong Render Loop:

```json
{
  "method": "Network.requestWillBeSent",
  "params": {
    "requestId": "1000.12",
    "request": {
      "url": "https://www.saucedemo.com/api/login",
      "method": "POST"
    }
  }
}
```

Nhờ cơ chế này, Playwright có thể thực hiện **Network Interception (chặn bắt/sửa request)** và theo dõi tải trang với độ trễ 0ms.

## Related Notes

- [[Browser_Automation_IPC_Fundamentals]]
- [[WebDriver_vs_CDP_Architectural_Comparison]]
- [[Browser_Context_Isolation]]
- [[000_Software_Testing_Playwright_MOC]]
