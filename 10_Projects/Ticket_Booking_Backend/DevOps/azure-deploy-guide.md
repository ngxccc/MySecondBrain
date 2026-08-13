# Hướng Dẫn Deploy Dự Án (NestJS + Postgres + Redis) Lên Azure VM

Tài liệu này hướng dẫn cách triển khai dự án Ticket Booking chạy Docker lên máy ảo Azure, sử dụng Cloudflare Tunnel để ẩn IP và bảo mật tuyệt đối.

---

## I. CẤU HÌNH VM & CHI PHÍ

Dự án hiện tại đang chạy trên máy ảo **Azure Standard_B2ats_v2** (2 vCPU, 1 GiB RAM) chạy hệ điều hành **Debian 13 (Trixie)**.

### Lưu ý quan trọng về chi phí

- **`Standard_B2ats_v2` KHÔNG nằm trong gói Free Tier 12 tháng** (chỉ có B1s mới được miễn phí).
- VM này sẽ **tiêu tốn credit trong gói $200 dùng thử** (Free Trial 30 ngày) trên cơ sở tính phí theo giờ.
- Sau 30 ngày hoặc khi hết $200 credit, bạn phải xóa VM hoặc chuyển sang gói trả phí để tránh phát sinh hóa đơn thực tế.

---

## II. BẢO MẬT ĐẦY ĐỦ VỚI CLOUDFLARE TUNNEL

Thay vì mở cổng 22 (SSH), 80 (HTTP) và 443 (HTTPS) ra internet trên Azure Network Security Group (NSG):

1. **Đóng toàn bộ các cổng này** trên Azure NSG.
2. Cài đặt `cloudflared` trên máy ảo để tạo kết nối an toàn ra Cloudflare.
3. Tạo Route (Public Hostname) trỏ về:
   - Web: `ticketbooking.ngxc.io.vn` -> `http://localhost:80`
   - SSH: `ssh-ticketbooking.ngxc.io.vn` -> `ssh://localhost:22`

---

## III. QUY TRÌNH TRIỂN KHAI (DEPLOYMENT FLOW)

Mỗi lần cập nhật code, quy trình deploy từ máy local lên VM như sau:

### Bước 1: Đóng gói mã nguồn ở máy local

Sử dụng `git archive` để tạo file nén sạch sẽ (loại bỏ node_modules, git history, cache):

```bash
git archive -o /tmp/project.tar.gz HEAD
```

### Bước 2: Copy file nén lên VM qua Cloudflare Tunnel

Sử dụng alias `ticket-booking-vm` đã cấu hình trong `~/.ssh/config`:

```bash
scp /tmp/project.tar.gz ticket-booking-vm:/home/azureuser/
```

### Bước 3: SSH vào giải nén và chạy redeploy script

```bash
ssh ticket-booking-vm << 'EOF'
cd /home/azureuser
rm -rf ticket-booking-new
mkdir ticket-booking-new
tar -xzf project.tar.gz -C ticket-booking-new
cd ticket-booking-new
chmod +x scripts/redeploy.sh
./scripts/redeploy.sh
EOF
```

---

## IV. CÁC CÂU HỎI PHỎNG VẤN THƯỜNG GẶP (FAQ)

### Q1: Tại sao em lại giới hạn tài nguyên của Docker và VM?

- **Trả lời mẫu:**
  > \*"Dạ, vì VM hiện tại của em chỉ có 1GB RAM (B2ats_v2). Để đảm bảo hệ thống không bị lỗi Out-Of-Memory (OOM) làm treo máy ảo, em đã cấu hình:
  >
  > 1. Giới hạn RAM Docker daemon ở mức 250MB qua systemd override.
  > 2. Giới hạn RAM của các container (NestJS app 256MB, Postgres 512MB, Redis 128MB, Caddy 128MB).
  > 3. Cấu hình Swap space 2GB trên ổ đĩa để làm bộ đệm khi RAM bị quá tải đột ngột.
  > 4. Disable các service không cần thiết trên OS (như walinuxagent, unattended-upgrades) để tiết kiệm thêm ~120MB RAM."\*
