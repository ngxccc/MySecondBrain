# Hướng Dẫn Sử Dụng Apidog Và MCP (Model Context Protocol) Để Viết & Test API

**Model Context Protocol (MCP)** là một giao thức mở do Anthropic phát triển, cho phép các mô hình AI (LLMs) kết nối an toàn với các nguồn dữ liệu và công cụ cục bộ/từ xa.

**Apidog** hỗ trợ tích hợp sâu với MCP theo cả hai chiều:

1. **Apidog là một MCP Client**: Cho phép bạn kết nối và debug các MCP Server trực tiếp trên giao diện Apidog.
2. **Apidog là một MCP Server**: Cung cấp toàn bộ đặc tả API, schema và test suites của dự án cho các mô hình AI (như Claude, Cursor) để AI tự động sinh kịch bản test hoặc gọi API.

---

## 1. Chiều 1: Apidog làm MCP Client (Để Debug & Test MCP Servers)

Nếu bạn đang phát triển một MCP Server (ví dụ: một server cung cấp tool cho Claude đọc DB, chạy script), bạn có thể dùng Apidog làm công cụ giao diện trực quan để kiểm thử (tương tự như cách bạn dùng Postman để test API REST).

### Các bước thực hiện:

1. **Mở Apidog (Desktop App)**: Bản cập nhật mới hỗ trợ tính năng **MCP Client**.
2. **Cấu hình Kết nối MCP Server**:
   - Vào phần **Setting** hoặc tab **MCP Client** trong Apidog.
   - Thêm một MCP Server mới bằng cách khai báo:
     - **Transport type**: `stdio` (chạy command CLI cục bộ) hoặc `SSE` (Server-Sent Events qua HTTP).
     - **Command**: Ví dụ `node /path/to/mcp-server/index.js` hoặc file thực thi.
3. **Debug công cụ (Tools) và tài nguyên (Resources)**:
   - Sau khi kết nối thành công, Apidog sẽ tự động hiển thị danh sách tất cả các **Tools** (hàm mà AI có thể gọi) và **Resources** (dữ liệu AI có thể đọc) dưới dạng giao diện UI đồ họa.
   - Bạn có thể điền tham số (Input parameters) vào form và bấm **Run/Execute** để gọi thử Tool đó. Apidog sẽ hiển thị kết quả trả về (JSON, Text) lập tức để bạn kiểm tra xem logic của Tool đã đúng chưa.

---

## 2. Chiều 2: Apidog làm MCP Server (Cấp API Context cho AI tự động test)

Khi bạn viết xong các API Endpoint trên dự án NestJS của mình và thiết kế tài liệu API trên Apidog, bạn có thể biến Apidog thành một **MCP Server** để cung cấp ngữ cảnh cho AI.

### Cách thức hoạt động:

```
┌──────────────┐     Đọc API Spec, Schemas, Examples     ┌────────────────────┐
│  AI Client   │ ◄─────────────────────────────────────  │ Apidog MCP Server  │
│(Claude/Cursor)│                                        └────────────────────┘
└──────┬───────┘
       │ Sinh ra & thực thi các kịch bản test tự động
       ▼
┌──────────────┐
│  NestJS App  │ (Local hoặc Remote Production)
└──────────────┘
```

### Các bước cài đặt:

1. **Khởi chạy Apidog MCP Server**:
   Apidog cung cấp một MCP Server chính thức hỗ trợ AI đọc tài liệu API của bạn.
   - Cài đặt qua CLI hoặc chạy trực tiếp cấu hình Apidog MCP Server từ tài liệu hướng dẫn của hãng.
   - Sử dụng lệnh khởi chạy (stdio transport):
     ```bash
     npx @apidog/mcp-server --token <APIDOG_PERSONAL_ACCESS_TOKEN> --projectId <PROJECT_ID>
     ```
2. **Cấu hình trên AI Client (Ví dụ: Claude Desktop)**:
   Thêm cấu hình sau vào tệp cấu hình Claude Desktop (`claude_desktop_config.json`):
   ```json
   {
     "mcpServers": {
       "apidog": {
         "command": "npx",
         "args": [
           "@apidog/mcp-server",
           "--token",
           "YOUR_APIDOG_TOKEN",
           "--projectId",
           "YOUR_PROJECT_ID"
         ]
       }
     }
   }
   ```
3. **Yêu cầu AI viết và chạy API Test**:
   Sau khi kết nối, AI của bạn sẽ hiểu toàn bộ API của dự án. Bạn có thể chat trực tiếp với AI:
   - _"Hãy tìm xem có API đăng ký tài khoản nào không, kiểm tra schema của nó và tạo một test case gửi thử lên môi trường Dev."_
   - _"Hãy viết một kịch bản test liên hoàn (Scenario): Đăng ký user mới -> Kích hoạt tài khoản -> Đăng nhập -> Lấy profile."_

   AI sẽ tự động sử dụng Apidog MCP Server để lấy mẫu Request Body chuẩn, tự gọi endpoint thông qua các công cụ của nó, phân tích Response và báo cáo kết quả kiểm thử cho bạn.

---

## 3. Lợi ích khi sử dụng Apidog MCP

- **Loại bỏ việc Copy-Paste**: AI tự động đọc hiểu tài liệu API, schema JSON trực tiếp từ Apidog mà không cần bạn export file Swagger/Postman rồi paste vào chat.
- **Test tự động thông minh**: AI tự phát hiện ra các tham số biên (boundary values), tạo các payload lỗi (như password yếu, email sai định dạng) để test tính bảo mật và validate của API.
- **Hỗ trợ Test Suite & Scenario**: Tự động ghép nối các bước test dựa trên sơ đồ luồng dữ liệu của dự án.
