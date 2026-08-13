---
created_at: Tuesday, March 31st 2026, 8:14:18 pm +07:00
updated_at: Tuesday, March 31st 2026, 8:20:37 pm +07:00
---

## Phase 0: Bản Vẽ Kiến Trúc & User Stories (~1 tuần)

- [x] **Viết User Stories cốt lõi:**
      Ví dụ:* "Là chủ xưởng (User), tôi muốn lọc máy phát điện theo số pha (1 pha/3 pha) và nhiên liệu (Dầu/Xăng) để tìm đúng máy tương thích hạ tầng."
- [x] **Vẽ ERD (Entity Relationship Diagram):** Dùng dbdiagram.io. Chốt hạ các bảng: products, users, orders, order_items, categories.
- [x] **Vẽ Sequence Diagram (Thanh toán & AI):** Dùng Mermaid.js hoặc PlantUML. Vẽ luồng User hỏi Chatbot -> Chatbot lookup DB -> Trả kết quả.
- [x] **Chốt Stack Công Nghệ:** Next.js 16 (App Router), Bun, Drizzle ORM, PostgreSQL (Neon), Zustand, TailwindCSS, **LangChain/LangGraph** (Cho AI DAG chatbot).

## Phase 1: Vá móng & Đổ bê tông DB (~1 tuần)

- [x] Khởi tạo **Drizzle ORM** ngay trong folder packages/database.
- [x] Viết Schema bằng Drizzle. Bắt buộc dùng cột JSONB cho thông số kỹ thuật (Specs).
- [x] Cấu hình zod validate cho file env.ts.
- [x] Xuất (export) schema và DB instance thông qua mô hình Barrel (index.ts).

## Phase 2: Ráp điện nước (Server Actions & API - ~1.5 tuần)

- [x] Vào apps/storefront, tạo server/actions.
- [ ] Code Action: Lấy danh sách máy phát điện (có filter, pagination).
- [x] Code Action: Xử lý Đăng ký / Đăng nhập (Dùng NextAuth hoặc tự build JWT).

## Phase 3: Đắp UI & Xử lý Client (Bro đang làm dở cái này)

- [x] Hoàn thiện nốt phần i18n (vi/en) cho các trang chi tiết.
- [ ] Tích hợp giỏ hàng (Zustand persist storage).
- [ ] Code UI trang Checkout.

## Phase 4: Vũ khí hạng nặng - Chatbot AI DAG & Thanh toán (~2 tuần)

- [ ] **Tích hợp Payment:** Code logic tạo URL thanh toán VNPay/Stripe và tạo API Webhook để nghe phản hồi khi user chuyển khoản xong.
- [ ] **Thiết kế DAG Chatbot (LangGraph):**
  - Tạo Node phân loại ý định (Người dùng muốn hỏi kỹ thuật hay hỏi giá?).
  - Tạo Tool cho AI gọi thẳng vào packages/database để tìm máy phát điện tồn kho.
- [ ] **Gắn UI Chatbot:** Code cái popup góc phải màn hình, stream text về (như ChatGPT).

## Phase 5: Document & Obsidian Sync (Thực hiện liên tục)

- [ ] Dùng cái script sync.sh trong Second Brain của bro để auto push docs lên GitHub.
- [ ] Cập nhật file README.md của Monorepo: Dán mấy cái hình ERD và Sequence Diagram vào để HR nhìn là mê.
