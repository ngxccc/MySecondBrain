---
tags: [type/concept, topic/psychology, topic/decision-making]
date: 2026-07-14
aliases:
  [
    Confirmation Bias,
    Thiên kiến xác nhận,
    Thành kiến chứng thực,
    Thành kiến xác nhận,
  ]
description: "Thiên kiến xác nhận - Lỗi tư duy chỉ tập trung tìm kiếm thông tin ủng hộ niềm tin sẵn có và bác bỏ bằng chứng trái chiều."
---

# Confirmation Bias

## TL;DR

Thiên kiến xác nhận (Confirmation Bias) là lỗi tư duy khi chúng ta chỉ chủ động tìm kiếm, ghi nhớ và diễn giải thông tin theo cách ủng hộ hoặc xác nhận các niềm tin, giả định sẵn có của bản thân, đồng thời phớt lờ hoặc bác bỏ những bằng chứng đi ngược lại.

---

## Context: When to apply?

Hiểu và nhận diện mô hình này để tự cảnh tỉnh bản thân trong các tình huống:

- **Good for:**
- Ra các quyết định lớn như đầu tư tài chính, chọn kiến trúc công nghệ cho dự án, hoặc tuyển dụng nhân sự.
- Tranh luận, thảo luận nhóm và giải quyết xung đột ý kiến trong đội ngũ phát triển.
- Phân tích dữ liệu, tìm lỗi hệ thống (debugging) hoặc kiểm thử phần mềm (tránh việc chỉ viết test cho luồng chạy thành công - Happy Path).
- **Bad for:**
- Các quyết định khẩn cấp đòi hỏi phản xạ tức thì hoặc các hoạt động cần dựa hoàn toàn vào trực giác thể chất.
- **Phân tầng Maslow phù hợp**: **Tầng 2 (Safety - Nhận diện để tránh quyết định sai lầm hủy hoại an toàn)** và **Tầng 4/5 (Esteem & Self-Actualization)**.
- **Điều kiện tiên quyết**: Đòi hỏi tâm trí ở trạng thái tương đối bình ổn. Khi ở trạng thái hoảng loạn sinh tồn (Tầng 1/2 bị đe dọa), Amygdala sẽ khiến Thiên kiến xác nhận tăng cực đại như một cơ chế phòng thủ tâm lý vô thức.

---

## The Mechanics

Bộ não con người có xu hướng tự nhiên là duy trì sự nhất quán trong nhận thức để tránh trạng thái **Bất hòa nhận thức (Cognitive Dissonance)** — cảm giác khó chịu xảy ra khi ta đối mặt với các thông tin phủ nhận niềm tin hiện tại của mình.

Thiên kiến xác nhận vận hành thông qua 3 cơ chế cốt lõi:

1. **Tìm kiếm thiên lệch (Biased Search):** Chỉ tìm kiếm những bằng chứng củng cố cho giả thuyết mình thích. _Ví dụ: Lập trình viên chỉ tìm kiếm từ khóa "Next.js benefits" thay vì "Remix vs Next.js comparison"._
2. **Diễn giải thiên lệch (Biased Interpretation):** Diễn giải các dữ liệu mơ hồ theo hướng có lợi cho niềm tin có sẵn. _Ví dụ: Thấy log hệ thống bị lỗi kết nối, lập tức kết luận là lỗi nhà mạng bên thứ ba chứ không nghĩ là do lỗi logic code do mình tự viết._
3. **Ghi nhớ thiên lệch (Biased Memory):** Trí nhớ có xu hướng lưu giữ các lần dự đoán đúng và nhanh chóng quên đi những lần dự đoán sai hoặc các thông tin trái chiều.

---

## Practical Implementation

Để giảm thiểu tác động của Thiên kiến xác nhận trong nghiên cứu và công việc, hãy áp dụng các kỹ thuật sau:

1. **Chủ động tìm kiếm bằng chứng phủ định (Disconfirming Evidence):**
   - Thay vì hỏi: _"Làm sao để chứng minh giải pháp của tôi đúng?"_
   - Hãy hỏi: _"Tôi cần tìm dữ liệu nào để chứng minh giải pháp của mình là hoàn toàn sai?"_ (Cách tiếp cận khoa học của Karl Popper - Falsificationism).
2. **Kỹ thuật Đội Đỏ (Red Teaming / Devil's Advocate):**
   - Trong các buổi thiết kế hệ thống, phân công ít nhất một thành viên đóng vai trò phản biện, cố tình tìm ra các kịch bản lỗi, các giả định ngầm chưa được kiểm chứng của đề xuất.
3. **Tách biệt vai trò kiểm thử (Separation of Testing Concerns):**
   - Để kỹ sư QA/QC hoặc đồng nghiệp viết test case độc lập với người viết code. Điều này ngăn việc lập trình viên tự viết test để "xác nhận" code mình chạy đúng.
4. **Nhật ký quyết định (Decision Journaling):**
   - Ghi lại các giả định ban đầu trước khi triển khai: _Tại sao tôi chọn giải pháp này? Tôi tin vào điều gì? Điều gì xảy ra sẽ chứng minh tôi sai?_ Nó giúp ngăn chặn tình trạng tự lừa dối khi đánh giá lại kết quả sau này.

---

## Anti-Patterns

- **Hiểu lầm:** Nghĩ rằng có thể loại bỏ hoàn toàn thiên kiến xác nhận ra khỏi não bộ.
  - **Thực tế:** Thiên kiến là cơ chế vận hành tự nhiên giúp não tiết kiệm năng lượng. Thay vì cố gắng triệt tiêu nó trong đầu, hãy thiết lập các quy trình bên ngoài (như Code Review, Double-Blind Testing, Red Teaming) để kiểm soát nó một cách có hệ thống.
- **Hiểu lầm:** Nghi ngờ mọi suy nghĩ của bản thân dẫn đến tê liệt quyết định (Analysis Paralysis).
  - **Thực tế:** Bạn vẫn cần hành động dựa trên các giả định. Áp dụng triết lý _"Strong opinions, weakly held"_ — tin tưởng vào lập luận hiện tại dựa trên dữ liệu tốt nhất đang có, nhưng sẵn sàng thay đổi ngay lập tức khi xuất hiện bằng chứng mới đáng tin cậy hơn.

---

**Related Notes:**

- Bản đồ khái niệm tâm lý học: [[000_Concepts_MOC]]
- Bản đồ rèn luyện tư duy: [[Top_University_Mindset]]
- Kỹ thuật đặt câu hỏi sâu: [[Socratic_Questioning_Method]]
- Lỗi chọn lọc tương tự: [[Swimmers_Body_Illusion]]
- Khung phân cấp nhận thức toàn diện: [[Cognitive_Stack_Framework]]
