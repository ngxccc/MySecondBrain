---
tags: [type/concept, topic/testing, layer/quality]
status: permanent
date: 2026-08-14
description: Production SDET anti-patterns, flakiness traps, inverted testing pyramid, and architectural best practices in Playwright
---

# Production SDET Anti Patterns and Flaky Test Traps

## TL;DR

$80\%$ sự thất bại và chi phí bảo trì khổng lồ của các dự án kiểm thử tự động trong doanh nghiệp xuất phát từ các thói quen thiết kế sai lầm (Anti-patterns) hơn là từ bản thân công cụ. Việc đảo ngược kim tự tháp kiểm thử (viết quá nhiều UI E2E test thay vì API test), chèn lệnh chờ cứng (`waitForTimeout`), đặt Assertions vào bên trong Page Object Model, hay để các bài test dùng chung dữ liệu trạng thái là những cạm bẫy trực tiếp biến toàn bộ bộ test thành một đống "Flaky Tests" vô dụng trên CI/CD.

## 6 Production SDET Anti-Patterns

```text
┌────────────────────────────────────────────────────────────────────────┐
│             6 CẠM BẪY THIẾT KẾ KIỂM THỬ TRONG DOANH NGHIỆP             │
├────────────────────────────────┬───────────────────────────────────────┤
│ 1. Inverted Ice-Cream Cone     │ Viết 90% UI E2E test; chạy chậm và    │
│    (Đảo ngược kim tự tháp)     │ cực kỳ dễ gãy khi đổi giao diện.      │
├────────────────────────────────┼───────────────────────────────────────┤
│ 2. Hard Sleep waitForTimeout   │ Lãng phí thời gian CI và không triệt  │
│                                │ tiêu được lỗi mạng chậm bất thường.   │
├────────────────────────────────┼───────────────────────────────────────┤
│ 3. Assertions bên trong POM    │ Phá vỡ nguyên lý phân tách trách nhiệm│
│                                │ (Separation of Concerns).             │
├────────────────────────────────┼───────────────────────────────────────┤
│ 4. Brittle Selectors           │ Dùng XPath tuyệt đối hoặc CSS class   │
│                                │ thay vì chuẩn ARIA getByRole.         │
├────────────────────────────────┼───────────────────────────────────────┤
│ 5. UI-Based Login Redundancy   │ Điền form login ở 100 bài test thay vì│
│                                │ nạp storageState qua API.             │
├────────────────────────────────┼───────────────────────────────────────┤
│ 6. Shared State & Dependencies │ Test A tạo dữ liệu cho Test B; gãy    │
│                                │ hàng loạt khi chạy song song.         │
└────────────────────────────────┴───────────────────────────────────────┘
```

---

### Anti-Pattern 1: The Inverted Testing Pyramid (Kem Ốc Quế Đảo Ngược)

- **Sai lầm:** Doanh nghiệp bỏ bê Unit Test và API Integration Test, dồn toàn bộ nguồn lực viết 500 bài test UI E2E qua trình duyệt.
- **Hậu quả:** Bộ test mất 3 tiếng để chạy trên CI, tiêu tốn hàng đống tài nguyên máy chủ, và chỉ cần 1 button đổi màu hoặc lỗi mạng nhẹ là đỏ lòm toàn bộ pipeline.
- **Chuẩn 20/80 (Healthy Test Pyramid):** $70\%$ Unit/API Boundary Tests (chạy trong vài giây) $\to$ $20\%$ Service Integration Tests $\to$ $10\%$ UI E2E Critical Path Tests (chỉ test các luồng sống còn như Đặt vé, Thanh toán).

---

### Anti-Pattern 2: Đặt Assertions bên trong Page Object Model (POM)

- **Sai lầm:** Viết câu lệnh `expect(...)` bên trong các phương thức của Page Object.
- **Lý do vi phạm SRP (Single Responsibility Principle):**
  - **Trách nhiệm của POM:** Đại diện cho trạng thái và hành vi của giao diện (Cung cấp Locators và hàm thao tác như `fillForm()`, `clickSubmit()`).
  - **Trách nhiệm của Test Script:** Chứa kịch bản kiểm thử và đưa ra phán quyết đúng/sai (**Assertions**).
- **Tác hại:** Khi nhét `expect` vào POM, class POM không thể tái sử dụng cho các kịch bản kiểm thử phủ định (Negative Testing - ví dụ: kiểm tra khi nhập sai thì nút bấm bị disabled).

```typescript
// ❌ ANTI-PATTERN: Assertions bị nhồi nhét trong POM
export class LoginPage {
  async submit() {
    await this.submitBtn.click();
    // Sai lầm: Cố định assertion làm mất tính tái sử dụng
    await expect(this.page.getByText("Đăng nhập thành công")).toBeVisible();
  }
}

// ✅ CHUẨN SDET: POM chỉ trả về kết quả hoặc Locator; Test Script thực hiện assert
export class LoginPage {
  async submit() {
    await this.submitBtn.click();
  }
}
// Trong test.spec.ts:
await loginPage.submit();
await expect(page.getByText("Đăng nhập thành công")).toBeVisible();
```

---

### Anti-Pattern 3: Dùng chung Trạng thái Dữ liệu (Shared State Contamination)

- **Sai lầm:** Bài test 1 tạo một suất chiếu phim với ID cố định `sched-123`, Bài test 2 dùng lại chính suất chiếu đó để đặt vé, Bài test 3 kiểm tra hủy vé của suất chiếu đó.
- **Hậu quả:**
  - Nếu Bài test 2 bị lỗi, Bài test 3 chắc chắn bị gãy oan.
  - Khi bật chế độ chạy song song đa luồng (Multi-worker Parallelism), cả 3 bài test cùng nhảy vào sửa đổi dữ liệu `sched-123` cùng một lúc $\to$ Xung đột dữ liệu không thể kiểm soát.
- **Chuẩn SDET:** **100% Test Isolation**. Mỗi bài test sử dụng Dynamic Data Factory (UUID ngẫu nhiên) và dọn dẹp sạch sẽ sau khi hoàn thành thông qua Fixture Teardown (`use()`).

## Related Notes

- [[Page_Object_Model_and_Component_Architecture]]
- [[Playwright_Auto_Waiting_and_Actionability_Checks]]
- [[API_Test_Data_Lifecycle_and_State_Isolation]]
- [[Hybrid_Auth_and_Storage_State_Injection]]
- [[000_Software_Testing_Playwright_MOC]]
