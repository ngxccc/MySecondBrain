# Hướng Dẫn Cấu Hình HTTPS & Bảo Mật Với Cloudflare Tunnel và Caddy

Tài liệu này hướng dẫn cách thiết lập HTTPS bảo mật sử dụng **Cloudflare Tunnel** kết hợp với **Caddy Server** làm Reverse Proxy. Giải pháp này giúp ẩn hoàn toàn IP thật của máy ảo, không cần mở cổng 80/443 hay 22 trên Azure NSG ra ngoài Internet, và tránh hoàn toàn lỗi giới hạn rate-limit chứng chỉ Let's Encrypt.

---

## I. KIẾN TRÚC HỆ THỐNG (ARCHITECTURE)

Thay vì trỏ trực tiếp DNS về IP thật của VM và mở cổng trên Azure, toàn bộ traffic đi qua mạng lưới bảo mật của Cloudflare:

```text
Client (HTTPS:443)  --->  Cloudflare Edge (SSL Termination)
                                   |
                         (Cloudflare Tunnel - Outbound Secure)
                                   v
                             Caddy (HTTP:80)
                                   |
                      NestJS Container (HTTP:3000)
```

**Ưu điểm:**

- **Không cần mở port 80/443/22** trên Azure NSG.
- IP máy ảo được ẩn hoàn toàn (giảm thiểu tấn công DDoS, quét port).
- Cloudflare lo chứng chỉ SSL ở Edge, Caddy chỉ chạy HTTP nội bộ giúp loại bỏ lỗi gia hạn SSL/Rate-limit.

---

## II. HƯỚNG DẪN CẤU HÌNH CHI TIẾT

### Bước 1: Tạo Public Hostname trên Cloudflare Tunnel

Để định tuyến traffic từ domain về máy ảo qua Tunnel:

1. Vào **Cloudflare Zero Trust Dashboard** -> **Access** -> **Tunnels**.
2. Chọn tunnel của bạn (ví dụ: `ticket-booking-v2`) -> **Public Hostnames** -> **Add a public hostname**.
3. Cấu hình cho **Website**:
   - **Subdomain:** `ticketbooking`
   - **Domain:** `ngxc.io.vn`
   - **Service:** `HTTP`
   - **URL:** `localhost:80`
4. Cấu hình cho **SSH**:
   - **Subdomain:** `ssh-ticketbooking` (Dùng cấp 1 để khớp với wildcard SSL miễn phí của Cloudflare)
   - **Domain:** `ngxc.io.vn`
   - **Service:** `SSH`
   - **URL:** `localhost:22`

---

### Bước 2: Cấu hình `Caddyfile` chạy HTTP-only

Để tránh lỗi lặp vòng lặp chuyển hướng (Redirect Loop) khi chạy sau Cloudflare Tunnel, Caddyfile trên VM cần tắt tính năng tự động HTTPS và chỉ lắng nghe HTTP:

```caddy
{
    auto_https off # Tắt hoàn toàn tính năng tự động xin SSL của Caddy
}

http://ticketbooking.ngxc.io.vn {
    reverse_proxy ticket-booking-app-blue:3000
}
```

---

### Bước 3: Cập nhật file `.ssh/config` trên máy Local để SSH qua Tunnel

Vì cổng 22 đã được đóng trên Azure NSG, bạn kết nối SSH thông qua Cloudflare Tunnel client:

```ssh
Host ticket-booking-vm
    HostName ssh-ticketbooking.ngxc.io.vn
    User azureuser
    ProxyCommand cloudflared access ssh --hostname %h
    IdentityFile ~/.ssh/ticket-booking-v2_key.pem
```

Bây giờ bạn có thể SSH an toàn bằng lệnh:

```bash
ssh ticket-booking-vm
```

---

## III. CÁC CÂU HỎI PHỎNG VẤN THƯỜNG GẶP (FAQ)

### Q1: Tại sao em lại chạy Caddy ở chế độ HTTP-only sau Cloudflare Tunnel?

- **Trả lời mẫu:**
  > _"Dạ, vì Cloudflare Tunnel đã thực hiện giải mã SSL (SSL Termination) tại Edge của Cloudflare và chuyển tiếp traffic an toàn về máy ảo dưới dạng HTTP. Nếu Caddy cũng bật chế độ HTTPS tự động, nó sẽ cố gắng redirect HTTP sang HTTPS hoặc tự sinh chứng chỉ Let's Encrypt. Điều này sẽ dẫn đến lỗi lặp chuyển hướng (Redirect Loop) và lỗi rate-limit của Let's Encrypt do không xác thực được tên miền qua proxy. Cấu hình Caddy chạy HTTP-only giúp hệ thống đơn giản, nhẹ và hoạt động ổn định nhất."_

### Q2: Sử dụng Cloudflare Tunnel có lợi ích gì về mặt bảo mật so với mở port thông thường?

- **Trả lời mẫu:**
  > _"Dạ, lợi ích lớn nhất là **Zero Open Ports**. Em không cần mở bất kỳ cổng nào (kể cả cổng 22 để SSH hay 80/443 để web) trên Azure NSG ra Internet. Máy ảo chỉ thực hiện kết nối outbound an toàn đến Cloudflare. Điều này giúp ẩn hoàn toàn địa chỉ IP thật của máy ảo, ngăn chặn các cuộc tấn công quét port, brute-force SSH và giảm thiểu tấn công DDoS."_
