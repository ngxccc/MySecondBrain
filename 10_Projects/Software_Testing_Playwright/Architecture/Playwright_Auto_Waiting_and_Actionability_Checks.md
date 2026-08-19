---
tags: [type/concept, topic/testing, layer/quality]
status: permanent
date: 2026-08-14
description: Core mechanics of Playwright Auto-waiting and the 5-step Actionability Checks pipeline for eliminating flaky tests
---

# Playwright Auto-Waiting and Actionability Checks

## TL;DR

Auto-waiting là cơ chế cốt lõi của Playwright giúp loại bỏ hoàn toàn vấn nạn **Flaky Test (Test chập chờn)** bằng cách chuyển từ mô hình "đoán thời gian" (Time-based `sleep`) sang mô hình **"kiểm tra trạng thái sẵn sàng" (State-based Actionability Checks)**. Trước khi thực hiện bất kỳ thao tác người dùng nào (`click`, `fill`, `hover`), Playwright tự động kiểm tra tuần tự 5 điều kiện vật lý của phần tử và chỉ bắn lệnh khi toàn bộ điều kiện đều thỏa mãn.

## The Flaw of Time-Based Waiting (`sleep`)

Trong các công cụ kiểm thử cũ (như Selenium), bất đồng bộ giữa mạng và Render Loop thường gây ra lỗi `ElementClickInterceptedException` hoặc `StaleElementReferenceException`. Lập trình viên thường "chữa cháy" bằng các lệnh dừng cứng:

- **`Thread.sleep(5000)` / `time.sleep(5)`:** Gây lãng phí thời gian chạy vô ích khi server đã phản hồi nhanh, nhưng vẫn fail khi mạng bất ngờ chậm hơn 5 giây trên môi trường CI/CD.

## The 5-Step Actionability Pipeline

Trước khi gửi thao tác (ví dụ: `page.click(selector)`), Playwright liên tục kiểm tra 5 điều kiện theo từng frame render:

```text
┌───────────────────────────────────────────────────────────┐
│ 1. Attached: Element có gắn trong DOM Tree không?        │
└─────────────────────────────┬─────────────────────────────┘
                              ▼ (Yes)
┌───────────────────────────────────────────────────────────┐
│ 2. Visible: Element có hiển thị trên màn hình không?      │
│    (Bounding box > 0, không display:none/visibility:hidden)│
└─────────────────────────────┬─────────────────────────────┘
                              ▼ (Yes)
┌───────────────────────────────────────────────────────────┐
│ 3. Stable: Element đã dừng animation/transition chưa?     │
│    (Tọa độ bounding box bất biến qua 2 frame liên tiếp)   │
└─────────────────────────────┬─────────────────────────────┘
                              ▼ (Yes)
┌───────────────────────────────────────────────────────────┐
│ 4. Receives Events: Element có đón nhận được sự kiện?     │
│    (Hit-testing: document.elementFromPoint trả về chính nó)│
└─────────────────────────────┬─────────────────────────────┘
                              ▼ (Yes)
┌───────────────────────────────────────────────────────────┐
│ 5. Enabled: Element có ở trạng thái khả dụng không?       │
│    (Không mang thuộc tính disabled)                       │
└─────────────────────────────┬─────────────────────────────┘
                              ▼ (Yes)
               [ Bắn sự kiện qua CDP WebSocket ]
```

## Hit-Testing Mechanics (`document.elementFromPoint`)

Tại bước 4 (**Receives Events**), Playwright xác định tâm điểm $(x_c, y_c)$ của phần tử và gọi hàm nội tại của Browser Engine:

```javascript
const topElement = document.elementFromPoint(xc, yc);
```

- **Xử lý Overlay / Spinner:** Nếu một thẻ `<div class="loading-spinner">` đang che phủ nút bấm, `topElement` sẽ là thẻ spinner chứ không phải nút bấm $\to$ Playwright tự động chờ tiếp cho đến khi spinner biến mất.
- **Edge Case `pointer-events: none`:** Khi một phần tử có CSS `pointer-events: none`, trình duyệt coi phần tử đó là "trong suốt" đối với chuột; `document.elementFromPoint` sẽ bỏ qua nó và trả về phần tử nằm bên dưới.

## Why It Matters

| Tiêu chí             | Time-Based Waiting (`sleep`)                   | Playwright Auto-Waiting                                     |
| :------------------- | :--------------------------------------------- | :---------------------------------------------------------- |
| **Độ tin cậy**       | Thấp (Dễ bị Flaky khi hạ tầng CI/CD lag)       | Tuyệt đối (Chỉ thực thi khi DOM đã sẵn sàng)                |
| **Tốc độ thực thi**  | Chậm (Phải chờ hết thời gian cấu hình cứng)    | Tối ưu (Thực thi ngay mili-giây đầu tiên element đạt chuẩn) |
| **Bảo trì mã nguồn** | Rác mã nguồn với hàng loạt lệnh `sleep`/`wait` | Code gọn gàng, tự nhiên và dễ đọc                           |

## Related Notes

- [[Browser_Automation_IPC_Fundamentals]]
- [[Chrome_DevTools_Protocol_Mechanics]]
- [[WebDriver_vs_CDP_Architectural_Comparison]]
- [[000_Software_Testing_Playwright_MOC]]
