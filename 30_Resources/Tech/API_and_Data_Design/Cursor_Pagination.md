---
tags: [type/concept, topic/backend, layer/infrastructure]
date: 2026-02-08
aliases: [Cursor Pagination, Offset Pagination]
description: "Phân trang hiệu suất cao O(1) thay thế cho Offset O(N) cồng kềnh."
---

# REST API Pagination & Filtering

## TL;DR

Kỹ thuật cắt nhỏ dữ liệu lớn thành từng chunk (Phân trang) và tinh chỉnh kết quả (Lọc/Sắp xếp) thông qua URL Parameters. Mục tiêu là chống tràn RAM (Memory overflow) cho Server và giảm tải băng thông (Network latency) cho Client.

## Core Concept

- **Offset Pagination (The Cost of $O(N)$):** Dùng `LIMIT 10 OFFSET 1000`.
  - _Bản chất:_ Database vẫn phải quét (scan) qua 1,000 dòng đầu tiên rồi mới vớt lấy 10 dòng cuối. Càng scroll sâu, query càng chậm $\rightarrow$ Không scale được với data khổng lồ.
- **Cursor Pagination (The Power of $O(1)$ / $O(\log N)$):** Dùng `WHERE id > last_seen_id LIMIT 10`.
  - _Bản chất:_ Dựa vào Index của Database (B-Tree), query nhảy thẳng đến vị trí của con trỏ (Cursor) ngay lập tức. Hiệu suất ổn định (Deterministic) bất chấp bảng có hàng triệu records.

## Practical Implementation

- **Trade-offs (Kẻ thù của Real-time Feeds):** Tuyệt đối không dùng Offset cho các ứng dụng có luồng dữ liệu liên tục (như Newsfeed mạng xã hội). Khi user ở Page 1, có 5 bài viết mới được người khác insert vào DB. Khi user bấm sang Page 2, Offset bị đẩy lệch đi 5 dòng $\rightarrow$ User sẽ thấy lại các bài viết cũ đã đọc ở Page 1 (Duplicate content) hoặc bị lọt mất bài (Missing item). Cursor Pagination giải quyết triệt để vấn đề này vì nó cắm mốc thời gian/ID cố định.
- **Tử huyệt "Missing Item Mystery":** Xảy ra khi dùng Cursor Pagination với một trường (field) không mang tính duy nhất (Ví dụ: `ORDER BY created_at`). Nếu có 2 records tạo ra cùng 1 mili-giây, query sẽ bỏ sót data. Bắt buộc phải dùng **Tie-breaker**: Sắp xếp kèm theo Primary Key (Ví dụ: `ORDER BY created_at DESC, id DESC`).
- **Code Snippet (Opaque Cursor Pattern):**

```typescript
// Encode/Decode cursor (Base64) để giấu logic DB khỏi Client
const encodeCursor = (date: Date, id: string) =>
  Buffer.from(`${date.toISOString()}_${id}`).toString("base64");

export const getProducts = async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const cursor = req.query.cursor as string;

  // Hack: Fetch (limit + 1) để biết có trang tiếp theo (hasNextPage) hay không
  let query = db
    .select()
    .from(products)
    .orderBy(desc(products.createdAt), desc(products.id))
    .limit(limit + 1);

  if (cursor) {
    const [lastDate, lastId] = decodeCursor(cursor).split("_");
    // Logic nhảy thẳng tới đích dựa trên Index
    query = query.where(sql`(created_at, id) < (${lastDate}, ${lastId})`);
  }

  const items = await query;
  const hasNextPage = items.length > limit;
  const data = hasNextPage ? items.slice(0, -1) : items; // Cắt bỏ phần tử dư thừa

  res.json({
    data,
    meta: {
      next_cursor: hasNextPage
        ? encodeCursor(data.at(-1).createdAt, data.at(-1).id)
        : null,
    },
  });
};
```

---

**Related Notes:**

- Tối ưu hóa truy xuất Cursor: [[Database_Indexing_BTree]]
- Chiến lược quản lý khi thay đổi cấu trúc API: [[API_Versioning_Strategies]]
