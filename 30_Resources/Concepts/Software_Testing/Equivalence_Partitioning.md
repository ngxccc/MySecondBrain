---
tags: [type/concept, topic/testing, layer/quality]
date: 2026-07-20
aliases:
  [
    Phân vùng tương đương,
    Phân hoạch tương đương,
    Equivalence Partitioning,
    Equivalence Class Partitioning,
    EP Technique,
  ]
description: "Kỹ thuật phân hoạch tương đương chia miền dữ liệu thành các tập rời nhau để tối ưu số lượng test case."
---

# Kỹ thuật Phân hoạch Tương đương

## TL;DR

Phân hoạch tương đương (Equivalence Partitioning - EP) là kỹ thuật kiểm thử hộp đen chia miền dữ liệu đầu vào hoặc đầu ra thành các phân vùng tương đương nhau. Kỹ thuật này dựa trên giả định rằng hệ thống sẽ xử lý mọi giá trị trong cùng một phân vùng theo cùng một cách, giúp giảm thiểu đáng kể số lượng test case cần thiết nhưng vẫn duy trì độ phủ kiểm thử tối ưu.

---

## Core Concept

### 1. Đặt vấn đề & Bản chất Kỹ thuật

Khi thiết kế test case, việc thử nghiệm tất cả các giá trị đầu vào (Exhaustive Testing) là điều **bất khả thi** (Nguyên lý kiểm thử số 2 trong [[7_Principles_of_Testing]]). Nếu một ô nhập liệu nhận số nguyên từ 1 đến 10.000, việc tạo 10.000 test case là vô nghĩa và lãng phí tài nguyên.

Phân hoạch tương đương giải quyết bài toán bùng nổ test case (Combinatorial Explosion) bằng tư duy toán học:

- **Tập hợp đầu vào $S$** được chia thành $n$ tập hợp con (phân vùng) rời nhau $S_1, S_2, ..., S_n$ sao cho:
  $$\bigcup_{i=1}^{n} S_i = S \quad \text{và} \quad S_i \cap S_j = \emptyset \; (\forall i \neq j)$$
- **Tính tương đương hành vi (Equivalent Behaviour):** Nếu một đại diện $x \in S_i$ kích hoạt lỗi (Defect), tất cả các phần tử còn lại trong $S_i$ cũng được kỳ vọng sẽ kích hoạt lỗi đó. Nối tiếp logic này, nếu $x \in S_i$ vượt qua bài kiểm tra (Pass), mọi phần tử khác trong $S_i$ cũng sẽ Pass.

### 2. Phân loại Phân vùng

Theo chuẩn ISTQB CTFL, phân hoạch tương đương áp dụng cho cả đầu vào (Inputs), đầu ra (Outputs), giá trị nội tại (Internal States), thời gian (Time-related values) và các tham số giao diện (Interface Parameters). Mỗi miền được chia làm 2 loại phân vùng:

1. **Phân vùng Hợp lệ (Valid Equivalence Partition):**
   - Chứa các giá trị thuộc phạm vi xử lý mong muốn của spec/requirement.
   - Hệ thống chấp nhận và thực thi logic thành công (Positive Testing).
2. **Phân vùng Không hợp lệ (Invalid Equivalence Partition):**
   - Chứa các giá trị nằm ngoài phạm vi xử lý của spec (sai kiểu dữ liệu, vượt hạn mức, sai định dạng).
   - Hệ thống từ chối hoặc xử lý ngoại lệ thành công (Negative Testing / Error Handling).

### 3. Quy tắc Thiết kế Test Case theo EP

Để áp dụng EP đạt hiệu quả tối đa, tester/engineer thực hiện theo 4 bước:

1. **Nhận diện miền dữ liệu (Identify Data Domain):** Xác định điều kiện đầu vào/đầu ra của đối tượng cần kiểm thử.
2. **Xác định các Phân vùng (Form Partitions):** Đảm bảo phủ hết các phân vùng hợp lệ và không hợp lệ (không để sót giá trị nào của miền $S$).
3. **Chọn Giá trị Đại diện (Select Representatives):** Chọn **đúng 1 giá trị bất kỳ** cho mỗi phân vùng (thường chọn giá trị giữa phân vùng - Mid-point).
4. **Tạo Test Case (Derive Test Cases):**
   - _Quy tắc cho Phân vùng Hợp lệ:_ Một test case có thể kết hợp nhiều phân vùng hợp lệ của các trường dữ liệu khác nhau để giảm số lượng test case.
   - _Quy tắc cho Phân vùng Không hợp lệ:_ **Mỗi phân vùng không hợp lệ MUST có một test case riêng biệt**. Không kết hợp nhiều phân vùng không hợp lệ trong một test case (tránh hiện tượng lỗi trường này che giấu lỗi trường khác - Masking Effect).

### 4. Ưu điểm & Hạn chế

- **Ưu điểm:**
  - Tối ưu hóa số lượng test case rõ rệt, giảm thời gian và chi phí kiểm thử.
  - Áp dụng linh hoạt ở mọi mức kiểm thử: Component Testing, Integration Testing, System Testing, Acceptance Testing.
- **Hạn chế:**
  - **Bỏ sót lỗi tại biên:** Nếu chỉ chọn giá trị giữa phân vùng (Mid-point), các lỗi lập trình phổ biến liên quan đến toán tử so sánh (`>`, `>=`, `<`, `<=`) tại biên ranh giới sẽ bị bỏ qua $\rightarrow$ **Bắt buộc kết hợp với Phân tích Giá trị Biên (Boundary Value Analysis)**.
  - Phụ thuộc vào chất lượng của tài liệu tả yêu cầu (Requirement Specification). Nếu phân vùng sai, test case đại diện sẽ không mang tính bao quát.

---

## Practical Examples

### Ví dụ Thực tế Toàn diện: Hệ thống Đặt mua Vé Sự kiện Online

**Mô tả bài toán:**
Thiết kế bộ test case kiểm thử cho tính năng đăng ký đặt mua vé xem nhạc hội trực tuyến. Form xử lý 3 trường thông tin đầu vào:

1. **Số lượng vé đặt (`ticketQuantity`):** Nhận số nguyên từ **1 đến 10 vé**.
2. **Loại vé / Mã ưu đãi (`ticketType`):** Nhận một trong các chuỗi cố định: `"STANDARD"` (giá chuẩn), `"VIP"` (giá VIP), `"STUDENT"` (giảm 20%). Nhập giá trị khác sẽ bị từ chối.
3. **Độ tuổi người tham dự (`attendeeAge`):** Sự kiện giới hạn độ tuổi tham dự từ **15 đến 65 tuổi** (chấp nhận số nguyên).

---

#### Bước 1: Nhận diện Miền Dữ liệu

Xác định kiểu dữ liệu và ràng buộc nghiệp vụ (Business Rules) của từng trường:

- `ticketQuantity`: Miền số nguyên có khoảng hạn mức (Range condition).
- `ticketType`: Tập hợp các giá trị chuỗi rời rạc (Discrete value set).
- `attendeeAge`: Miền số nguyên có khoảng hạn mức (Range condition).

---

#### Bước 2: Phân hoạch các Phân vùng Tương đương

Chia miền dữ liệu của từng trường thành các **Phân vùng Hợp lệ (Valid Partitions - VP)** và **Phân vùng Không hợp lệ (Invalid Partitions - IP)**:

| Trường dữ liệu       | Phân vùng | Loại phân vùng | Điều kiện / Phạm vi dữ liệu                               |
| :------------------- | :-------- | :------------- | :-------------------------------------------------------- |
| **`ticketQuantity`** | **VP1**   | Hợp lệ         | Số nguyên từ 1 đến 10 ($1 \le Q \le 10$)                  |
|                      | **IP1**   | Không hợp lệ   | Số nguyên nhỏ hơn 1 ($Q < 1$)                             |
|                      | **IP2**   | Không hợp lệ   | Số nguyên lớn hơn 10 ($Q > 10$)                           |
|                      | **IP3**   | Không hợp lệ   | Sai kiểu dữ liệu (số thực, chuỗi chữ, rỗng)               |
| **`ticketType`**     | **VP2**   | Hợp lệ         | Chuỗi `"STANDARD"`                                        |
|                      | **VP3**   | Hợp lệ         | Chuỗi `"VIP"`                                             |
|                      | **VP4**   | Hợp lệ         | Chuỗi `"STUDENT"`                                         |
|                      | **IP4**   | Không hợp lệ   | Chuỗi ngoài danh sách cho phép (ví dụ: `"ECONOMY"`, `""`) |
| **`attendeeAge`**    | **VP5**   | Hợp lệ         | Số nguyên từ 15 đến 65 ($15 \le Age \le 65$)              |
|                      | **IP5**   | Không hợp lệ   | Số nguyên nhỏ hơn 15 ($Age < 15$)                         |
|                      | **IP6**   | Không hợp lệ   | Số nguyên lớn hơn 65 ($Age > 65$)                         |
|                      | **IP7**   | Không hợp lệ   | Sai kiểu dữ liệu (số thực, chuỗi chữ)                     |

---

#### Bước 3: Chọn Giá trị Đại diện

Chọn đúng **1 giá trị đại diện giữa phân vùng (Mid-point)** cho mỗi phân vùng đã xác định:

- `ticketQuantity`: VP1 = `5`, IP1 = `0`, IP2 = `15`, IP3 = `2.5`
- `ticketType`: VP2 = `"STANDARD"`, VP3 = `"VIP"`, VP4 = `"STUDENT"`, IP4 = `"ECONOMY"`
- `attendeeAge`: VP5 = `28`, IP5 = `10`, IP6 = `70`, IP7 = `"twenty"`

---

#### Bước 4: Tạo Bộ Test Case Tối ưu

Áp dụng 2 quy tắc kết hợp phân vùng:

1. **Gộp Phân vùng Hợp lệ:** Tạo các Positive Test Cases bằng cách kết hợp đồng thời các phân vùng hợp lệ của từng trường vào cùng một test case.
2. **Tách riêng Phân vùng Không hợp lệ:** Tạo các Negative Test Cases sao cho **mỗi test case chỉ chứa duy nhất 1 phân vùng không hợp lệ**, các trường còn lại giữ ở giá trị đại diện hợp lệ (tránh hiện tượng che giấu lỗi - Masking Effect).

```typescript
// Mã nguồn minh họa logic xử lý nghiệp vụ phía backend
interface TicketOrder {
  ticketQuantity: number;
  ticketType: string;
  attendeeAge: number;
}

function processTicketOrder(order: TicketOrder): {
  status: string;
  totalPrice?: number;
  error?: string;
} {
  if (
    !Number.isInteger(order.ticketQuantity) ||
    order.ticketQuantity < 1 ||
    order.ticketQuantity > 10
  ) {
    return {
      status: "REJECTED",
      error: "Số lượng vé phải là số nguyên từ 1 đến 10",
    };
  }
  if (!["STANDARD", "VIP", "STUDENT"].includes(order.ticketType)) {
    return { status: "REJECTED", error: "Loại vé không hợp lệ" };
  }
  if (
    typeof order.attendeeAge !== "number" ||
    !Number.isInteger(order.attendeeAge) ||
    order.attendeeAge < 15 ||
    order.attendeeAge > 65
  ) {
    return {
      status: "REJECTED",
      error: "Độ tuổi tham dự phải từ 15 đến 65 tuổi",
    };
  }

  const basePrice = order.ticketType === "VIP" ? 200 : 100;
  const discount = order.ticketType === "STUDENT" ? 0.2 : 0;
  const total = order.ticketQuantity * basePrice * (1 - discount);

  return { status: "APPROVED", totalPrice: total };
}
```

##### Bảng Thiết kế Test Cases Hoàn chỉnh

| ID       | Test name                                | Precondition                                         | Test steps                                                                                                                                | Expected result                                                            |
| :------- | :--------------------------------------- | :--------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------- |
| **TC01** | Đặt vé loại STANDARD hợp lệ              | Form đăng ký vé đã tải xong, người dùng đã đăng nhập | 1. Nhập Số lượng vé = `5` (VP1)<br>2. Chọn Loại vé = `"STANDARD"` (VP2)<br>3. Nhập Độ tuổi = `28` (VP5)<br>4. Nhấn nút "Đặt vé"           | Chấp nhận thanh toán (`APPROVED`), tổng tiền = `500`                       |
| **TC02** | Đặt vé loại VIP hợp lệ                   | Form đăng ký vé đã tải xong, người dùng đã đăng nhập | 1. Nhập Số lượng vé = `5` (VP1)<br>2. Chọn Loại vé = `"VIP"` (VP3)<br>3. Nhập Độ tuổi = `28` (VP5)<br>4. Nhấn nút "Đặt vé"                | Chấp nhận thanh toán (`APPROVED`), tổng tiền = `1000`                      |
| **TC03** | Đặt vé loại STUDENT hợp lệ               | Form đăng ký vé đã tải xong, người dùng đã đăng nhập | 1. Nhập Số lượng vé = `5` (VP1)<br>2. Chọn Loại vé = `"STUDENT"` (VP4)<br>3. Nhập Độ tuổi = `28` (VP5)<br>4. Nhấn nút "Đặt vé"            | Chấp nhận thanh toán (`APPROVED`), tổng tiền = `400` (giảm 20%)            |
| **TC04** | Lỗi số lượng vé nhỏ hơn 1                | Form đăng ký vé đã tải xong, người dùng đã đăng nhập | 1. Nhập Số lượng vé = `0` (**IP1**)<br>2. Chọn Loại vé = `"STANDARD"` (VP2)<br>3. Nhập Độ tuổi = `28` (VP5)<br>4. Nhấn nút "Đặt vé"       | Từ chối (`REJECTED`), báo lỗi: "Số lượng vé phải là số nguyên từ 1 đến 10" |
| **TC05** | Lỗi số lượng vé vượt quá 10              | Form đăng ký vé đã tải xong, người dùng đã đăng nhập | 1. Nhập Số lượng vé = `15` (**IP2**)<br>2. Chọn Loại vé = `"STANDARD"` (VP2)<br>3. Nhập Độ tuổi = `28` (VP5)<br>4. Nhấn nút "Đặt vé"      | Từ chối (`REJECTED`), báo lỗi: "Số lượng vé phải là số nguyên từ 1 đến 10" |
| **TC06** | Lỗi số lượng vé là số thập phân          | Form đăng ký vé đã tải xong, người dùng đã đăng nhập | 1. Nhập Số lượng vé = `2.5` (**IP3**)<br>2. Chọn Loại vé = `"STANDARD"` (VP2)<br>3. Nhập Độ tuổi = `28` (VP5)<br>4. Nhấn nút "Đặt vé"     | Từ chối (`REJECTED`), báo lỗi: "Số lượng vé phải là số nguyên từ 1 đến 10" |
| **TC07** | Lỗi loại vé không tồn tại                | Form đăng ký vé đã tải xong, người dùng đã đăng nhập | 1. Nhập Số lượng vé = `5` (VP1)<br>2. Nhập Loại vé = `"ECONOMY"` (**IP4**)<br>3. Nhập Độ tuổi = `28` (VP5)<br>4. Nhấn nút "Đặt vé"        | Từ chối (`REJECTED`), báo lỗi: "Loại vé không hợp lệ"                      |
| **TC08** | Lỗi độ tuổi người tham dự nhỏ hơn 15     | Form đăng ký vé đã tải xong, người dùng đã đăng nhập | 1. Nhập Số lượng vé = `5` (VP1)<br>2. Chọn Loại vé = `"STANDARD"` (VP2)<br>3. Nhập Độ tuổi = `10` (**IP5**)<br>4. Nhấn nút "Đặt vé"       | Từ chối (`REJECTED`), báo lỗi: "Độ tuổi tham dự phải từ 15 đến 65 tuổi"    |
| **TC09** | Lỗi độ tuổi người tham dự lớn hơn 65     | Form đăng ký vé đã tải xong, người dùng đã đăng nhập | 1. Nhập Số lượng vé = `5` (VP1)<br>2. Chọn Loại vé = `"STANDARD"` (VP2)<br>3. Nhập Độ tuổi = `70` (**IP6**)<br>4. Nhấn nút "Đặt vé"       | Từ chối (`REJECTED`), báo lỗi: "Độ tuổi tham dự phải từ 15 đến 65 tuổi"    |
| **TC10** | Lỗi độ tuổi người tham dự sai kiểu chuỗi | Form đăng ký vé đã tải xong, người dùng đã đăng nhập | 1. Nhập Số lượng vé = `5` (VP1)<br>2. Chọn Loại vé = `"STANDARD"` (VP2)<br>3. Nhập Độ tuổi = `"twenty"` (**IP7**)<br>4. Nhấn nút "Đặt vé" | Từ chối (`REJECTED`), báo lỗi: "Độ tuổi tham dự phải từ 15 đến 65 tuổi"    |

---

## Related Notes

- [[Black_Box_Testing_Techniques]]: Tổng quan về các kỹ thuật kiểm thử hộp đen.
- [[Test_Case]]: Cấu trúc và phương pháp thiết kế một test case tiêu chuẩn.
- [[7_Principles_of_Testing]]: 7 nguyên lý kiểm thử phần mềm nền tảng (Nguyên lý #2: Kiểm thử kiệt xuất là bất khả thi).
- [[Error_Defect_Failure]]: Khái niệm lỗi nhầm lẫn, lỗi sai sót và sự cố phần mềm.
- [[30_Resources/Concepts/000_Concepts_MOC.md|Concepts MOC]]
