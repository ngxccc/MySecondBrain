---
tags: [type/concept, topic/testing, layer/quality]
date: 2026-06-09
aliases: [Trường hợp kiểm thử, Ca kiểm thử, Test Case Basics]
description: "Khái niệm cơ bản về kịch bản kiểm thử và 3 bước cấu thành cốt lõi."
---

# Test Case

## TL;DR

Test Case (trường hợp kiểm thử) là một tình huống kiểm tra được thiết kế để xác minh xem một đối tượng (chức năng/hệ thống) có thỏa mãn yêu cầu đặt ra hay không. Một test case cơ bản bao gồm 3 bước: **Mô tả** (các điều kiện cần có), **Nhập** (dữ liệu đầu vào), và **Kết quả mong chờ** (kết quả trả về từ đối tượng kiểm tra).

---

## Core Concept

Theo tài liệu đào tạo và slide hướng dẫn, các khái niệm cốt lõi của một Test Case được quy định cụ thể như sau:

### Định nghĩa

**Test Case** là một tình huống kiểm tra, được thiết kế để kiểm tra một đối tượng có thoả mãn yêu cầu đặt ra hay không.

### 3 Bước Cơ Bản

Một test case luôn bao gồm 3 thành phần chính:

1. **Mô tả:** Các điều kiện cần có để tiến hành kiểm tra (ví dụ: trạng thái hệ thống, cấu hình thiết bị, người dùng chưa đăng nhập).
2. **Nhập:** Dữ liệu cần thiết làm đầu vào để kiểm tra (ví dụ: thông tin tài khoản, mật khẩu, file tải lên).
3. **Kết quả mong chờ:** Kết quả trả về từ đối tượng kiểm tra sau khi thực hiện (ví dụ: thông báo lỗi, chuyển trang thành công).

### Phân cấp: Test Scenario → Test Case → Test Step

Mối quan hệ giữa các thành phần trong kịch bản kiểm thử được cấu trúc từ nhỏ đến lớn:

- Test step (Bước kiểm thử): 1 hành động để thực hiện và đáp ứng mong đợi.
- Test case (Trường hợp kiểm thử): Danh sách các _Test step_ kết hợp lại để kiểm tra một tình huống cụ thể.
- Test scenario (Kịch bản kiểm thử): Danh sách các _test case_ và sự phối hợp của chúng để kiểm tra một luồng nghiệp vụ hoàn chỉnh.

```mermaid
graph TD
    TS[Test Scenario - Kịch bản kiểm thử] --> TC1[Test Case 1]
    TS --> TC2[Test Case 2]
    TC1 --> S1[Test Step 1]
    TC1 --> S2[Test Step 2]
```

### Tài liệu đầu vào để thiết kế Test Case

Để viết và thiết kế được các trường hợp kiểm thử chính xác, người kiểm thử cần nghiên cứu các tài liệu và nguồn thông tin đầu vào sau:

- **Test plan (Kế hoạch kiểm thử):** Tài liệu định hướng phạm vi, tài nguyên và chiến lược kiểm thử.
- **Test design (Thiết kế kiểm thử):** Các đặc tả phương pháp và kỹ thuật thiết kế test case.
- **Requirement Specification (Tài liệu đặc tả yêu cầu):** Nguồn thông tin cốt lõi mô tả tính năng hệ thống (SRS, User Story).
- **GUI design (Thiết kế giao diện):** Các bản vẽ mockup, Figma giúp đối chiếu giao diện trực quan.
- **Database design (Thiết kế cơ sở dữ liệu):** Cấu trúc bảng, kiểu dữ liệu phục vụ thiết kế test data.
- **Prototype (Bản mẫu):** Bản thử nghiệm thô giúp hình dung rõ luồng tương tác thực tế.
- **User manual, technical manual (Tài liệu hướng dẫn sử dụng/kỹ thuật):** Tài liệu mô tả cách vận hành và cài đặt hệ thống.
- **Domain knowledge, business experience (Kiến thức nghiệp vụ & Kinh nghiệm):** Hiểu biết sâu về ngành (Tài chính, Y tế...) giúp phát hiện lỗi logic ngoài đặc tả.

---

## Concrete Examples

Dưới đây là bảng ví dụ trực quan về 2 test case cho chức năng Đăng nhập (Login):

| ID        | Tên Test Case                             | Mô tả (Điều kiện)                                  | Nhập (Dữ liệu)                                         | Các bước thực hiện (Test Steps)                                                    | Kết quả mong chờ                                                              |
| :-------- | :---------------------------------------- | :------------------------------------------------- | :----------------------------------------------------- | :--------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| **TC-01** | Đăng nhập thành công với tài khoản hợp lệ | Người dùng đã mở trình duyệt và truy cập trang chủ | - Username: `john.doe`<br>- Password: `SecurePass123!` | 1. Mở trang `/login`.<br>2. Nhập Username và Password.<br>3. Nhấn nút "Đăng nhập". | - Hệ thống đăng nhập thành công.<br>- Điều hướng về trang Dashboard.          |
| **TC-02** | Đăng nhập thất bại do sai mật khẩu        | Người dùng đã mở trình duyệt và truy cập trang chủ | - Username: `john.doe`<br>- Password: `WrongPassword`  | 1. Mở trang `/login`.<br>2. Nhập Username và Password.<br>3. Nhấn nút "Đăng nhập". | - Hiển thị thông báo lỗi màu đỏ: _"Tài khoản hoặc mật khẩu không chính xác"_. |

---

## Related Notes

- [[Error_Defect_Failure]]: Hiểu rõ sự khác biệt giữa lỗi thiết kế, lỗi code và sự cố thực tế khi chạy thử.
- [[7_Principles_of_Testing]]: Các triết lý cốt lõi giúp thiết kế test case hiệu quả và thực tế.
- [[Black_Box_Testing_Techniques]]: Sử dụng phân vùng tương đương và phân tích giá trị biên để tối ưu hóa việc chọn Dữ liệu đầu vào (Test Data).
- [[30_Resources/Concepts/000_Concepts_MOC.md|Concepts MOC]]
