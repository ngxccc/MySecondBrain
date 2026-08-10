---
tags: [type/concept, topic/tech, tmux, terminal, tooling, layer/infrastructure]
aliases: [Tmux Session vs Window vs Pane, Tmux Keybinds]
description: "Tmux (Terminal Multiplexer) giúp quản lý nhiều phiên làm việc (Sessions), tab (Windows) và phân mảnh màn hình (Panes) trên một cửa sổ Terminal duy nhất. Bằng cách tích hợp `vim-tmux-navigator`, ta ..."
---

# Quản lý và Điều hướng Terminal với Tmux

## TL;DR

Tmux (Terminal Multiplexer) giúp quản lý nhiều phiên làm việc (Sessions), tab (Windows) và phân mảnh màn hình (Panes) trên một cửa sổ Terminal duy nhất. Bằng cách tích hợp `vim-tmux-navigator`, ta có thể di chuyển liền mạch giữa các split windows của Neovim và các panes của Tmux bằng tổ hợp phím `Ctrl + h/j/k/l` trực tiếp mà không cần bấm phím Prefix (`Ctrl + a`). Đồng thời, hệ thống hỗ trợ lưu trạng thái tự động qua `tmux-resurrect` giúp khôi phục toàn bộ môi trường làm việc khi khởi động lại máy.

## Core Concept

Môi trường Tmux được phân cấp từ lớn đến nhỏ: **Session $\rightarrow$ Window $\rightarrow$ Pane**.

```text
Session (Một dự án độc lập, chạy ngầm)
├── Window 1 (Tab số 1 - ví dụ: Code)
│   ├── Pane 1 (Trái - chạy Neovim)
│   └── Pane 2 (Phải - chạy test/shell)
└── Window 2 (Tab số 2 - ví dụ: Server Logs)
    ├── Pane 1 (Trên - chạy Server Dev)
    └── Pane 2 (Dưới - chạy Docker)
```

- **Session (Phiên làm việc):** Quản lý mức cao nhất. Mỗi dự án nên chạy ở một Session riêng (ví dụ: `web-dev`, `sys-admin`). Khi bạn **Detach** (thoát ra ngoài), mọi tiến trình bên trong vẫn tiếp tục chạy ngầm.
- **Window (Cửa sổ):** Là các Tab hiển thị ở thanh trạng thái dưới cùng màn hình. Tại một thời điểm chỉ hiển thị một Window.
- **Pane (Phân mảnh):** Chia nhỏ một Window thành nhiều ô nhỏ hiển thị đồng thời (Split dọc `|` hoặc ngang `-`).

## Practical Implementation

### 1. Điều hướng và Phím tắt Cấu hình sẵn

| Phím tắt                 | Thao tác                                | Chức năng                                                                                                        |
| :----------------------- | :-------------------------------------- | :--------------------------------------------------------------------------------------------------------------- |
| **`Ctrl + h/j/k/l`**     | **Gõ trực tiếp (Không cần Prefix)**     | Di chuyển liền mạch giữa các split Neovim và các pane Tmux                                                       |
| **`Prefix` + `H/J/K/L`** | **Prefix (`Ctrl+a`) + Shift + h/j/k/l** | Co dãn kích thước Pane (Nhấn giữ/nhấn liên tiếp để resize tiếp)                                                  |
| **`Prefix` + `           | `** / **`-`**                           | `Shift + \` / `Dấu trừ`                                                                                          | Chia Pane dọc / Chia Pane ngang (giữ nguyên thư mục CWD) |
| **`Prefix` + `z`**       | Gõ phím `z`                             | Phóng to (Zoom) Pane hiện tại lên toàn màn hình / thu nhỏ lại                                                    |
| **`Prefix` + `$`**       | Gõ phím `$`                             | Đổi tên Session hiện tại                                                                                         |
| **`Prefix` + `,`**       | Gõ phím `,`                             | Đổi tên Window hiện tại                                                                                          |
| **`Prefix` + `<` / `>`** | `Shift + ,` / `Shift + .`               | Di chuyển/Thay đổi vị trí thứ tự của Window (Tab) sang trái/phải (Nhấn giữ/gõ liên tục phím để dịch chuyển tiếp) |
| **`Prefix` + `s`**       | Gõ phím `s`                             | Hiện danh sách Session (Nhấn `x` trên một dòng để xóa session đó)                                                |
| **`Prefix` + `r`**       | Gõ phím `r`                             | Reload lại file cấu hình Tmux                                                                                    |

### 2. Lưu & Khôi phục Phiên làm việc

- **Lưu trạng thái thủ công:** Nhấn `Prefix` + `Ctrl + s`.
- **Khôi phục trạng thái thủ công:** Nhấn `Prefix` + `Ctrl + r`.
- **Tự động:** Hệ thống tự động lưu mỗi 15 phút (qua `tmux-continuum`). Khi mở Tmux, layout gần nhất sẽ tự phục hồi.
- **Lưu ý với Neovim:** Tmux-resurrect chỉ khôi phục panel trống. Bạn cần lưu session Neovim bên trong bằng `<leader>ss` (trong Neovim) và khôi phục lại bằng `<leader>sr`.

---

**Related Notes:**

- [[Vim_Shortcuts]]
