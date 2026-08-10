---
tags:
  [type/concept, topic/architecture, topic/frontend, pwa, layer/infrastructure]
date: 2026-01-29
aliases: [Background Sync, Outbox Pattern, Offline First]
description: "Kỹ thuật Outbox Pattern ở phía client cho ứng dụng Offline-First."
---

# Offline Sync Queue

## TL;DR

Kỹ thuật "lưu trước, gửi sau" (Store-forward) dành cho các ứng dụng Offline-First. Bắt các HTTP request bị lỗi do mất mạng, đẩy vào một hàng đợi (Queue) tại Local DB, và tự động gửi lại (Flush) khi thiết bị khôi phục kết nối internet.

## Core Concept

- **Vòng đời Sync (The Sync Lifecycle):**
  1. _Intercept:_ Đánh chặn request khi `navigator.onLine === false`.
  2. _Enqueue:_ Đóng gói cấu trúc request (URL, Method, Payload) thành một object và lưu vào IndexedDB.
  3. _Flush:_ Lắng nghe sự kiện `window.addEventListener('online')` để duyệt mảng và bắn lại request theo thứ tự FIFO (Vào trước ra trước).
- **Optimistic UI:** Kiến trúc này thường đi kèm với việc cập nhật giao diện thành công ngay lập tức (để user không bị gián đoạn trải nghiệm), giấu đi luồng xử lý đồng bộ bất đồng bộ ở dưới background.

## Practical Implementation

- **Trade-offs (Xung đột dữ liệu - Conflict Resolution):** Rủi ro lớn nhất là trạng thái dữ liệu bất đồng bộ. Ví dụ: Máy A sửa tên thành "John" lúc offline. Máy B sửa tên thành "Doe" lúc online. Khi máy A có mạng trở lại, Queue chạy và ghi đè "Doe" thành "John". Cần thiết lập chiến lược như _Last Write Wins_ (dựa vào timestamp) trên server.
- **Tử huyệt Spam Request:** Tuyệt đối không xóa request khỏi Queue nếu server trả về lỗi `5xx` (Lỗi từ phía server). Tuy nhiên, nếu cứ nhắm mắt bắn lại (retry) liên tục, client của em sẽ vô tình tạo ra một cuộc tấn công DDoS vào chính server của mình. Phải cài đặt thuật toán **Exponential Backoff** (tăng dần thời gian chờ giữa mỗi lần thử lại).

## Code Snippet

```typescript
// utils/syncManager.ts
import { db } from "./db";

export const sendData = async (url: string, body: any) => {
  if (navigator.onLine) {
    try {
      await fetch(url, { method: "POST", body: JSON.stringify(body) });
      return;
    } catch (err) {
      // Bắt lỗi rớt mạng giữa chừng (Network Error)
    }
  }

  // Fallback: Lưu vào IndexedDB (Outbox)
  await db.mutation_queue.add({
    url,
    method: "POST",
    body,
    createdAt: Date.now(),
  });
};

export const flushQueue = async () => {
  const tasks = await db.mutation_queue.orderBy("createdAt").toArray();

  for (const task of tasks) {
    try {
      const res = await fetch(task.url, {
        method: task.method,
        body: JSON.stringify(task.body),
      });
      if (res.ok || res.status === 400) {
        // Thành công hoặc lỗi do user (400) -> Xóa task. Không retry lỗi 400.
        await db.mutation_queue.delete(task.id!);
      }
    } catch (error) {
      break; // Lỗi mạng hoặc 500, dừng Flush loop, chờ lần sau.
    }
  }
};
```

---

**Related Notes:**

- Nơi lưu trữ Queue an toàn ở Client: [[Client_Side_Encryption]]
- Giải pháp hoàn chỉnh bọc sẵn cơ chế này: [[TanStack_Query]]
