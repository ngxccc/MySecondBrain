---
tags: [type/concept, topic/finance, topic/math]
date: 2026-06-23
aliases: [Công thức Kelly, Kelly Criterion, Kelly Formula, Tỷ lệ Kelly]
description: "Tối ưu hóa quy mô vị thế vốn trong đầu tư tài chính."
---

# Kelly Criterion

## TL;DR

Công thức Kelly (Kelly Criterion) là một mô hình toán học dùng để xác định quy mô vị thế (position sizing) tối ưu cho một chuỗi các khoản đầu tư hoặc cá cược, nhằm tối đa hóa tốc độ tăng trưởng tài sản dài hạn (geometric growth rate) thông qua việc tối đa hóa kỳ vọng của hàm logarit tài sản.

## Core Concept

Công thức Kelly hoạt động dựa trên nguyên lý tối đa hóa kỳ vọng tăng trưởng dài hạn thay vì lợi nhuận ngắn hạn, đồng thời giảm thiểu rủi ro phá sản (risk of ruin).

### 1. Công thức Kelly cho trường hợp phân phối rời rạc

Áp dụng cho các giao dịch hoặc trò chơi có kết quả nhị phân (chỉ có thắng hoặc thua):

$$f^* = \frac{bp - q}{b} = \frac{p(b+1) - 1}{b}$$

Trong đó:

- **$f^*$**: Tỷ lệ phần trăm tối ưu của tổng vốn để phân bổ vào giao dịch này.
- **$p$**: Xác suất thắng ($0 \le p \le 1$).
- **$q$**: Xác suất thua ($q = 1 - p$).
- **$b$**: Tỷ lệ cược ròng (net odds), nghĩa là nếu thắng bạn nhận được $b$ lần số tiền đã đặt cược (ví dụ: cược 1 ăn 2 thì $b = 2$).

### 2. Công thức Kelly cho trường hợp phân phối liên tục

Áp dụng trong thị trường tài chính (cổ phiếu, danh mục đầu tư) dưới giả định chuyển động Brownian hình học (Geometric Brownian Motion):

$$f^* = \frac{\mu}{\sigma^2}$$

Trong đó:

- **$\mu$**: Tỷ suất sinh lời vượt mức kỳ vọng (expected excess return) so với lãi suất phi rủi ro.
- **$\sigma^2$**: Phương sai của tỷ suất sinh lời vượt mức đó.

Đối với danh mục nhiều tài sản (multivariate continuous Kelly):
$$f^* = \Sigma^{-1} \mu$$
Với $\Sigma$ là ma trận hiệp phương sai của các tài sản và $\mu$ là vector lợi nhuận vượt mức kỳ vọng.

### 3. Fractional Kelly

Trong thực tế, việc sử dụng "Full Kelly" ($f = 1$) dẫn đến biến động tài sản cực kỳ lớn (volatility) và rủi ro sụt giảm tài sản nghiêm trọng (drawdown). Nhà đầu tư chuyên nghiệp thường áp dụng **Fractional Kelly**:

$$f_{\text{frac}} = \lambda \cdot f^* \quad (0 < \lambda < 1)$$

- **Half-Kelly ($\lambda = 0.5$):** Đặt cược $50\%$ tỷ lệ khuyến nghị của Kelly.
- **Mối quan hệ phi tuyến giữa tăng trưởng và tỷ lệ đặt cược:**
  Tốc độ tăng trưởng vượt mức kỳ vọng $g(\lambda f^*)$ liên hệ với tốc độ tăng trưởng tối đa của Full Kelly $g^*$ theo công thức:
  $$g(\lambda f^*) = \lambda(2 - \lambda) g^*$$
  - Với **Half-Kelly ($\lambda = 0.5$)**, nhà đầu tư giữ lại được $0.5 \times (2 - 0.5) = 75\%$ tốc độ tăng trưởng của Full Kelly.
  - Trong khi đó, biến động (volatility/standard deviation) của danh mục giảm đi một nửa ($50\%$), giúp hạn chế đáng kể các pha sụt giảm tài sản cực hạn và tăng tính ổn định tâm lý.

### 4. Shannon's Demon

Một ứng dụng kinh điển của tư duy Kelly trong việc tái cân bằng danh mục đầu tư (portfolio rebalancing) được phát triển bởi Claude Shannon:

- **Kịch bản:** Giả sử có một tài sản biến động ngẫu nhiên (chuyển động đi ngang, không có xu hướng tăng trưởng dài hạn, kỳ vọng sinh lời dài hạn bằng 0) và một lượng tiền mặt.
- **Chiến thuật:** Định kỳ tái cân bằng danh mục để luôn duy trì tỷ lệ **50% tài sản rủi ro và 50% tiền mặt** (tương ứng với mức phân bổ tối ưu theo Kelly cho loại tài sản đi ngang nhưng có độ biến động cao).
- **Kết quả:** Bằng cách liên tục bán ra khi tài sản tăng giá và mua vào khi tài sản giảm giá để giữ vững tỷ lệ 50/50, danh mục tổng thể sẽ tăng trưởng dương theo cấp số nhân trong dài hạn. Đây là minh chứng thực tế cho việc tạo ra lợi nhuận bền vững chỉ nhờ quản trị quy mô vị thế và kỷ luật tái cân bằng.

## Concrete Examples

### Ví dụ 1: Cá cược nhị phân

- **Kịch bản:** Tung một đồng xu không đồng chất có xác suất thắng $p = 60\%$ ($0.6$), thua $q = 40\%$ ($0.4$). Nếu thắng, ăn tỷ lệ ròng $b = 1$ (cược $1$ ăn $1$).
- **Tính toán Full Kelly:**
  $$f^* = \frac{1 \times 0.6 - 0.4}{1} = 0.2 \quad (20\%)$$
  Nhà đầu tư nên đặt cược đúng $20\%$ số vốn hiện tại cho mỗi lần tung đồng xu.
- **Tính toán Half-Kelly:**
  $$f_{\text{half}} = 0.5 \times 20\% = 10\%$$

### Ví dụ 2: Vị thế cổ phiếu

- **Kịch bản:** Một cổ phiếu công nghệ có tỷ suất sinh lời vượt mức kỳ vọng hàng năm $\mu = 10\%$ ($0.10$) và độ lệch chuẩn $\sigma = 20\%$ ($0.20$), tương ứng với phương sai $\sigma^2 = 0.04$.
- **Tính toán Full Kelly:**
  $$f^* = \frac{0.10}{0.04} = 2.5$$
  Hệ thống khuyên bạn nên sử dụng đòn bẩy $2.5\times$ vốn tự có để mua cổ phiếu này.
- **Tính toán Half-Kelly:**
  $$f_{\text{half}} = 0.5 \times 2.5 = 1.25 \quad (\text{Đòn bẩy } 1.25\times)$$

### Ví dụ 3: Script Python mô phỏng các chiến lược đặt cược

Dưới đây là mã Python mô phỏng tài sản sau 100 lần tung đồng xu lệch ($p=0.6$, $b=1$) với các tỷ lệ cược khác nhau:

```python
import numpy as np

def simulate_path(p, b, fraction, steps=100, init_capital=100):
    capital = init_capital
    for _ in range(steps):
        bet = capital * fraction
        if np.random.rand() < p:
            capital += bet * b  # Thắng
        else:
            capital -= bet      # Thua
        if capital <= 0:
            return 0
    return capital

# Chạy mô phỏng 10,000 lần cho 3 chiến lược:
# 1. Half-Kelly (10%): Tăng trưởng ổn định, sụt giảm tài sản thấp.
# 2. Full Kelly (20%): Tăng trưởng cao nhất dài hạn nhưng biến động cực kỳ lớn.
# 3. Overbetting : Kỳ vọng dài hạn âm, có nguy cơ cháy tài khoản rất cao.
```

---

## Practical Implementation

Mặc dù có cơ sở toán học vững chắc, công thức Kelly có những giới hạn và yêu cầu kỷ luật nghiêm ngặt khi áp dụng vào thực tế đầu tư tài chính:

- **Overbetting (Đặt cược quá tay):** Nếu đặt cược lớn hơn mức Kelly tối ưu ($f > f^*$), tốc độ tăng trưởng dài hạn sẽ sụt giảm. Nếu đặt cược vượt quá hai lần mức Kelly khuyến nghị ($f > 2f^*$), tốc độ tăng trưởng kỳ vọng sẽ âm và dẫn đến phá sản chắc chắn (certain ruin) trong dài hạn.
- **Sai số ước lượng (Estimation Error):** Trong thực tế, các biến số $p$, $b$, $\mu$, $\sigma^2$ là ước lượng lịch sử hoặc kỳ vọng cá nhân, không bao giờ hoàn hảo. Việc phóng đại biên an toàn hoặc đánh giá quá cao xác suất thắng sẽ dẫn đến overbetting. Do đó, Half-Kelly hoặc Quarter-Kelly luôn được ưu tiên để tạo biên an toàn chống lại sai số mô hình.
- **Giả định tĩnh (Stationarity):** Công thức Kelly giả định thị trường có các thuộc tính thống kê không đổi theo thời gian. Thực tế, biến động thị trường thay đổi liên tục (non-stationarity), đòi hỏi phải cập nhật định kỳ ma trận hiệp phương sai và lợi nhuận kỳ vọng.

---

**Related Notes:**

- Phương pháp tích sản định kỳ bảo vệ vốn: [[Dollar_Cost_Averaging]]
- Tâm lý gồng lỗ và chi phí cơ hội: [[Opportunity_Cost_Hold]]
