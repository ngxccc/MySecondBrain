---
tags: [type/concept, topic/testing, layer/quality]
status: permanent
date: 2026-08-14
description: Browser Context Isolation mechanics and how it prevents state leakage in automation testing
---

# Browser Context Isolation

## TL;DR

Browser Context là một môi trường phiên làm việc hoàn toàn độc lập (tương đương Incognito Profile) được khởi tạo bên trong một tiến trình Browser duy nhất. Nó giải quyết triệt để vấn đề rò rỉ trạng thái (State Leakage) giữa các bài test song song mà không phải gánh chi phí tài nguyên nặng nề của việc mở nhiều tiến trình hệ điều hành (OS Process).

## Core Mechanics

### 1. Cơ chế khởi tạo qua CDP

Khi Playwright bắt đầu một test case mới, nó gửi lệnh JSON-RPC:

```json
{
  "id": 3,
  "method": "Target.createBrowserContext",
  "params": { "disposeOnDetach": true }
}
```

Chromium phản hồi bằng một định danh duy nhất `browserContextId` (ví dụ: `AC90A97FD3E370692AD7EA99FC521BE2`).

### 2. Phạm vi cô lập (Isolation Scope)

Mỗi Browser Context sở hữu một vùng lưu trữ riêng biệt trong bộ nhớ:

- **Cookies & Session Storage:** Không bị đọc chéo hoặc ghi đè giữa các Context.
- **LocalStorage & IndexedDB:** Hoàn toàn tách rời theo từng origin trong Context đó.
- **HTTP Cache & Connection Pool:** Được quản lý độc lập.
- **Lifecycle Cleanup:** Khi gọi `context.close()`, toàn bộ dữ liệu tạm được giải phóng ngay lập tức trong vài mili-giây.

## Why It Matters (Selenium vs Playwright)

| Tiêu chí                      | Selenium Legacy (Multi-Process)                                     | Playwright (Browser Context)                                        |
| :---------------------------- | :------------------------------------------------------------------ | :------------------------------------------------------------------ |
| **Mô hình cô lập**            | Bật $N$ tiến trình OS độc lập (`chrome.exe`) cho $N$ test cases     | Chạy $1$ tiến trình OS duy nhất, phân nhánh $N$ Context trong RAM   |
| **Tiêu tốn RAM**              | Rất lớn (~500MB – 1GB / tiến trình $\times N$)                      | Rất nhỏ (1 tiến trình gốc ~300MB, mỗi Context tốn thêm vài chục KB) |
| **Thời gian khởi tạo**        | 2000ms – 5000ms / bài test                                          | 2ms – 10ms / bài test                                               |
| **Rủi ro rò rỉ (State Leak)** | Cao (nếu tái sử dụng browser giữa các tests để tiết kiệm thời gian) | Bằng 0 (mỗi test case là một Context mới tinh khôi)                 |

## Related Notes

- [[Project_Roadmap_and_Research_Plan]]
- [[000_Software_Testing_Playwright_MOC]]
