---
tags: [type/method, topic/project-management, layer/quality]
status: permanent
date: 2026-08-18
description: Deep architectural breakdown of POM, COM, Accessibility Role-based locators, Network Interception, and Definition of Done for WBS 1.4A
---

# WBS 1.4A: Web UI Testing Capabilities and Design Patterns

## Metadata

- **WBS Code:** `1.4A`
- **Task Name:** Phân tích Năng lực Web UI (POM, Role-based Locators, page.route())
- **Assignee:** Lê Minh Quân (MSSV: 0306241143)
- **Task Weight:** `2.5%`
- **Deliverable Artifacts:** Mục 2.3 Chương 2 trong `67_Bao_cao.docx` và các Slide tương ứng trong `67_Slide.pptx`.

## TL;DR

Tài liệu đặc tả chuyên sâu 3 trụ cột kỹ thuật kiểm thử giao diện Web (Web UI Automation) của Playwright: Kiến trúc phân lớp Page Object Model (POM) kết hợp Component Object Model (COM), chiến lược định vị phần tử thế hệ mới dựa trên cây Accessibility Tree (Role-based Locators), và kỹ thuật can thiệp tầng mạng (Network Interception & Mocking qua `page.route()`).

## Core Architectural Content to Document

### 1. Kiến Trúc Phân Lớp POM & COM (Page Object & Component Object Model)

```text
pages/
├── components/                 <-- Component Object Model (Tai su dung da trang)
│   └── NavbarComponent.ts      <-- Menu, Shopping Cart Badge, Logout button
├── LoginPage.ts                <-- Form dang nhap & validation error
├── InventoryPage.ts            <-- Danh sach san pham, filter gia, add-to-cart
├── CartPage.ts                 <-- Gio hang, danh sach item, nut Checkout
└── CheckoutPage.ts             <-- Form dien thong tin, tong tien, nut Finish

tests/e2e/                      <-- Test Scenarios (Ngan gon, ro rang, de bao tri)
└── checkout.spec.ts            <-- Kich ban kiem thu E2E hoan chinh
```

- **Nguyên lý Single Responsibility:** Tách biệt hoàn toàn phần tử giao diện (Locators) và phương thức nghiệp vụ khỏi kịch bản kiểm thử (`expect`). Khi giao diện thay đổi, lập trình viên chỉ cần sửa đổi 1 file Page/Component duy nhất.
- **Component Object Model (COM):** Đóng gói các thành phần giao diện lặp lại trên nhiều trang (Header, Navbar, Footer, Modal dialog) thành các class độc lập được nhúng (compose) vào các Page Objects.

### 2. Chiến Lược Định Vị Bền Vững (Role-Based Locators & Accessibility Tree)

- **Hệ thống phân cấp ưu tiên bộ định vị:**
  1. `page.getByRole('button', { name: 'Submit' })` (Ưu tiên số 1: Tiếp cận dưới góc nhìn người dùng thực tế và chuẩn trợ năng Screen Reader).
  2. `page.getByLabel('Username')` (Định vị qua nhãn liên kết form).
  3. `page.getByPlaceholder('Enter your email')` (Định vị qua gợi ý ô nhập liệu).
  4. `page.getByTestId('checkout-btn')` (Định vị qua thuộc tính kiểm thử tường minh `data-testid`).
- **Nghiêm cấm (Anti-patterns):** Tuyệt đối không dùng XPath tuyệt đối (`/html/body/div[2]/...`) hoặc tên CSS class ngẫu nhiên (`.btn-primary-2x_9a`) vì chúng sẽ gãy vụn ngay khi ứng dụng cập nhật giao diện.

### 3. Can Thiệp Tầng Mạng & Mocking (`page.route()`)

```typescript
// Gia lap Server bi loi HTTP 500 de kiem tra giao dien xu ly loi
await page.route("**/api/v1/checkout", async (route) => {
  await route.fulfill({
    status: 500,
    contentType: "application/json",
    body: JSON.stringify({ error: "Internal Server Error" }),
  });
});
```

- **Khả năng can thiệp:** Playwright cho phép chặn bắt mọi HTTP Request ở cấp độ giao thức CDP trước khi nó rời khỏi trình duyệt.
- **Ứng dụng thực tế:**
  - Mock dữ liệu JSON trả về để kiểm thử các trường hợp dữ liệu biên (Edge Cases).
  - Chặn các tài nguyên nặng (`.png`, `.woff2`, `.mp4`) qua lệnh `route.abort()` để tăng tốc độ chạy test suite lên gấp 3 lần.

---

## Acceptance Criteria & Definition of Done (DoD Checklist)

- [ ] **Báo cáo Word (`67_Bao_cao.docx`):**
  - [ ] Soạn thảo đầy đủ Mục 2.3 Chương 2: Phân tích kiến trúc POM/COM, chiến lược Role-based Locators và kỹ thuật `page.route()`.
  - [ ] Đính kèm sơ đồ cấu trúc thư mục POM/COM và code mẫu TypeScript minh họa.
  - [ ] Bảng so sánh giữa Locator truyền thống (XPath/CSS) và Role-based Locators.
- [ ] **Review & Bàn Giao:**
  - [ ] Nộp bản thảo Word và Slide cho Trưởng nhóm nghiệm thu đúng hạn.

## Related Notes

- [[Page_Object_Model_and_Component_Architecture]]
- [[Role_Based_Locators_and_Accessibility_Tree]]
- [[Network_Interception_and_Mocking_Mechanics]]
- [[Team_Work_Breakdown_and_Contribution_Matrix_Template]]
