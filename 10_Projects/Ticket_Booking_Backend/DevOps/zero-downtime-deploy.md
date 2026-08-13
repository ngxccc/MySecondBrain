# Hướng Dẫn Triển Khai Không Gián Đoạn (Zero-Downtime Deployment) Với Docker & Caddy

Tài liệu này giải thích cách thiết lập quy trình triển khai phiên bản mới của ứng dụng NestJS mà **không làm gián đoạn truy cập của người dùng (Zero-Downtime / Blue-Green Deployment)** khi chạy sau Cloudflare Tunnel, đồng thời giải thích bản chất cơ chế mạng của Docker.

---

## I. BẢN CHẤT MẠNG DOCKER: TẠI SAO KHÔNG CẦN ĐỔI CỔNG TRONG DOCKERFILE?

Một hiểu lầm phổ biến là: _"Muốn chạy 2 container song song thì phải đổi cổng lắng nghe bên trong Dockerfile (ví dụ từ 3000 sang 3001) để tránh trùng cổng."_

Trong thực tế, **bạn hoàn toàn KHÔNG cần sửa Dockerfile hay đổi cổng lắng nghe của NestJS**.

### Lý do

1. **Mỗi Container là một máy ảo cô lập:** Trong mạng ảo của Docker (ở đây là `ticket-booking-net`), mỗi container được cấp một địa chỉ IP riêng biệt (ví dụ: `172.18.0.5` và `172.18.0.6`).
2. **Không trùng cổng:** Vì IP khác nhau, cả 2 container đều có thể chạy ứng dụng NestJS lắng nghe trên cổng `3000` nội bộ của riêng chúng mà không hề gây ra bất kỳ xung đột nào.
3. **Không cần Publish cổng ra ngoài (No `-p` host port mapping):** Vì chúng ta sử dụng Caddy làm Proxy nằm chung mạng nội bộ, Caddy sẽ gọi trực tiếp đến tên container và cổng nội bộ của nó.
   - Caddy trỏ tới Bản cũ: `reverse_proxy ticket-booking-container-v1:3000`
   - Caddy trỏ tới Bản mới: `reverse_proxy ticket-booking-container-v2:3000`
   - _Cổng kết nối luôn luôn là `3000`, chỉ có tên container (Host) thay đổi._

---

## II. QUY TRÌNH TRIỂN KHAI CHI TIẾT

Quy trình này được tự động hóa bằng script `scripts/redeploy.sh` (Blue-Green Deployment mặc định).

### Bước 1: Xác định phiên bản đang chạy (Active) và phiên bản mới (Idle)

Script sẽ kiểm tra xem container nào đang chạy chính thức:

- Nếu `ticket-booking-app-blue` đang chạy -> Bản mới sẽ là `ticket-booking-app-green`.
- Nếu `ticket-booking-app-green` đang chạy -> Bản mới sẽ là `ticket-booking-app-blue`.

### Bước 2: Build Image mới nhất

Tiến hành build Docker Image mới nhất:

```bash
docker build -t ticket-booking-app:latest .
```

### Bước 3: Khởi chạy container phiên bản mới (Idle)

Khởi chạy container mới song song với bản cũ, giới hạn RAM để tránh OOM trên VM 1GB:

```bash
docker run -d \
  --env-file .env \
  --network ticket-booking_ticket-booking-net \
  --name ticket-booking-app-green \
  --restart unless-stopped \
  --memory="256m" \
  --memory-reservation="128m" \
  --cpus="0.50" \
  ticket-booking-app:latest
```

### Bước 4: Kiểm tra sức khỏe (Health Check) bản mới

Script sẽ đợi cho đến khi container mới khởi động xong và vượt qua kiểm thử nội bộ:

```bash
until [ "$(docker inspect -f '{{.State.Health.Status}}' ticket-booking-app-green)" == "healthy" ]; do
    echo "Đang đợi container bản mới sẵn sàng..."
    sleep 2
done
```

### Bước 5: Cập nhật cấu hình Caddyfile & Reload

Thay đổi file cấu hình `Caddyfile` chạy HTTP-only (để tránh lỗi Redirect Loop do SSL được quản lý bởi Cloudflare ở Edge):

```caddy
http://ticketbooking.ngxc.io.vn {
    reverse_proxy ticket-booking-app-green:3000
}
```

Sau đó reload Caddy:

```bash
docker compose exec -w /etc/caddy caddy caddy reload
```

### Bước 6: Tắt và dọn dẹp bản cũ

Tắt và xóa container bản cũ:

```bash
docker stop ticket-booking-app-blue
docker rm ticket-booking-app-blue
```

---

## III. CÂU HỎI PHỎNG VẤN THƯỜNG GẶP VỀ ZERO-DOWNTIME

### Q1: Caddy reload cấu hình mới như thế nào mà không gây ngắt kết nối?

- **Trả lời:** Caddy hoạt động theo mô hình hướng sự kiện (Event-driven). Khi nhận lệnh `reload`, tiến trình Caddy cũ vẫn giữ nguyên các socket kết nối cũ để hoàn tất việc gửi/nhận dữ liệu của các request đang chạy dở. Cùng lúc đó, một tiến trình mới được sinh ra để nhận cấu hình mới và bắt đầu lắng nghe các request mới đến. Khi các kết nối cũ hoàn tất hoàn toàn, Caddy mới tắt hẳn luồng xử lý cũ.

### Q2: Tại sao phải chạy HTTP-only cho Caddy khi dùng Cloudflare Tunnel?

- **Trả lời:** Cloudflare Tunnel đã thực hiện giải mã SSL (SSL Termination) tại Edge của Cloudflare và chuyển tiếp traffic an toàn về máy ảo dưới dạng HTTP. Nếu Caddy cũng bật chế độ HTTPS tự động, nó sẽ cố gắng redirect HTTP sang HTTPS hoặc tự sinh chứng chỉ Let's Encrypt. Điều này sẽ dẫn đến lỗi lặp chuyển hướng (Redirect Loop) và lỗi rate-limit của Let's Encrypt.

### Q3: Tại sao không trỏ thẳng Cloudflare Tunnel vào NestJS App (port 3000) mà phải qua Caddy làm gì?

- **Trả lời:**
  > \*"Dạ, việc dùng Caddy làm Reverse Proxy đứng trước NestJS mang lại các lợi ích lớn sau:
  >
  > 1. **Zero-Downtime Deployment:** Caddy đóng vai trò chuyển mạch (switch) cực nhanh qua lệnh reload. Nếu trỏ Tunnel trực tiếp vào NestJS container, khi deploy bản mới, ta sẽ phải sửa cấu hình Tunnel trên VM và khởi động lại dịch vụ Tunnel, gây gián đoạn kết nối của khách hàng.
  > 2. **Tách biệt tĩnh/động (Static/Dynamic):** Caddy phục vụ file tĩnh (ảnh, CSS, JS) trực tiếp từ đĩa với tốc độ cực nhanh, giải phóng tài nguyên CPU/RAM cho NestJS chỉ tập trung xử lý logic API.
  > 3. **Bảo mật và CORS:** Caddy là nơi cấu hình tập trung các header bảo mật, giới hạn kích thước upload và CORS trước khi request chạm tới NestJS."\*
