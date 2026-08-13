---
tags: [project/viettridao, type/concept]
date: 2026-06-25
aliases:
  - Tài liệu câu hỏi vấn đáp SQL
  - SQL Interview QnA Guide
---

# 🗃️ SQL Interview Questions & Answers (VietTriDao)

## TL;DR

Tài liệu tổng hợp và giải đáp chi tiết 76 câu hỏi vấn đáp về Cơ sở dữ liệu quan hệ (RDBMS) và ngôn ngữ truy vấn SQL (tập trung vào chuẩn MS SQL Server). Tài liệu được nghiên cứu sâu sắc về cơ chế hoạt động dưới công cụ lưu trữ (Storage Engine), cấu trúc vật lý của Data Page, và bộ tối ưu hóa truy vấn (Query Optimizer) để đi thẳng vào bản chất kỹ thuật của từng vấn đề.

---

## 🗂️ Phân Nhóm Hệ Thống Câu Hỏi

### I. Thiết Kế Cơ Sở Dữ Liệu (ERD & Quan Hệ) - Q1 đến Q10

#### Q1. Hãy nêu những thành phần của ERD?

Sơ đồ quan hệ thực thể (Entity-Relationship Diagram - ERD) gồm 3 thành phần chính:

- **Thực thể (Entity):** Một đối tượng danh từ trong thế giới thực cần quản lý dữ liệu (ví dụ: `HocSinh`, `LopHoc`). Biểu diễn bằng **Hình chữ nhật**.
- **Thuộc tính (Attribute):** Các đặc điểm hoặc tính chất của thực thể (ví dụ: `MaHS`, `HoTen`). Biểu diễn bằng **Hình elip**.
- **Mối quan hệ (Relationship):** Sự liên kết logic và ràng buộc giữa các thực thể (ví dụ: học sinh _thuộc_ lớp học). Biểu diễn bằng **Hình thoi**.

#### Q2. Phân biệt và cho ví dụ về quan hệ 1-1, 1-n (1 – nhiều), n-n (nhiều – nhiều)

- **Quan hệ 1-1 (Một - Một):** Một bản ghi ở bảng A chỉ liên kết với tối đa một bản ghi ở bảng B, và ngược lại.
  - _Ví dụ:_ Mỗi `NhanVien` chỉ có một bản ghi `TheCCCD` duy nhất, và một `TheCCCD` chỉ thuộc về một `NhanVien`.
- **Quan hệ 1-n (Một - Nhiều):** Một bản ghi ở bảng A có thể liên kết với nhiều bản ghi ở bảng B, nhưng một bản ghi ở bảng B chỉ liên kết với một bản ghi duy nhất ở bảng A.
  - _Ví dụ:_ Một `LopHoc` có nhiều `HocSinh`, nhưng một `HocSinh` chỉ thuộc về một `LopHoc`.
- **Quan hệ n-n (Nhiều - Nhiều):** Một bản ghi ở bảng A có thể liên kết với nhiều bản ghi ở bảng B, và ngược lại.
  - _Ví dụ:_ Một `HocSinh` có thể đăng ký học nhiều `MonHoc`, và một `MonHoc` có thể được học bởi nhiều `HocSinh`.

#### Q3. Làm sao để biểu diễn quan hệ 1-1 trong cơ sở dữ liệu quan hệ?

- **Cách 1 (Khóa ngoại Unique):** Đặt Khóa ngoại (Foreign Key - FK) ở một trong hai bảng trỏ tới Khóa chính (Primary Key - PK) của bảng còn lại, đồng thời đặt ràng buộc **UNIQUE** cho cột Khóa ngoại đó.
  - _Ví dụ:_ Thêm cột `NhanVienID (FK, UNIQUE)` vào bảng `TheCCCD`.
- **Cách 2 (Chung Khóa chính):** Cấu hình cho hai bảng có chung một Khóa chính (PK của bảng này đồng thời là FK trỏ tới PK của bảng kia).
- **💡 Bản chất kỹ thuật (Deep Dive):** RDBMS thực thi tính toàn vẹn 1-1 bằng cách tự động tạo ra một **Unique Index** trên cột khóa ngoại. Khi có lệnh Insert/Update, hệ thống quét Index này trước (với độ phức tạp $O(\log N)$) để đảm bảo không tồn tại bản ghi trùng khớp nào khác, tránh việc phải quét toàn bộ bảng (Table Scan).

#### Q4. Làm sao để biểu diễn quan hệ 1-n trong cơ sở dữ liệu quan hệ?

- Đặt Khóa ngoại (FK) ở bảng phía "nhiều" (bảng con) trỏ tới Khóa chính (PK) của bảng phía "một" (bảng cha).
- _Ví dụ:_ Thêm cột `LopID (FK)` vào bảng `HocSinh` trỏ tới `LopID (PK)` trong bảng `LopHoc`.
- **💡 Bản chất kỹ thuật (Deep Dive):** Khi khai báo FK ở bảng con, RDBMS sẽ thực hiện kiểm tra tham chiếu (Referential Integrity Check) mỗi khi bảng con có Insert/Update hoặc bảng cha có Delete/Update. Để tối ưu hiệu năng cho phép kiểm tra này, lập trình viên **bắt buộc** phải tạo Index trên cột FK của bảng con. Nếu không, mỗi lần xóa 1 dòng ở bảng cha, RDBMS sẽ phải Table Scan toàn bộ bảng con để kiểm tra xem có bản ghi con nào mồ côi hay không.

#### Q5. Làm sao để biểu diễn quan hệ n-n trong cơ sở dữ liệu quan hệ?

- Tạo một bảng trung gian (Junction Table / Association Table) chứa hai cột Khóa ngoại trỏ đến Khóa chính của hai bảng ban đầu. Hai cột này thường được kết hợp lại để làm Khóa chính phức hợp (Composite PK) của bảng trung gian nhằm đảm bảo không có cặp liên kết nào bị trùng lặp.
- _Ví dụ:_ Bảng trung gian `DangKyHoc(HocSinhID [FK], MonHocID [FK])` với Composite PK là `(HocSinhID, MonHocID)`.

#### Q6. Tại sao phải phân rã quan hệ n-n thành những quan hệ 1-n?

- Các hệ quản trị CSDL quan hệ (RDBMS) không hỗ trợ thiết lập liên kết vật lý nhiều-nhiều trực tiếp giữa hai bảng.
- Việc phân rã giúp tránh trùng lặp dữ liệu (redundancy), ngăn ngừa các dị thường khi thêm/sửa/xóa, và bảo vệ tính toàn vẹn (integrity) bằng cách tuân thủ Dạng chuẩn 1 (1NF) - loại bỏ các thuộc tính đa trị/lặp.
- **💡 Bản chất kỹ thuật (Deep Dive):** Dưới mô hình quan hệ toán học của E.F. Codd, mỗi ô trong bảng chỉ được phép chứa một giá trị nguyên tử (Atomic Value). Nếu giữ nguyên quan hệ n-n, ta sẽ bắt buộc phải lưu danh sách các khóa ngoại (ví dụ một mảng hoặc chuỗi phân tách bởi dấu phẩy `1,2,3`) vào trong một ô dữ liệu. Điều này vi phạm nghiêm trọng tính toàn vẹn của đại số quan hệ, làm tê liệt khả năng tối ưu của bộ tối ưu hóa truy vấn (Query Optimizer) và không thể áp dụng các phép JOIN hiệu quả.

#### Q7. Phân biệt quan hệ 1 ngôi, 2 ngôi, 3 ngôi… Cho ví dụ

- **Quan hệ 1 ngôi (Unary/Recursive):** Mối quan hệ giữa thực thể với chính nó.
  - _Ví dụ:_ Nhân viên quản lý nhân viên (`NhanVienID` liên kết với `NguoiQuanLyID` trong cùng bảng `NhanVien`).
- **Quan hệ 2 ngôi (Binary):** Mối quan hệ giữa hai thực thể khác nhau (loại phổ biến nhất).
  - _Ví dụ:_ `HocSinh` học `LopHoc`.
- **Quan hệ 3 ngôi (Ternary):** Mối quan hệ liên kết đồng thời ba thực thể khác nhau.
  - _Ví dụ:_ `BacSi` kê `DonThuoc` cho `BenhNhan` tại một `PhongKham`.

#### Q8. Thuộc tính đa trị là gì? Cho ví dụ

- Là thuộc tính có thể chứa nhiều hơn một giá trị cho một thực thể đơn lẻ tại cùng một thời điểm.
- _Ví dụ:_ Một người có thể có nhiều số điện thoại (`SoDienThoai` là thuộc tính đa trị).

#### Q9. Thuộc tính phức hợp là gì? Cho ví dụ

- Là thuộc tính có thể chia nhỏ thành các thuộc tính con nhỏ hơn có ý nghĩa độc lập.
- _Ví dụ:_ Thuộc tính `HoTen` có thể chia nhỏ thành `Ho`, `TenDem`, `Ten`.

#### Q10. Khi gặp thuộc tính đa trị, ta phải biểu diễn trong CSDL quan hệ bằng cách nào?

- Phải tách thuộc tính đa trị đó ra thành một bảng phụ độc lập. Bảng phụ này gồm Khóa ngoại (FK) trỏ về bảng gốc và cột chứa giá trị của thuộc tính đa trị đó.
- _Ví dụ:_ Tách thành bảng `NhanVien_DienThoai(NhanVienID [FK], SoDienThoai)`.

---

### II. Chuẩn Hóa & Hệ Quản Trị CSDL (RDBMS) - Q11 đến Q14

#### Q11. Chuẩn hóa dữ liệu để làm gì? Tester có cần phải biết về dạng chuẩn hóa này không?

- **Mục đích:** Giảm thiểu trùng lặp dữ liệu (data redundancy), ngăn ngừa các dị thường dữ liệu (anomalies) khi thêm/sửa/xóa, và bảo vệ tính toàn vẹn của cơ sở dữ liệu.
- **Tester có cần biết không?** **Rất cần thiết.** Tester cần hiểu các dạng chuẩn hóa để thiết kế các kịch bản kiểm thử dữ liệu tích hợp, viết SQL kiểm tra tính chính xác của dữ liệu hiển thị trên giao diện và phát hiện các lỗi logic thiết kế database từ sớm.

#### Q12. Hãy nêu 6 quy tắc (còn gọi là 6 bước) để chuyển ERD thành CSDL Quan hệ

1. **Bước 1:** Tạo bảng cho mỗi thực thể mạnh (Strong Entity), chọn khóa chính cho bảng.
2. **Bước 2:** Tạo bảng cho mỗi thực thể yếu (Weak Entity), thêm khóa chính của thực thể mạnh sở hữu làm khóa ngoại.
3. **Bước 3:** Chuyển quan hệ 1-n: Đặt khóa chính của bảng phía "1" làm khóa ngoại ở bảng phía "n".
4. **Bước 4:** Chuyển quan hệ 1-1: Chọn một trong hai bảng để đặt khóa ngoại trỏ tới bảng kia và gán ràng buộc UNIQUE.
5. **Bước 5:** Chuyển quan hệ n-n: Tạo bảng trung gian chứa khóa ngoại trỏ tới hai bảng gốc, kết hợp chúng làm khóa chính phức hợp.
6. **Bước 6:** Chuyển các thuộc tính đa trị thành bảng phụ riêng; phẳng hóa thuộc tính phức hợp thành các cột riêng lẻ trong cùng bảng.

- **💡 Bản chất kỹ thuật (Deep Dive):** Các bước chuyển đổi này nhằm mục đích tự động đưa CSDL đạt tối thiểu **Dạng chuẩn 3 (3NF)**. Cụ thể: 1NF loại bỏ thuộc tính đa trị; 2NF loại bỏ các phụ thuộc hàm bán phần (Partial Functional Dependencies - thuộc tính phụ thuộc vào một phần của khóa chính phức hợp); và 3NF loại bỏ các phụ thuộc bắc cầu (Transitive Dependencies - thuộc tính phụ thuộc vào một thuộc tính không phải khóa).

#### Q13. File có phải là một loại CSDL hay không? Vì sao?

- **Phải (về mặt định nghĩa rộng):** File (CSV, JSON, XML, TXT) là nơi lưu trữ dữ liệu có cấu trúc.
- **Không phải (về mặt kỹ thuật DBMS):** File đơn thuần không có các tính năng của một Hệ quản trị CSDL chuyên nghiệp (DBMS) như: đảm bảo tính giao dịch (ACID), cơ chế kiểm soát đồng thời (Concurrency Control) để tránh ghi đè dữ liệu, phân quyền bảo mật (Security), tối ưu hóa hiệu năng bằng Index và khả năng mở rộng quy mô.

#### Q14. Phân biệt hệ quản trị CSDL và CSDL. Hãy gọi tên các hệ quản trị CSDL thường dùng hiện nay

- **CSDL (Database):** Là kho lưu trữ vật lý của dữ liệu có tổ chức trên đĩa cứng.
- **Hệ quản trị CSDL (DBMS - Database Management System):** Là phần mềm tương tác trực tiếp với Database để người dùng thực hiện các thao tác định nghĩa, truy vấn, bảo mật và sao lưu dữ liệu.
- **Hệ quản trị CSDL thông dụng:** MS SQL Server, PostgreSQL, MySQL, Oracle DB, SQLite.

---

### III. Cú Pháp Cơ Bản & Kiểu Dữ Liệu - Q15 đến Q22, Q32, Q61, Q62

#### Q15. Hãy nêu những cách insert các dòng dữ liệu vào trong table

- **Cách 1: Thêm dòng đầy đủ giá trị theo thứ tự cột:**

  ```sql
  INSERT INTO HocSinh VALUES ('HS001', 'Nguyen Van A', 'L01');
  ```

- **Cách 2: Thêm dòng chỉ định cột cụ thể (khuyên dùng để tránh lỗi khi cấu trúc bảng thay đổi):**

  ```sql
  INSERT INTO HocSinh (MaHS, TenHS) VALUES ('HS002', 'Tran Thi B');
  ```

- **Cách 3: Thêm nhiều dòng cùng lúc (Bulk Insert):**

  ```sql
  INSERT INTO HocSinh (MaHS, TenHS, MaLop) VALUES
  ('HS003', 'Nguyen Van C', 'L01'),
  ('HS004', 'Le Van D', 'L02');
  ```

- **Cách 4: Thêm dữ liệu từ kết quả truy vấn SELECT:**

  ```sql
  INSERT INTO HocSinh_Backup (MaHS, TenHS)
  SELECT MaHS, TenHS FROM HocSinh WHERE MaLop = 'L01';
  ```

#### Q16. Hãy nêu cú pháp lệnh select, update, delete

- **SELECT:** `SELECT column1, column2 FROM table_name WHERE condition;`
- **UPDATE:** `UPDATE table_name SET column1 = value1, column2 = value2 WHERE condition;`
- **DELETE:** `DELETE FROM table_name WHERE condition;`

#### Q17. Phân biệt giữa sự khác nhau CHAR và VARCHAR

- **CHAR(N):** Kiểu dữ liệu chuỗi ký tự có độ dài cố định. Nếu chuỗi thực tế ngắn hơn N, hệ thống tự động điền thêm khoảng trắng cho đủ N ký tự. Tốc độ truy xuất nhanh hơn do độ dài cố định trong bộ nhớ.
- **VARCHAR(N):** Kiểu dữ liệu chuỗi ký tự có độ dài biến đổi linh hoạt. Chỉ chiếm dung lượng bộ nhớ tương ứng với độ dài thực tế của dữ liệu (cộng thêm 2 bytes lưu thông tin độ dài). Tiết kiệm bộ nhớ hơn.
- **💡 Bản chất kỹ thuật (Deep Dive):** Trong Storage Engine của SQL Server, mỗi bản ghi (Row) được lưu trữ dưới dạng một chuỗi byte liên tục trong Data Page (kích thước 8KB).
  - Cột kiểu **CHAR** được lưu trữ ở phần **Fixed-Length Data Section** của dòng. Hệ thống luôn cấp phát đúng số byte cố định, giúp việc tìm offset của các cột phía sau cực nhanh.
  - Cột kiểu **VARCHAR** được đưa vào phần **Variable-Length Data Section** ở cuối dòng. SQL Server phải duy trì một mảng offset (Variable-Length Column Offset Array) tại dòng đó để định vị xem dữ liệu VARCHAR bắt đầu và kết thúc ở byte thứ mấy. Việc đọc VARCHAR tốn thêm chi phí CPU để tính toán offset và phân tách chuỗi.

#### Q18. Khi nào ta tạo column có dữ liệu kiểu CHAR?

- Khi dữ liệu của cột đó luôn có độ dài cố định và nhất quán trên mọi dòng (ví dụ: mã quốc gia viết tắt `VN`, `US`; giới tính `M`/`F`; mã định danh cố định số lượng ký tự như mã số thuế, mã định danh nội bộ).

#### Q19. Khi nào ta tạo column có dữ liệu kiểu VARCHAR?

- Khi độ dài của dữ liệu thay đổi linh hoạt và không đồng đều giữa các dòng (ví dụ: họ tên, địa chỉ email, mô tả chi tiết, nội dung phản hồi).

#### Q20. Phân biệt giữa NULL và rỗng?

- **NULL:** Đại diện cho trạng thái vắng mặt của dữ liệu (chưa xác định, chưa biết hoặc không tồn tại). Phép so sánh bắt buộc dùng toán tử `IS NULL` hoặc `IS NOT NULL`.
- **Rỗng (Empty string `''`):** Là một chuỗi ký tự hợp lệ có độ dài bằng 0. Giá trị này đã được xác định rõ ràng. Phép so sánh dùng toán tử `= ''`.
- **💡 Bản chất kỹ thuật (Deep Dive):**
  - **Rỗng `''`** thực tế vẫn là một giá trị chuỗi, SQL Server sẽ lưu trữ độ dài của nó là 0 byte ở phần Variable-Length Data.
  - **NULL** không tốn không gian lưu trữ dữ liệu thông thường. Thay vào đó, mỗi dòng trong SQL Server có một cấu trúc gọi là **Null Bitmap** nằm ở phần Header của dòng. Null Bitmap sử dụng 1 bit cho mỗi cột trong bảng để đánh dấu cột đó có mang giá trị NULL hay không (1 = NULL, 0 = Not NULL). Do đó, việc kiểm tra NULL diễn ra cực nhanh ở mức bit ngay khi RDBMS đọc dòng từ đĩa vào RAM.

#### Q21. 1 cột được khai là kiểu varchar thì có thể nhận được giá trị là rỗng không? Vì sao?

- **Có.** Vì chuỗi rỗng `''` là một chuỗi ký tự hợp lệ có độ dài bằng 0, hoàn toàn phù hợp với định nghĩa và cách lưu trữ của kiểu dữ liệu chuỗi ký tự biến đổi VARCHAR.

#### Q22. 1 cột được khai là kiểu char thì có thể nhận được giá trị là rỗng không? Vì sao?

- **Có, nhưng có cơ chế tự điền.** Cột kiểu CHAR vẫn chấp nhận giá trị rỗng `''`. Tuy nhiên, vì đặc trưng độ dài cố định của CHAR, RDBMS sẽ tự động điền thêm khoảng trắng vào cột đó cho đủ kích thước đã khai báo. (Ví dụ: cột `CHAR(4)` nhận `''` sẽ thực tế lưu trữ 4 khoảng trắng `'    '`).

#### Q32. NCHAR, NVARCHAR khác CHAR, VARCHAR chỗ nào?

- **NCHAR / NVARCHAR:** Lưu trữ chuỗi ký tự theo chuẩn Unicode (mỗi ký tự chiếm 2 bytes bộ nhớ, sử dụng mã hóa UCS-2 hoặc UTF-16). Thích hợp lưu trữ các ngôn ngữ có dấu hoặc ký tự đặc biệt (tiếng Việt, tiếng Nhật, tiếng Trung). Khi viết câu lệnh SQL cần có tiền tố `N` phía trước chuỗi (ví dụ: `N'Nguyễn Văn A'`).
- **CHAR / VARCHAR:** Lưu trữ chuỗi ký tự Non-Unicode (mỗi ký tự chiếm 1 byte bộ nhớ, sử dụng các mã hóa ANSI/ASCII hoặc code page của từng quốc gia). Lưu tiếng Việt có dấu sẽ bị lỗi font (biến thành dấu hỏi chấm `?` hoặc ký tự lạ).

#### Q61. Phân biệt kiểu dữ liệu DATE, DATETIME và TIME trong SQL Server

- **DATE:** Chỉ lưu ngày (năm-tháng-ngày), định dạng `YYYY-MM-DD`. Không có phần giờ. Chiếm 3 bytes.
- **TIME:** Chỉ lưu giờ (giờ:phút:giây.mili_giây), định dạng `HH:MM:SS.nnnnnnn`. Không có phần ngày. Chiếm 3-5 bytes.
- **DATETIME:** Lưu trữ cả ngày và giờ, định dạng `YYYY-MM-DD HH:MM:SS.333`. Chiếm 8 bytes.

#### Q62. Phân biệt kiểu dữ liệu VARCHAR và VARCHAR2

- **VARCHAR:** Là kiểu dữ liệu chuỗi ký tự độ dài biến đổi chuẩn được hỗ trợ bởi nhiều hệ RDBMS (bao gồm cả SQL Server).
- **VARCHAR2:** Là kiểu dữ liệu chuỗi ký tự biến đổi đặc thù riêng của hệ quản trị CSDL **Oracle**, được tối ưu hơn về mặt hiệu năng và cách xử lý chuỗi rỗng (trong Oracle, chuỗi rỗng `''` được đối xử như `NULL`, trong khi ở SQL Server chúng khác biệt).

---

### IV. Ràng Buộc Toàn Vẹn & Khóa - Q23 đến Q29

#### Q23. Khóa chính của bảng là gì? Khóa ngoại của bảng là gì?

- **Khóa chính (Primary Key - PK):** Cột hoặc nhóm cột dùng để định danh duy nhất cho mỗi dòng trong bảng. Giá trị khóa chính phải duy nhất và không được NULL.
- **Khóa ngoại (Foreign Key - FK):** Cột hoặc nhóm cột trong bảng này trỏ tới Khóa chính của bảng khác để thiết lập và duy trì mối quan hệ ràng buộc giữa hai bảng đó.

#### Q24. Trong một bảng có tối thiểu và tối đa bao nhiêu khóa chính?

- **Tối thiểu:** 0 (một số bảng phụ/bảng log không bắt buộc phải khai báo khóa chính).
- **Tối đa:** 1 khóa chính duy nhất (nhưng có thể được cấu thành từ nhiều cột, gọi là Khóa chính phức hợp - Composite PK).

#### Q25. Trong một bảng có tối thiểu và tối đa bao nhiêu khóa ngoại?

- **Tối thiểu:** 0.
- **Tối đa:** Không giới hạn cứng về mặt lý thuyết (phụ thuộc vào cấu hình hệ thống RDBMS, ví dụ SQL Server hỗ trợ tối đa 253 khóa ngoại trên một bảng).

#### Q26. Khi nhập dữ liệu cho toàn bộ 1 database, ta phải nhập dữ liệu cho bảng nào trước, bảng nào sau? Vì sao? Cho ví dụ

- **Quy tắc:** Phải nhập dữ liệu cho các **bảng cha trước** (bảng độc lập, không chứa khóa ngoại), sau đó mới nhập dữ liệu cho các **bảng con sau** (bảng phụ thuộc, chứa khóa ngoại trỏ về bảng cha).
- **Vì sao:** Nếu nhập bảng con trước, các giá trị khóa ngoại sẽ tham chiếu đến một giá trị không tồn tại ở bảng cha, hệ thống sẽ báo lỗi vi phạm ràng buộc khóa ngoại (Foreign Key Constraint).
- _Ví dụ:_ Ta có bảng `KHOA(MaKhoa, TenKhoa)` và `LOP(MaLop, TenLop, MaKhoa)`. Ta phải nhập danh sách khoa vào bảng `KHOA` trước (ví dụ mã `CNTT`). Sau đó khi nhập lớp học vào bảng `LOP`, cột `MaKhoa` mới có giá trị `CNTT` hợp lệ để tham chiếu.

#### Q27. Khi xóa 1 dòng trong bảng HOCSINH, mà học sinh đó đã có giao dịch với bảng KETQUAHOCTAP rồi, thì ta gặp lỗi không cho xóa HOCSINH đó. Vì sao? Cách giải quyết là gì?

- **Vì sao:** Do ràng buộc toàn vẹn tham chiếu (Referential Integrity Constraint). Khóa chính `MaHS` ở bảng `HOCSINH` đang được cột khóa ngoại ở bảng `KETQUAHOCTAP` tham chiếu đến. Nếu xóa học sinh này trực tiếp, các bản ghi kết quả học tập liên quan sẽ bị mồ côi (trỏ vào bản ghi không tồn tại), gây mất tính toàn vẹn dữ liệu.
- **💡 Bản chất kỹ thuật (Deep Dive):** Khi bạn thực hiện lệnh DELETE trên bảng cha, SQL Server không thể chỉ xóa dòng đó rồi bỏ qua. Hệ thống phải kích hoạt một lệnh kiểm tra ngầm (internal query) quét bảng con `KETQUAHOCTAP`.
  - RDBMS sẽ xin một khóa **Shared Lock (S)** trên dòng ở bảng cha để đảm bảo dòng đó không bị thay đổi bởi tiến trình khác trong lúc kiểm tra.
  - Tiếp tục quét cột FK ở bảng con. Nếu phát hiện bất kỳ dòng con nào có giá trị trùng khớp, giao dịch ngay lập tức bị huỷ bỏ (Rollback) để bảo vệ dữ liệu.
- **Cách giải quyết:**
  - _Cách 1:_ Xóa thủ công toàn bộ các bản ghi điểm của học sinh đó trong bảng `KETQUAHOCTAP` trước, rồi mới xóa bản ghi học sinh trong bảng `HOCSINH`.
  - _Cách 2:_ Cấu hình thuộc tính Khóa ngoại với tùy chọn `ON DELETE CASCADE`. Khi xóa học sinh, hệ thống tự động xóa sạch các bản ghi điểm liên quan ở bảng điểm.
  - _Cách 3:_ Cấu hình `ON DELETE SET NULL` (nếu cột khóa ngoại ở bảng điểm cho phép nhận giá trị NULL).

#### Q28. Khi xóa 1 bảng mà khóa chính của bảng này là khóa ngoại của bảng khác, ta phải làm thế nào?

- Hệ thống sẽ chặn lệnh xóa bảng (`DROP TABLE`) do vi phạm ràng buộc tham chiếu.
- **Cách xử lý:** Ta phải drop ràng buộc khóa ngoại (Foreign Key Constraint) ở bảng con trước bằng lệnh `ALTER TABLE BảngCon DROP CONSTRAINT TênFK`, hoặc drop hoàn toàn bảng con trước, sau đó mới tiến hành drop bảng cha.

#### Q29. Khi xóa 1 bảng mà trong bảng đó có 1 hoặc nhiều khóa ngoại (tức là có các bảng khác tham chiếu đến bảng này), thì ta phải làm thế nào?

- Không cần làm gì đặc biệt. Ta hoàn toàn có thể xóa bảng con chứa khóa ngoại trực tiếp, vì việc xóa bảng con không gây ảnh hưởng hay vi phạm tính toàn vẹn dữ liệu ở các bảng cha.

---

### V. Lệnh Xóa Dữ Liệu & Thao Tác Bảng - Q30, Q34

#### Q30. Phân biệt giữa việc xóa dữ liệu của bảng bằng DELETE và TRUNCATE

| Đặc trưng           | DELETE                                | TRUNCATE                                                                               |
| :------------------ | :------------------------------------ | :------------------------------------------------------------------------------------- |
| **Loại lệnh**       | DML (Data Manipulation Language)      | DDL (Data Definition Language)                                                         |
| **Sử dụng WHERE**   | Được phép dùng để lọc dòng cần xóa    | Không được phép (luôn xóa sạch bảng)                                                   |
| **Cơ chế ghi Log**  | Ghi log chi tiết cho từng dòng bị xóa | Chỉ ghi log việc giải phóng trang dữ liệu (Page Deallocation)                          |
| **Tốc độ thực thi** | Chậm hơn đối với bảng lớn             | Cực kỳ nhanh                                                                           |
| **Reset Identity**  | Không reset cột tự tăng               | Reset cột tự tăng (cột Identity) về ban đầu                                            |
| **Thu hồi bộ nhớ**  | Giữ nguyên dung lượng được cấp phát   | Giải phóng và thu hồi không gian đĩa                                                   |
| **Triggers**        | Kích hoạt các trigger `ON DELETE`     | **Không** kích hoạt trigger                                                            |
| **Ràng buộc ngoại** | Cho phép xóa nếu thỏa mãn ràng buộc   | Bị chặn hoàn toàn nếu bảng bị bảng khác tham chiếu (dù bảng con rỗng)                  |
| **Rollback**        | Hỗ trợ Rollback bình thường           | **Hỗ trợ Rollback bình thường** nếu chạy trong Transaction (`BEGIN TRAN ... ROLLBACK`) |

- **💡 Bản chất kỹ thuật (Deep Dive):**
  - **DELETE** quét qua từng dòng (Row-by-row) trong Data Page. Đối với mỗi dòng, nó chèn bản ghi vào Transaction Log chi tiết toàn bộ nội dung dòng đó (để có thể khôi phục) và đánh dấu bản ghi đó là "Deleted" (hay tombstone) trên Data Page nhưng **không thu hồi ngay bộ nhớ** (bộ nhớ chỉ được dọn dẹp sau bởi quá trình Ghost Cleanup ngầm).
  - **TRUNCATE** là lệnh DDL. Nó không đọc dữ liệu của dòng nào cả. Hệ thống chỉ tìm đến B-Tree của bảng đó trong System Catalogs và ngắt liên kết (Deallocate) các Data Page thuộc về bảng đó, trả các trang này về hệ điều hành / Pool lưu trữ. Log chỉ ghi nhận việc thu hồi trang (Extent/Page Deallocations), do đó lượng ghi Log cực ít, giải phóng hàng triệu dòng chỉ trong phần nghìn giây.

#### Q34. DROP TABLE khác TRUNCATE và DELETE chỗ nào?

- **DELETE:** Chỉ xóa dữ liệu các dòng bên trong bảng (có thể lọc qua `WHERE`). Cấu trúc bảng, các ràng buộc (Constraint) và chỉ mục (Index) vẫn giữ nguyên.
- **TRUNCATE:** Xóa sạch toàn bộ dữ liệu dòng trong bảng ngay lập tức bằng cách giải phóng không gian nhớ. Giữ nguyên cấu trúc bảng và ràng buộc.
- **DROP TABLE:** Xóa hoàn toàn bảng khỏi cơ sở dữ liệu bao gồm cả cấu trúc định nghĩa, toàn bộ dữ liệu, các ràng buộc liên quan và các chỉ mục (bảng biến mất hoàn toàn).

---

### VI. Sắp Xếp & Gom Nhóm - Q33, Q35 đến Q40, Q48 đến Q51, Q66

#### Q33. HAVING giống và khác WHERE những điểm nào?

- **Giống nhau:** Đều dùng làm bộ lọc điều kiện cho câu lệnh truy vấn dữ liệu.
- **Khác nhau:**
  - `WHERE` áp dụng điều kiện lọc trên từng dòng dữ liệu thô _trước_ khi gom nhóm (`GROUP BY`). Không được phép chứa các hàm gộp (`COUNT`, `SUM`, `AVG`, `MAX`, `MIN`).
  - `HAVING` áp dụng lọc trên các nhóm dữ liệu _sau_ khi đã được gom nhóm bởi `GROUP BY`. Thường đi kèm với `GROUP BY` và bắt buộc dùng các hàm gộp để lọc nhóm.

#### Q35. ORDER BY dùng làm gì? Cho ví dụ

- **Mục đích:** Dùng để sắp xếp tập kết quả trả về của câu truy vấn theo thứ tự tăng dần hoặc giảm dần của một hoặc nhiều cột.
- **Ví dụ:** Sắp xếp danh sách học sinh theo điểm trung bình từ cao đến thấp:

  ```sql
  SELECT * FROM HOCSINH ORDER BY DiemTB DESC;
  ```

#### Q36. Phân biệt từ khóa ASC và DESC. Mặc định khi ORDER BY thì là ASC hay DESC?

- **ASC (Ascending):** Sắp xếp theo thứ tự tăng dần (nhỏ đến lớn, A $\rightarrow$ Z).
- **DESC (Descending):** Sắp xếp theo thứ tự giảm dần (lớn đến nhỏ, Z $\rightarrow$ A).
- **Mặc định:** Khi không ghi rõ từ khóa, SQL Server mặc định sắp xếp theo **ASC**.

#### Q37. GROUP BY dùng làm gì?

- Dùng để nhóm các dòng dữ liệu có cùng giá trị trong các cột được chỉ định lại với nhau, thường kết hợp với các hàm gộp (`SUM`, `COUNT`, `AVG`, `MAX`, `MIN`) để thực hiện các thống kê dữ liệu trên từng nhóm đó.

#### Q38. Vì sao nói các cột trong mệnh đề ORDER BY có độ ưu tiên, còn các cột trong mệnh đề GROUP BY thì không có độ ưu tiên?

- **Trong ORDER BY:** Thứ tự viết các cột mang tính quyết định độ ưu tiên sắp xếp (từ trái qua phải). Ví dụ `ORDER BY colA, colB` sẽ sắp xếp theo `colA` trước, nếu trùng giá trị `colA` thì mới xét tiếp sắp xếp theo `colB`.
- **Trong GROUP BY:** Thứ tự viết các cột không ảnh hưởng tới kết quả gom nhóm cuối cùng. RDBMS sẽ gom nhóm dựa trên sự kết hợp các giá trị độc nhất của tất cả các cột khai báo trong `GROUP BY` cùng lúc. Do đó không tồn tại khái niệm thứ tự ưu tiên gom nhóm.
- **💡 Bản chất kỹ thuật (Deep Dive):**
  - Công cụ sắp xếp của RDBMS (Sort Operator) hoạt động theo giải thuật sắp xếp dựa trên khóa so sánh tuần tự. Cột viết trước được lấy làm khóa so sánh chính (Primary Sort Key), cột viết sau làm khóa so sánh phụ (Secondary Sort Key). Do đó thứ tự cột ảnh hưởng trực tiếp đến kết quả sắp xếp.
  - Phép gom nhóm (`GROUP BY`) trong cơ chế thực thi của SQL Server được dịch thành các toán tử **Stream Aggregate** hoặc **Hash Aggregate**. RDBMS xây dựng một bảng băm (Hash Table) hoặc sắp xếp luồng dữ liệu để nhóm các giá trị trùng khớp của cặp tổ hợp `(colA, colB)`. Vì bản chất của tập hợp băm là kiểm tra tính duy nhất của tổ hợp toàn bộ khóa, thứ tự của các cột thành phần trong khóa băm hoàn toàn không làm thay đổi cách phân chia nhóm dữ liệu.

#### Q39. ORDER BY hoten, gioitinh sẽ khác ORDER BY gioitinh, hoten ở chỗ nào?

- `ORDER BY hoten, gioitinh`: Sắp xếp danh sách theo bảng chữ cái của `hoten` trước. Đối với những người trùng tên nhau, họ sẽ được sắp xếp tiếp theo `gioitinh`.
- `ORDER BY gioitinh, hoten`: Gom nhóm hiển thị toàn bộ người có cùng giới tính lại với nhau trước (ví dụ: Nữ hiển thị trước, Nam hiển thị sau). Trong mỗi nhóm giới tính đó, danh sách tiếp tục được sắp xếp theo `hoten` từ A đến Z.

#### Q40. GROUP BY hoten, gioitinh sẽ khác GROUP BY gioitinh, hoten ở chỗ nào?

- **Không khác biệt về kết quả dữ liệu.** Cả hai câu lệnh đều tạo ra các nhóm thống kê dựa trên các giá trị duy nhất của cặp `(hoten, gioitinh)`. Thứ tự hiển thị mặc định của các dòng có thể thay đổi nhẹ tùy theo công cụ tối ưu hóa truy vấn của RDBMS, nhưng về bản chất phân nhóm là hoàn toàn trùng khớp.

#### Q48. Vì sao không được SELECT các cột không có trong GROUP BY? Vì sao nếu các cột đó nằm trong các hàm GỘP thì lại không bị lỗi?

- **Vì sao bị lỗi:** Khi dùng `GROUP BY`, nhiều dòng dữ liệu thô sẽ bị nén lại thành một dòng duy nhất đại diện cho nhóm. Nếu select một cột không nằm trong `GROUP BY` và không dùng hàm gộp, RDBMS sẽ không xác định được phải lấy giá trị ở dòng thô nào trong số các dòng thuộc nhóm để hiển thị, dẫn đến lỗi bất định.
- **Vì sao nằm trong hàm gộp không bị lỗi:** Hàm gộp (như `SUM`, `MAX`) tính toán ra một giá trị duy nhất đại diện cho toàn bộ các dòng trong nhóm, đảm bảo tính nhất quán của dữ liệu đầu ra nên không bị lỗi.

#### Q49. Vì sao không cần thiết phải SELECT các cột có trong mệnh đề GROUP BY?

- Việc select cột nào hiển thị ra kết quả cuối cùng là quyền quyết định của lập trình viên. RDBMS chỉ yêu cầu các cột xuất hiện ở `SELECT` phải tuân thủ quy tắc nhóm, chứ không bắt buộc phải hiển thị tất cả các cột đã dùng làm tiêu chí gom nhóm trong `GROUP BY`.

#### Q50. Vì sao trong WHERE không được chứa hàm GỘP mà trong HAVING lại chứa được?

- **Giải thích dựa trên Thứ tự thực thi logic (Logical Query Processing Order):**
  1. `FROM` (Xác định nguồn bảng)
  2. `ON` (Bộ lọc nối bảng)
  3. `JOIN` (Nối các bảng)
  4. `WHERE` (Lọc các dòng thô trước khi gom nhóm, nên chưa thể tính toán hàm gộp)
  5. `GROUP BY` (Gom nhóm dữ liệu)
  6. `HAVING` (Lọc các nhóm dữ liệu sau khi gom nhóm, lúc này hàm gộp đã được tính toán xong)
  7. `SELECT` (Trả về các cột cần lấy)
  8. `DISTINCT`
  9. `ORDER BY`

#### Q51. Nếu có 1 câu SELECT không có GROUP BY, nhưng trong mệnh đề SELECT vẫn có 1 hàm gộp thì câu SELECT đó lại không bị lỗi. Vì sao?

- Khi câu lệnh SELECT chỉ chứa các hàm gộp mà không đi kèm với bất kỳ cột thô nào khác (ví dụ: `SELECT COUNT(*), AVG(Diem) FROM HOCSINH`), RDBMS sẽ tự động coi toàn bộ bảng dữ liệu là một nhóm duy nhất. Kết quả trả về là một dòng thống kê duy nhất cho cả bảng nên hoàn toàn không bị lỗi bất định.

#### Q66. Nêu sự giống nhau và khác nhau giữa DISTINCT và GROUP BY

- **Giống nhau:** Đều có khả năng loại bỏ các dòng trùng lặp để thu được tập hợp các giá trị duy nhất.
- **Khác nhau:**
  - `DISTINCT` áp dụng bộ lọc trùng trên toàn bộ các cột được hiển thị ở kết quả cuối cùng của SELECT.
  - `GROUP BY` gom nhóm dữ liệu phục vụ cho các phép toán thống kê và cho phép sử dụng các hàm gộp, lọc nhóm bằng `HAVING`.

---

### VII. Phép Nối & Tập Hợp - Q31, Q44 đến Q47, Q52 đến Q54, Q63 đến Q65, Q67, Q68, Q75, Q76

#### Q31. Phân biệt giữa INNER JOIN và OUTER JOIN

- **INNER JOIN:** Chỉ trả về những dòng dữ liệu có giá trị trùng khớp ở cả hai bảng dựa trên điều kiện nối. Các dòng không khớp ở cả hai bảng đều bị loại bỏ.
- **OUTER JOIN:** Trả về các dòng trùng khớp, đồng thời giữ lại các dòng không khớp ở bảng bên trái (`LEFT JOIN`), bên phải (`RIGHT JOIN`) hoặc cả hai bảng (`FULL JOIN`), điền giá trị `NULL` vào các cột của bảng không có dữ liệu khớp tương ứng.

#### Q44. Bản chất của phép nối JOINS là nối những gì?

- Bản chất là thực hiện tích Descartes (Cross Join) giữa hai bảng để tạo ra tất cả các tổ hợp cặp dòng có thể có, sau đó áp dụng biểu thức logic trong mệnh đề điều kiện `ON` để lọc và giữ lại các hàng thỏa mãn điều kiện nối.

#### Q45. Có bắt buộc phải nối JOINS bằng cách sử dụng 2 khóa ở 2 bảng hay không?

- **Không bắt buộc.** Điều kiện trong `ON` có thể là bất kỳ biểu thức so sánh nào (như `>`, `<`, `<>`). Tuy nhiên, trong thực tế phát triển phần mềm, người ta luôn thực hiện JOIN thông qua Khóa chính và Khóa ngoại để đảm bảo tính toàn vẹn nghiệp vụ và tối ưu hóa hiệu năng truy vấn thông qua Index.

#### Q46. Phân biệt LEFT, RIGHT và FULL JOIN

- **LEFT JOIN (LEFT OUTER JOIN):** Giữ lại toàn bộ các dòng của bảng bên trái, ghép nối với dữ liệu bảng bên phải nếu khớp. Nếu không khớp, các cột của bảng phải hiển thị `NULL`.
- **RIGHT JOIN (RIGHT OUTER JOIN):** Ngược lại, giữ lại toàn bộ các dòng của bảng bên phải, ghép nối với dữ liệu bảng bên trái nếu khớp. Nếu không khớp, các cột của bảng trái hiển thị `NULL`.
- **FULL JOIN (FULL OUTER JOIN):** Giữ lại toàn bộ các dòng của cả hai bảng. Bản ghi của bên nào không có dữ liệu khớp ở bên kia sẽ hiển thị các cột tương ứng là `NULL`.

#### Q47. Cho ví dụ để thấy sự khác nhau giữa INNER JOIN và LEFT JOIN

Giả sử có bảng `LOP` (gồm lớp L1, L2, và lớp L3 mới lập chưa có học sinh) và bảng `HOCSINH` (gồm học sinh A thuộc lớp L1, học sinh B thuộc lớp L2).

- **INNER JOIN:**

  ```sql
  SELECT LOP.TenLop, HOCSINH.TenHS FROM LOP INNER JOIN HOCSINH ON LOP.MaLop = HOCSINH.MaLop;
  ```

  _Kết quả:_ Chỉ hiển thị 2 dòng của lớp L1 và L2 (lớp L3 bị loại vì không có học sinh nào khớp).

- **LEFT JOIN (lấy LOP làm bảng bên trái):**

  ```sql
  SELECT LOP.TenLop, HOCSINH.TenHS FROM LOP LEFT JOIN HOCSINH ON LOP.MaLop = HOCSINH.MaLop;
  ```

  _Kết quả:_ Hiển thị 3 dòng: Lớp L1 (học sinh A), Lớp L2 (học sinh B), và Lớp L3 (học sinh tương ứng là `NULL`).

#### Q52. Phân biệt UNION và UNION ALL

- **UNION:** Gộp kết quả của các câu truy vấn thành một tập kết quả duy nhất, đồng thời tự động thực hiện loại bỏ các dòng dữ liệu trùng lặp (chạy chậm hơn do tốn tài nguyên lọc trùng).
- **UNION ALL:** Gộp toàn bộ kết quả của các câu truy vấn lại, giữ nguyên tất cả các dòng trùng lặp nếu có (chạy rất nhanh vì chỉ ghép dòng vật lý).

#### Q53. Hãy cho ví dụ về cách sử dụng INTERSECT

Phép toán `INTERSECT` dùng để lấy ra những dòng xuất hiện đồng thời trong cả hai tập kết quả truy vấn.

- _Ví dụ:_ Tìm mã học sinh vừa tham gia câu lạc bộ bóng đá, vừa tham gia câu lạc bộ bóng rổ:

  ```sql
  SELECT MaHS FROM CLB_BongDa
  INTERSECT
  SELECT MaHS FROM CLB_BongRo;
  ```

#### Q54. Hãy cho ví dụ về cách sử dụng EXCEPT

Phép toán `EXCEPT` dùng để lấy ra các dòng chỉ xuất hiện ở tập kết quả của câu truy vấn thứ nhất mà không có trong tập kết quả của câu truy vấn thứ hai.

- _Ví dụ:_ Tìm danh sách học sinh đã đóng học phí đợt 1 nhưng chưa đóng học phí đợt 2:

  ```sql
  SELECT MaHS FROM DongHocPhi_Dot1
  EXCEPT
  SELECT MaHS FROM DongHocPhi_Dot2;
  ```

#### Q63. Phân biệt cách sử dụng giữa UNION và JOIN

- **JOIN:** Kết hợp các cột dữ liệu từ hai bảng khác nhau theo chiều ngang dựa trên một mối quan hệ logic giữa các dòng.
- **UNION:** Kết hợp các dòng kết quả từ các câu truy vấn có cấu trúc cột tương thích theo chiều dọc để tạo thành một bảng kết quả dài hơn.

#### Q64. Phân biệt cách sử dụng giữa INTERSECT và JOIN

- **INTERSECT:** Phép toán tập hợp so sánh và kết hợp kết quả theo chiều dọc, đòi hỏi các câu truy vấn tham gia phải có số lượng và kiểu dữ liệu các cột hoàn toàn tương đồng.
- **JOIN:** Phép nối dữ liệu theo chiều ngang, kết hợp các cột của hai bảng có cấu trúc khác nhau dựa trên điều kiện nối.

#### Q65. Phân biệt sự giống nhau và khác nhau giữa việc sử dụng UNION và việc sử dụng WHERE kết hợp với AND

- **Giống nhau:** Đều dùng để truy xuất dữ liệu thỏa mãn các điều kiện lọc.
- **Khác nhau:**
  - `WHERE ... AND ...` áp dụng để thu hẹp tập dữ liệu trên cùng một bảng dựa trên các điều kiện lọc đồng thời.
  - `UNION` dùng để gộp dữ liệu từ các nguồn/bảng khác nhau, hoặc giải quyết các điều kiện OR phức tạp mà việc sử dụng một câu lệnh đơn lẻ kèm `WHERE` không tối ưu hoặc không khả thi.

#### Q67. Có thể sử dụng LEFT, INNER, RIGHT JOIN… lộn xộn với nhau trong cùng 1 câu SELECT hay không?

- **Có thể.** SQL Server cho phép kết hợp nhiều loại JOIN trong cùng một câu truy vấn. Tuy nhiên, lập trình viên cần hết sức lưu ý thứ tự ưu tiên thực thi các phép JOIN (mặc định từ trái qua phải) vì việc kết hợp thiếu kiểm soát có thể làm sai lệch logic nghiệp vụ của kết quả. Nên sử dụng cặp dấu ngoặc đơn `()` để phân định rõ thứ tự nối.

#### Q68. Chuyện gì xảy ra nếu trong điều kiện ON của phép JOIN ta để điều kiện là 1 = 1?

- Phép nối sẽ bỏ qua hoàn toàn các ràng buộc khóa và hoạt động tương tự như một phép **CROSS JOIN** (tích Descartes). Mỗi dòng của bảng bên trái sẽ tự động ghép nối với toàn bộ tất cả các dòng của bảng bên phải, tạo ra tập kết quả có số lượng dòng bằng tích số dòng của hai bảng.

#### Q75. So sánh giữa NOT IN và EXCEPT?

- **Giống nhau:** Đều dùng để lọc và loại trừ những phần tử thuộc tập hợp này ra khỏi tập hợp kia.
- **Khác nhau:**
  - `EXCEPT` tự động loại bỏ các dòng trùng lặp trong tập kết quả, còn `NOT IN` giữ nguyên.
  - `EXCEPT` thực hiện so sánh toàn bộ tất cả các cột hiển thị trong truy vấn, trong khi `NOT IN` chỉ so sánh giá trị của một cột duy nhất.
  - **Xử lý NULL (Bản chất 3-Valued Logic):**
    Nếu subquery của `NOT IN` trả về một danh sách chứa `NULL` (ví dụ `1, 2, NULL`), phép so sánh `x NOT IN (1, 2, NULL)` tương đương với `x <> 1 AND x <> 2 AND x <> NULL`. Trong SQL, bất kỳ so sánh nào với `NULL` (như `x <> NULL`) đều trả về kết quả là **UNKNOWN**. Theo quy tắc logic 3 trị, `TRUE AND UNKNOWN` trả về **UNKNOWN**. Một dòng chỉ được giữ lại nếu điều kiện lọc trả về **TRUE**, do đó toàn bộ câu lệnh `NOT IN` sẽ trả về tập kết quả rỗng.
    Ngược lại, `EXCEPT` là phép toán tập hợp. RDBMS xử lý giá trị `NULL` như một giá trị thông thường để so sánh tính bằng nhau (NULL = NULL). Do đó, `EXCEPT` hoạt động bình thường ngay cả khi tập dữ liệu có chứa NULL.

#### Q76. So sánh giữa LEFT JOIN và LEFT OUTER JOIN

- **Hoàn toàn trùng khớp.** `LEFT JOIN` chỉ là cú pháp viết tắt của `LEFT OUTER JOIN`. Từ khóa `OUTER` được tùy chọn viết thêm để làm rõ nghĩa nhưng không làm thay đổi hành vi xử lý của RDBMS.

---

### VIII. Tìm Kiếm, Truy Vấn Con & Hàm Tiện Ích - Q41 đến Q43, Q55 đến Q60, Q69 đến Q71, Q73, Q74

#### Q41. Từ khóa LIKE dùng làm gì?

- Dùng trong mệnh đề `WHERE` để tìm kiếm các chuỗi ký tự khớp với một khuôn mẫu cụ thể (pattern matching) thay vì so sánh bằng tuyệt đối (`=`).

#### Q42. Các ký tự đại diện % và \_ dùng làm gì?

- `%` (Dấu phần trăm): Đại diện cho một chuỗi chứa 0 hoặc nhiều ký tự bất kỳ. (Ví dụ: `LIKE 'N%'` tìm các chuỗi bắt đầu bằng chữ N).
- `_` (Dấu gạch dưới): Đại diện cho duy nhất 1 ký tự bất kỳ tại vị trí đó. (Ví dụ: `LIKE '_a%'` tìm các chuỗi có ký tự thứ hai là chữ a).

#### Q43. Vì sao trong dự án, không nên sử dụng SELECT \* nếu không thật sự cần thiết?

1. **Lãng phí tài nguyên mạng & I/O:** Truyền tải những cột dữ liệu không sử dụng đến làm chậm tốc độ phản hồi của hệ thống (đặc biệt nguy hiểm với các cột chứa dữ liệu lớn như hình ảnh, văn bản dài).
2. **Mất tối ưu Index:** RDBMS sẽ không thể áp dụng "Covering Index" (chỉ mục bao phủ), buộc phải thực hiện thao tác Lookup dữ liệu vật lý từ đĩa cứng (Clustered Index Seek/Scan).
3. **Lỗi logic ứng dụng:** Nếu cấu trúc bảng thay đổi (thêm, xóa hoặc tráo đổi thứ tự cột), các code ứng dụng mapping dữ liệu theo vị trí cột (index) hoặc ORM có thể bị lỗi.

- **💡 Bản chất kỹ thuật (Deep Dive):** Khi bạn tạo một Non-Clustered Index trên cột `TenHS`, Index này lưu trữ giá trị của `TenHS` và một con trỏ trỏ tới dòng vật lý trong bảng (Clustered Index Key hoặc Row ID - RID).
  - Nếu bạn `SELECT TenHS WHERE TenHS = 'An'`, SQL Server chỉ cần đọc trên Index Page (Index-Only Scan), hiệu năng cực tốt.
  - Nếu bạn dùng `SELECT * WHERE TenHS = 'An'`, Index không chứa đủ tất cả các cột khác. SQL Server buộc phải làm thêm một bước gọi là **Key Lookup / RID Lookup** để nhảy từ Index Page sang Data Page gốc tìm các cột còn lại. Nếu số lượng dòng thỏa mãn điều kiện lớn, chi phí Key Lookup rất cao, khiến Optimizer bỏ Index và chuyển sang quét toàn bộ bảng (Clustered Index Scan/Table Scan), phá hỏng hoàn toàn ý đồ đánh chỉ mục của bạn.

#### Q55. Select lồng nhau nghĩa là gì? Cho ví dụ

- Là câu lệnh truy vấn SELECT chứa một hoặc nhiều câu lệnh SELECT khác bên trong cấu trúc của nó (nằm ở mệnh đề SELECT, FROM hoặc WHERE).
- _Ví dụ:_

  ```sql
  SELECT TenHS FROM HOCSINH
  WHERE MaLop = (SELECT MaLop FROM LOP WHERE TenLop = '12A1');
  ```

#### Q56. Sub query nghĩa là gì? Cho ví dụ

- Sub query (truy vấn con) chính là câu truy vấn SELECT nằm bên trong một câu truy vấn cha (outer query).
- _Ví dụ:_ Trong ví dụ Q55, phần lệnh nằm trong dấu ngoặc đơn `(SELECT MaLop FROM LOP...)` chính là một Sub query.

#### Q57. Từ khóa IN và EXIST dùng làm gì? Cho ví dụ

- **IN:** Kiểm tra xem giá trị của một cột có thuộc tập hợp giá trị hoặc kết quả trả về của một truy vấn con hay không.
  - _Ví dụ:_ `SELECT * FROM HOCSINH WHERE MaLop IN ('L01', 'L02');`
- **EXISTS:** Kiểm tra sự tồn tại của bất kỳ bản ghi nào thỏa mãn điều kiện của truy vấn con. Trả về giá trị Boolean (TRUE/FALSE) và dừng quét ngay khi tìm thấy bản ghi đầu tiên khớp (tối ưu hiệu năng tốt).
  - _Ví dụ:_ Lọc các lớp học có học sinh đang theo học:

    ```sql
    SELECT * FROM LOP l
    WHERE EXISTS (SELECT 1 FROM HOCSINH h WHERE h.MaLop = l.MaLop);
    ```

#### Q58. Phân biệt sự khác nhau khi sử dụng NOT IN và NOT EXISTS

- **NOT IN:** So sánh giá trị cột với danh sách con. Nếu trong danh sách con trả về của subquery có chứa bất kỳ giá trị `NULL` nào, toàn bộ truy vấn `NOT IN` sẽ trả về tập kết quả rỗng do cơ chế logic 3 giá trị (Three-valued logic) trong SQL.
- **NOT EXISTS:** Đánh giá dựa trên sự tồn tại của hàng thỏa mãn điều kiện liên kết (Correlation). Không bị ảnh hưởng bởi giá trị `NULL` trong kết quả truy vấn con và có hiệu năng tối ưu tốt hơn trên tập dữ liệu lớn khi có chỉ mục.
- **💡 Bản chất kỹ thuật (Deep Dive):**
  - Dưới Execution Plan của SQL Server, `NOT EXISTS` thường được tối ưu hóa thành thuật toán **Left Anti Semi Join**. RDBMS sẽ duyệt bảng chính và đối chiếu chỉ mục bảng phụ, dừng duyệt ngay khi tìm thấy bản ghi đầu tiên trùng khớp.
  - Ngược lại, `NOT IN` buộc hệ thống phải đánh giá toàn bộ danh sách phần tử trả về để loại trừ khả năng có chứa NULL, làm tăng chi phí tính toán và ngăn chặn bộ tối ưu hóa truy vấn chuyển đổi sang phép toán Anti Semi Join hiệu năng cao.

#### Q59. Từ khóa DISTINCT dùng làm gì?

- Dùng ngay sau từ khóa `SELECT` để loại bỏ hoàn toàn các bản ghi trùng lặp thông tin hiển thị, chỉ giữ lại các dòng dữ liệu duy nhất trong tập kết quả trả về.

#### Q60. Từ khóa AS dùng làm gì? Dùng trong những trường hợp nào? Cho ví dụ

- **Mục đích:** Dùng để đặt tên giả (Alias) tạm thời cho các cột hoặc các bảng trong câu truy vấn nhằm tăng tính rõ nghĩa hoặc viết gọn câu lệnh SQL.
- **Trường hợp sử dụng:**
  - _Đổi tên cột:_ `SELECT TenHS AS [Họ và Tên] FROM HOCSINH;`
  - _Rút gọn tên bảng để thực hiện JOIN:_ `SELECT h.TenHS, l.TenLop FROM HOCSINH h JOIN LOP l ON h.MaLop = l.MaLop;`

#### Q69 & Q74. SELECT TOP dùng để làm gì? Cho ví dụ minh họa

- **Mục đích:** Dùng để giới hạn số lượng bản ghi tối đa được phép trả về trong tập kết quả của câu lệnh SELECT. Thường được sử dụng kết hợp với mệnh đề `ORDER BY` để lấy ra các phần tử lớn nhất/nhỏ nhất.
- **Ví dụ:** Lấy ra danh sách 3 học sinh có điểm trung bình cao nhất trường:

  ```sql
  SELECT TOP 3 TenHS, DiemTB FROM HOCSINH ORDER BY DiemTB DESC;
  ```

#### Q70. SELECT INTO dùng để làm gì?

- Dùng để sao chép dữ liệu từ một bảng có sẵn và tự động tạo mới một bảng khác chứa toàn bộ kết quả của câu lệnh truy vấn đó chỉ trong một thao tác duy nhất. Thường dùng để backup dữ liệu nhanh.
- _Ví dụ:_ Tạo bảng sao lưu dữ liệu học sinh:

  ```sql
  SELECT * INTO HOCSINH_BACKUP FROM HOCSINH;
  ```

#### Q71. Các hàm LEN, YEAR, MONTH… dùng để làm gì?

- **LEN(str):** Trả về độ dài (số lượng ký tự) của một chuỗi truyền vào.
- **YEAR(date):** Trả về giá trị số nguyên đại diện cho phần năm của dữ liệu kiểu ngày.
- **MONTH(date):** Trả về giá trị số nguyên (1-12) đại diện cho phần tháng của dữ liệu kiểu ngày.

#### Q73. Loại quan hệ hay gặp nhất trong DB là quan hệ gì (1-1, 1-n hay n-n)?

- Mối quan hệ **1-n (Một - Nhiều)** là loại mối quan hệ phổ biến nhất, xuất hiện nhiều nhất trong tất cả các thiết kế cơ sở dữ liệu quan hệ thực tế.

---

### IX. Kỹ Năng Phỏng Vấn & Xử Lý Tình Huống - Q72

#### Q72. Khi người phỏng vấn hỏi về một hàm XYZ nào đó mà mình chưa biết, mình sẽ trả lời như thế nào cho hợp lý?

Gợi ý hướng trả lời chuyên nghiệp và ghi điểm:

1. **Thành thật và tích cực:** Xác nhận trực tiếp với người phỏng vấn rằng hiện tại bạn chưa từng sử dụng qua hoặc chưa nhớ rõ cú pháp/tên của hàm `XYZ` này trong hệ quản trị CSDL cụ thể đó.
2. **Nêu hướng giải quyết nhanh:** Khẳng định rằng bạn sẽ tra cứu nhanh tài liệu chính thức (Official Documentation như Microsoft Docs, PostgreSQL Docs) hoặc các nguồn uy tín trong vòng 1-2 phút là có thể nắm vững cách dùng của hàm đó.
3. **Nhấn mạnh tư duy nền tảng:** Nhấn mạnh rằng đối với bạn, tư duy thiết kế CSDL chuẩn hóa, khả năng tối ưu hóa chỉ mục (Indexing), phân tích bài toán nghiệp vụ để thiết kế câu lệnh truy vấn hiệu năng cao mới là yếu tố cốt lõi; các hàm tiện ích có sẵn có rất nhiều và có thể tra cứu nhanh chóng khi làm việc thực tế.

---

## Related Notes

- Project MOC: [[000_VietTriDao_MOC]]
- Coding Standards: [[Coding_Standards]]
- Tech Stack Decisions: [[Tech_Stack_Decisions]]
