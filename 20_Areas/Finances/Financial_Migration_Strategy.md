---
tags: [type/strategy, topic/finance, topic/personal-development]
status: sapling
created_at: Friday, January 30th 2026, 9:47:49 am +07:00
updated_at: Friday, January 30th 2026, 9:49:47 am +07:00
aliases: [Nâng cấp tài chính, 4 to 6 Jars, Refactoring Finance]
---

# Financial Migration Strategy (4 to 6 Jars)

## TL;DR

Quy trình "Refactoring" hệ thống quản lý tài chính từ phiên bản rút gọn (4 Lọ - Sinh tồn & Tăng trưởng) lên phiên bản tiêu chuẩn (6 Lọ - Tự do & Cân bằng) khi thu nhập cá nhân đạt ngưỡng an toàn.

---

## Why use it?

_Tại sao không dùng 6 lọ ngay từ đầu hoặc dùng 4 lọ mãi mãi?_

- **Problem:**
  - Dùng 6 lọ khi nghèo (Lương 5tr): Chia vụn tiền ra quá nhỏ (5% = 250k) không làm được gì, gây nản.
  - Dùng 4 lọ khi giàu (Lương 50tr): Dễ bị bẫy "Lạm phát lối sống" (Lifestyle Inflation). Nếu vẫn giữ `Living` 60% -> Bro sẽ tiêu 30tr để ăn ở -> Lãng phí nguồn lực lẽ ra nên đầu tư.
- **Solution:** Migration (Chuyển đổi) giúp hệ thống tài chính scale theo thu nhập.
  - **Junior:** Tập trung Up skill (Growth).
  - **Senior:** Tập trung Tích sản (FFA).

## Deep Dive (Cơ chế chuyển đổi)

### 1. The Trigger (Điều kiện kích hoạt)

Không chuyển đổi theo cảm hứng. Chỉ chuyển khi thỏa mãn điều kiện:
$$LivingCost_{basic} \le 55\% \times TotalIncome$$
_(Tức là: Khi chi phí sống cơ bản chỉ còn chiếm khoảng một nửa thu nhập)._

### 2. The Refactoring Steps (Các bước thực hiện)

| Bước             | Hành động                                     | Mục đích                                                  |
| :--------------- | :-------------------------------------------- | :-------------------------------------------------------- |
| **B1. Compress** | Ép `Living` từ 60% xuống 55% (hoặc thấp hơn). | Chống lạm phát lối sống. Giữ mức sống cũ dù lương tăng.   |
| **B2. Decouple** | Tách `Growth` (30%) thành `FFA` + `EDU`.      | Tách bạch dòng tiền "Đầu tư lấy lãi" và "Đầu tư cho não". |
| **B3. Init**     | Khởi tạo lọ `GIVE` (5%).                      | Kích hoạt luật hấp dẫn & Networking.                      |
| **B4. Rename**   | `Goal` -> `LTSS`, `Chill` -> `PLAY`.          | Chuẩn hóa theo tiêu chuẩn quốc tế.                        |

---

## Code Snippet / Implementation

Logic tính toán số tiền phân bổ khi chuyển đổi (Giả sử Lương tăng từ 10tr -> 30tr).

```typescript
// Config tỷ lệ (Allocation Config)
const JUNIOR_CONFIG = { Living: 0.6, Growth: 0.3, Goal: 0.1, Chill: 0.1 }; // Total 1.1?? Ah, Growth cover cả FFA+EDU
// Fix lại Junior: Living 60, Growth 20, Goal 10, Chill 10 (Total 100%)

const SENIOR_CONFIG = {
  NEC: 0.55, // Giảm từ 60%
  FFA: 0.1, // Tách ra từ Growth
  EDU: 0.1, // Tách ra từ Growth
  LTSS: 0.1, // Là Goal cũ
  PLAY: 0.1, // Là Chill cũ
  GIVE: 0.05, // Lấy từ phần dư của NEC (5%)
};

function migrateStrategy(currentIncome: number, basicLivingCost: number) {
  const necRatio = basicLivingCost / currentIncome;

  if (necRatio > 0.55) {
    console.log("️ Chưa đủ điều kiện Migration. Tiếp tục cày cuốc với 4 Lọ.");
    return "STAY_JUNIOR";
  }

  console.log(" Đủ điều kiện! Kích hoạt Pro Mode (6 Lọ).");
  console.log(
    `Dư ra: ${(1 - necRatio) * 100}% thu nhập để ném vào Đầu tư & Hưởng thụ.`,
  );
  return "MIGRATE_TO_SENIOR";
}
```

## ️ Edge Cases / Pitfalls

- **Premature Optimization (Tối ưu sớm):** Lương 7-8 triệu đã vội chia 6 lọ.
- _Hậu quả:_ Mỗi lọ có vài trăm nghìn, không đủ mua gì, quản lý mệt mỏi (Over-engineering).

- **Lifestyle Creep (Sống sang chảnh):** Lương x2 nhưng chuyển sang chung cư cao cấp x2 tiền thuê.
- _Hậu quả:_ `NEC` vẫn chiếm 60-70%. Không bao giờ đạt điều kiện Migration -> Mãi mãi là nô lệ của đồng tiền.

---

## Connections

- [[My_Investment_Strategy]] (Chiến lược tổng thể)

- [[Income_Reservoir_Technique]] (Kỹ thuật bổ trợ nếu thu nhập không ổn định)
