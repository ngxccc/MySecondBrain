---
tags: [type/concept, topic/testing, layer/quality]
status: permanent
date: 2026-08-14
description: Resilience of Role-based Locators based on the Accessibility Tree (AOM) and Playwright Strict Mode mechanics
---

# Role-Based Locators and Accessibility Tree

## TL;DR

Role-based Locator (`getByRole`) là phương pháp định vị phần tử giao diện bền vững nhất trong Playwright bằng cách đọc trực tiếp từ **Accessibility Tree (Cây trợ năng)** của trình duyệt thay vì phụ thuộc vào CSS class hay cấu trúc phân cấp DOM. Kết hợp với cơ chế **Strict Mode** (tự động ném ngoại lệ khi có từ 2 phần tử trùng khớp), Playwright triệt tiêu tận gốc các lỗi gãy test khi Frontend thay đổi giao diện hoặc click nhầm phần tử.

## The Fragility of CSS & XPath (Brittle Selectors)

Trong thực tế, hơn $80\%$ lỗi gãy test giao diện xuất phát từ bộ chọn kém bền vững:

- **CSS Class (`.btn-primary.tw-bg-blue-600`):** Gãy ngay lập tức khi đội ngũ Frontend thay đổi framework CSS (ví dụ: chuyển sang Tailwind, CSS Modules hoặc đổi style).
- **XPath tuyệt đối (`/html/body/div[1]/form/button`):** Gãy $100\%$ khi có bất kỳ sự tái cấu trúc nào trên cây DOM (như bọc thêm một thẻ `<div>` bố cục).

## Accessibility Tree (AOM) Resolution Engine

Song song với cây DOM chuẩn, Browser Engine liên tục tính toán và duy trì một cây phân cấp thứ hai gọi là **Accessibility Tree (Cây trợ năng)** theo chuẩn W3C ARIA:

```text
[Cây DOM thô]                                     [Accessibility Tree (Trợ năng)]
<button class="px-4 py-2 bg-blue">           ──▶  Role: "button"
  <span>Submit Form</span>                         Accessible Name: "Submit Form"
</button>

<div role="button" aria-label="Submit Form"> ──▶  Role: "button"
  <svg>...</svg>                                   Accessible Name: "Submit Form"
</div>
```

Khi gọi `page.getByRole('button', { name: 'Submit Form' })`:

1. **Tra cứu ngữ nghĩa:** Playwright không quan tâm thẻ đó là `<button>` hay `<div role="button">`, class màu gì hay nằm ở tầng `<div>` thứ mấy.
2. **Tính toán Accessible Name:** Trình duyệt tự động trích xuất chuỗi định danh từ nội dung text bên trong, thẻ `<label>` liên kết, hoặc thuộc tính `aria-label`.
3. **Mô phỏng góc nhìn người dùng:** Người dùng nhìn thấy nút bấm và chữ gì thì bộ test tìm đúng nút bấm và chữ đó.

## Strict Mode & Ambiguity Protection

Một lỗ hổng chết người của các công cụ cũ (Selenium, Cypress) là khi một bộ chọn khớp với nhiều phần tử:

```text
[Kịch bản 2 nút bấm trên cùng 1 trang]
1. <button>Submit</button>        (Nút của Form bên dưới)
2. <div class="modal">
     <button>Submit</button>      (Nút của Modal vừa bật lên)
   </div>
```

- **Selenium / Cypress:** Tự động chọn phần tử đầu tiên trong mảng (`elements[0]`). Hậu quả: Script test vô tình click vào nút ẩn của Form bên dưới thay vì Modal $\to$ Sinh ra lỗi ngầm (Silent Failure).
- **Playwright Strict Mode:** Mặc định bật `strict: true`. Nếu một locator khớp từ $\ge 2$ phần tử, Playwright **ném ngoại lệ ngay lập tức**:
  ```text
  Error: strict mode violation: getByRole('button', { name: 'Submit' }) resolved to 2 elements
  ```
  Ép buộc lập trình viên phải scope chính xác ngữ cảnh (ví dụ: `page.locator('.modal').getByRole('button', { name: 'Submit' })`).

## Locator Best Practice Hierarchy (Thứ tự ưu tiên 20/80)

1. **`page.getByRole()` (Ưu tiên số 1):** Bám sát Accessibility Tree và hành vi người dùng thực tế.
2. **`page.getByLabel()`:** Dành cho các trường input form có thẻ `<label>`.
3. **`page.getByText()`:** Dành cho các đoạn văn bản, thông báo không có tính tương tác.
4. **`page.getByTestId()` (`data-testid`):** Dành cho các phần tử có nội dung động hoặc không thể áp dụng Role.
5. **CSS / XPath:** Chỉ dùng khi không còn bất kỳ giải pháp nào khác.

## Related Notes

- [[Playwright_Auto_Waiting_and_Actionability_Checks]]
- [[Browser_Automation_IPC_Fundamentals]]
- [[Project_Roadmap_and_Research_Plan]]
- [[000_Software_Testing_Playwright_MOC]]
