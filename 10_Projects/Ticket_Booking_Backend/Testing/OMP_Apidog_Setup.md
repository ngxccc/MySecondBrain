# Cấu Hình MCP Trong Oh My Pi (OMP) & Tích Hợp Apidog

Tài liệu này hướng dẫn cách quản lý các cấu hình MCP (Model Context Protocol) trong hệ sinh thái **Oh My Pi (OMP)**, cách bật/tắt các server cho từng dự án riêng biệt, và cách tích hợp **Apidog MCP Server** bằng cách sử dụng các biến môi trường bảo mật.

---

## 1. Cơ Chế Hoạt Động & Quản Lý MCP Trong OMP

OMP tìm kiếm và tải cấu hình MCP ở hai cấp độ chính:

1. **Cấp độ Dự án (Project-scoped)**: Cấu hình nằm tại `.omp/mcp.json` trong thư mục gốc của dự án. File này được commit lên git để toàn bộ thành viên dự án dùng chung định nghĩa.
2. **Cấp độ Người dùng (User-scoped)**: Cấu hình nằm tại `~/.omp/agent/mcp.json` (áp dụng toàn cục cho tất cả các dự án của user đó).

---

## 2. Cách Thiết Lập Bật/Tắt MCP Cho Từng Dự Án (Project-level control)

**Hoàn toàn có thể bật/tắt độc lập từng MCP Server cho mỗi dự án.**

Vì file cấu hình `.omp/mcp.json` nằm ngay trong thư mục dự án, bạn có hai cách để điều khiển bật/tắt:

### Cách 1: Sử dụng cờ `"enabled"` trực tiếp trong file `.omp/mcp.json`

Mỗi server trong đối tượng `mcpServers` đều hỗ trợ thuộc tính `enabled?: boolean`. Bạn chỉ cần sửa thuộc tính này thành `false` để vô hiệu hóa server đó trong dự án hiện tại:

```json
{
  "mcpServers": {
    "playwright": {
      "enabled": false, // <-- Tắt playwright cho dự án này
      "command": "bunx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

### Cách 2: Sử dụng thuộc tính `disabledServers` ở cấu hình User

Nếu dự án có khai báo một MCP Server trong `.omp/mcp.json`, nhưng cá nhân bạn không muốn chạy nó trên máy của mình, bạn có thể đưa tên server đó vào danh sách đen `disabledServers` trong file cấu hình toàn cục của user (`~/.omp/agent/mcp.json`):

```json
{
  "disabledServers": ["playwright", "drizzle-kit"]
}
```

NestJS OMP sẽ bỏ qua không khởi chạy các server này khi bạn làm việc trên dự án.

---

## 3. Cách Tích Hợp Apidog MCP Server Vào OMP

Để tích hợp Apidog, chúng ta cần khai báo một `stdio` server chạy câu lệnh npx chính thức của Apidog.

Để tránh việc hardcode (lộ lọt) Token bảo mật và Project ID lên Git Repository, chúng ta sử dụng tính năng **Discovery-time Expansion `${...}`** của OMP. OMP sẽ tự động phân giải các biến này từ môi trường hoặc tệp `.env` lúc chạy.

### Cấu hình thêm vào `.omp/mcp.json`:

```json
{
  "mcpServers": {
    "apidog": {
      "command": "npx",
      "args": [
        "-y",
        "apidog-mcp-server",
        "--project-id",
        "${APIDOG_PROJECT_ID}"
      ],
      "env": {
        "APIDOG_ACCESS_TOKEN": "${APIDOG_ACCESS_TOKEN}"
      }
    }
  }
}
```

Khi khởi chạy OMP, bạn chỉ cần gán biến trong môi trường hoặc khai báo trong `.env` cục bộ:

```env
APIDOG_ACCESS_TOKEN="your_personal_access_token"
APIDOG_PROJECT_ID="your_apidog_project_id"
```

---

## 4. Hướng Dẫn Cách Lấy Token & Project ID Từ Apidog

### 4.1. Cách lấy Personal Access Token (API Token)

1. Truy cập vào trang web [apidog.com](https://apidog.com) hoặc mở ứng dụng Apidog Desktop.
2. Bấm vào **Avatar** của bạn ở góc trên cùng bên phải.
3. Chọn **Account Settings** (Cài đặt tài khoản) $\rightarrow$ Chọn tab **Personal Access Tokens** (Mã truy cập cá nhân).
4. Bấm **Generate Token** (Tạo Token).
5. Điền tên đại diện (ví dụ: `OMP-Integration`), chọn thời gian hết hạn mong muốn và bấm **Generate**.
6. **Sao chép và lưu trữ Token** này ở nơi an toàn (Token này chỉ hiển thị đúng 1 lần duy nhất sau khi tạo).

### 4.2. Cách lấy Project ID

1. Mở ứng dụng Apidog và chọn Dự án (Project) bạn đang làm việc.
2. Tại thanh menu bên trái, kéo xuống dưới cùng và chọn **Project Settings** (Cài đặt dự án).
3. Trong màn hình **Basic Information** (Thông tin cơ bản), bạn sẽ thấy dòng **Project ID** (định dạng là một chuỗi số hoặc chuỗi UUID định danh).
4. Sao chép chuỗi ID đó để điền vào cấu hình.

---

## 5. Các Lệnh Điều Khiển MCP Tiện Dụng Trong OMP

- `/mcp list`: Hiển thị tất cả các server đang hoạt động và nguồn gốc file cấu hình của chúng.
- `/mcp reload`: Tải lại tất cả các file cấu hình và kết nối lại các server.
- `/mcp test <name>`: Chạy thử nghiệm kết nối và kiểm tra sức khỏe của một server cụ thể (ví dụ: `/mcp test apidog`).
- `/mcp reconnect <name>`: Kết nối lại một server bị ngắt kết nối mà không cần reload toàn bộ.
