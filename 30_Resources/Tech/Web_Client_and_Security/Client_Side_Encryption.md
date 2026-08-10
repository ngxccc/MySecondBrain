---
tags: [type/concept, topic/security, topic/frontend, layer/infrastructure]
date: 2026-01-29
aliases: [AES Encryption, Secure Local Storage]
description: "Mã hóa LocalStorage/IndexedDB bằng thuật toán AES."
---

# Client-Side Encryption

## TL;DR

Sử dụng thuật toán (thường là AES) để mã hóa dữ liệu thành chuỗi vô nghĩa trước khi lưu vào LocalStorage/IndexedDB. Mục tiêu là làm rối (Obfuscation) để ngăn chặn việc đọc trộm dữ liệu nhạy cảm qua DevTools hoặc XSS cơ bản.

## Core Concept

- **Vấn đề:** Các API lưu trữ của trình duyệt mặc định lưu data dưới dạng Plain Text. Script độc hại chạy trên domain của em có quyền truy cập hoàn toàn vào các bộ nhớ này.
- **Cơ chế:** Áp dụng mã hóa đối xứng (Symmetric Encryption) - dùng chung một Secret Key để thực hiện cả thao tác khóa (Encrypt) và mở (Decrypt).
- **Yếu huyệt (Key Management):** Thuật toán mã hóa có thể không thể bị phá, nhưng chìa khóa thì có thể bị trộm. Lưu key trong `.env` (`NEXT_PUBLIC_...`) đồng nghĩa với việc key bị lộ trực tiếp trong JS Bundle.

## Practical Implementation

- **Trade-offs:** Đây chỉ là biện pháp phòng thủ nhiều lớp (Defense in Depth), không phải "viên đạn bạc". Nếu hacker kiểm soát được trình duyệt (qua Extension độc hại), họ vẫn đọc được dữ liệu trực tiếp từ RAM (Memory Dump) ngay khoảnh khắc em vừa chạy hàm giải mã.
- **Code Snippet (crypto-js):**

```typescript
import AES from "crypto-js/aes";
import CryptoJS from "crypto-js";

// WARNING: Hardcoding key is a bad practice. Consider deriving from user session.
const SECRET_KEY = process.env.NEXT_PUBLIC_APP_SECRET;

export const encrypt = (data: any) => {
  return AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

export const decrypt = (ciphertext: string) => {
  try {
    const bytes = AES.decrypt(ciphertext, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (err) {
    // Thuật toán sẽ throw error nếu ciphertext bị tamper (chỉnh sửa bậy bạ)
    return null;
  }
};
```

---

**Related Notes:**

- Nơi tiêu thụ logic này: [[Offline_Sync_Queue]]
- Cách giấu secret key an toàn hơn: [[Environment_Variables]]
