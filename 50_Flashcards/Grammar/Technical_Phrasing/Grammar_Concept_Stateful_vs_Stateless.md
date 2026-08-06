---
noteId: 1785417091628
---

What is the terminology distinction between **Stateful** and **Stateless** architecture?

---

- **Formula / Pattern**:
  - `Stateless`: `inherently stateless` (HTTP protocol)
  - `Stateful`: `maintain session state` (Session / Cookies)
- **Core Explanation**:
  - `Stateless` (Vô trạng thái): Mỗi request hoàn toàn độc lập, server không lưu bộ nhớ về client. `Stateful` (Có trạng thái): Server duy trì thông tin client giữa các request.
- **Usage & Anchor Cues**:
  - `Stateless API` / `Stateful Session`
- **Concrete Examples**:
  - _`REST APIs are designed to be stateless.`_ (Các REST API được thiết kế theo dạng vô trạng thái.)
  - _`Session state makes the web application stateful.`_ (Trạng thái session khiến ứng dụng web trở nên có trạng thái.)
