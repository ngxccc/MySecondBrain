---
tags: [type/technique, topic/finance, topic/freelance]
status: sapling
created_at: Friday, January 30th 2026, 9:51:15 am +07:00
updated_at: Friday, January 30th 2026, 9:51:59 am +07:00
aliases: [Hồ chứa nước, Income Smoothing, Lương tự trả]
---

# Income Reservoir Technique (Hồ chứa nước)

## TL;DR

Kỹ thuật "làm phẳng" dòng tiền cho Freelancer/Người có thu nhập biến động bằng cách tạo một lớp đệm trung gian (Hồ chứa), biến dòng tiền bất ổn (AC) thành dòng lương đều đặn (DC) để dễ dàng quản lý theo nguyên tắc 6 chiếc lọ.

---

## Why use it?

_Làm sao chia 6 lọ khi tháng kiếm 50tr, tháng kiếm 0đ?_

- **Problem:**
  - **Volatility:** Thu nhập trồi sụt khiến việc lên kế hoạch chi tiêu (Budgeting) trở nên bất khả thi.
  - **Panic:** Tháng đói kém dễ gây hoảng loạn, phải rút tiền tiết kiệm ăn dần -> Phá vỡ kỷ luật đầu tư.
- **Solution:** Tách biệt **Ngày kiếm tiền** và **Ngày tiêu tiền**. Bạn trở thành "Công ty" thuê chính mình và trả lương cứng cho mình.

## Deep Dive (Cơ chế hoạt động)

1. **The Reservoir (Hồ chứa):** Một tài khoản ngân hàng riêng biệt (chỉ nhận tiền, không dùng chi tiêu).
2. **Input Stream:** Mọi khoản thu nhập (Job lớn, job nhỏ, tiền thưởng) đều đổ thẳng vào Hồ chứa.
3. **Output Valve (Van xả):** Thiết lập lệnh chuyển tiền tự động (Standing Order) vào ngày 01 hoặc 15 hàng tháng.
   - Số tiền chuyển = **Mức lương tự trả (Base Salary)**.
   - Mức lương này dựa trên mức chi tiêu trung bình + một khoản tiết kiệm nhỏ.

### Ví dụ minh họa

- Mức sống cần thiết: 15tr/tháng.
- **Tháng 1:** Kiếm được 50tr -> Đổ vào hồ. Hồ có 50tr. Rút 15tr ra tiêu. (Hồ còn dư 35tr).
- **Tháng 2:** Kiếm được 5tr (Ế ẩm) -> Đổ vào hồ. Hồ có 40tr. Rút 15tr ra tiêu. (Hồ còn dư 25tr).
- **Kết quả:** Đời sống cá nhân vẫn ổn định ở mức 15tr bất chấp thị trường.

---

## Code Snippet / Implementation

Logic điều tiết dòng chảy (Flow Control):

```typescript
// Cấu hình
const MONTHLY_SALARY = 15_000_000; // Lương tự trả
const RESERVOIR_CAPACITY = 100_000_000; // Ngưỡng tràn (6 tháng lương)

function processMonthlyCashflow(currentReservoirBalance: number) {
  // 1. Trả lương cho bản thân (Priority 1)
  if (currentReservoirBalance < MONTHLY_SALARY) {
    console.log(" CẢNH BÁO: Hồ cạn! Cần kích hoạt chế độ Sinh tồn khẩn cấp.");
    return { salary: currentReservoirBalance, bonus: 0 };
  }

  let newBalance = currentReservoirBalance - MONTHLY_SALARY;
  let bonus = 0;

  // 2. Xử lý Tràn hồ (Overflow)
  // Nếu tiền trong hồ quá nhiều (> 6 tháng dự phòng), phần thừa là Thưởng
  if (newBalance > RESERVOIR_CAPACITY) {
    bonus = newBalance - RESERVOIR_CAPACITY;
    newBalance = RESERVOIR_CAPACITY;
    console.log(` Hồ tràn! Thưởng nóng ${bonus} vào quỹ Đầu tư/Hưởng thụ.`);
  }

  return { salary: MONTHLY_SALARY, bonus: bonus, reservoirLeft: newBalance };
}
```

## ️ Edge Cases / Pitfalls

- **Leakage (Rò rỉ):** Tiện tay quẹt thẻ trực tiếp từ tài khoản Hồ chứa để mua sắm.
- _Fix:_ Không làm thẻ cứng cho tài khoản này. Hoặc cất thẻ ở nhà.

- **Over-estimation:** Tự trả lương quá cao so với năng lực kiếm tiền trung bình năm.
- _Hậu quả:_ Hồ cạn sau 3 tháng.

- _Fix:_ Tính trung bình thu nhập 12 tháng gần nhất -> Lấy 80% số đó làm lương cứng.

---

## Connections

- [[My_Investment_Strategy]] (Áp dụng lương tự trả vào chiến lược này)
- [[Opportunity_Cost_Hold]] (Quỹ khẩn cấp là lớp bảo vệ thứ 2 sau Hồ chứa)
