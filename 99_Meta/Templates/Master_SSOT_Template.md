---
tags: [type/guide, type/strategy, topic/backend, topic/productivity]
status: permanent
date: <% tp.file.creation_date("YYYY-MM-DD") %>
aliases:
  - Master [Domain] SSOT
  - [Domain] Strategy Compass
description: "Single Source of Truth (SSOT), Active Workbench, Evergreen Fundamentals, and Roadmap Checklist for [Domain]."
---

# Master [Domain] SSOT & Strategy Compass

## TL;DR

- **Sứ mệnh SSOT**: [Single Source of Truth và trung tâm điều phối toàn bộ lộ trình phát triển cho Domain]
- **Mục tiêu trọng tâm**: [Cột mốc / vai trò / chỉ số năng lực kỹ thuật cụ thể cần đạt]
- **Kỷ luật thực thi**: [Evidence-First, Zero Fluff, 100% nghiệm thu bằng mã nguồn và số liệu đo đạc thực tế]

---

## 1. Strategic Intent & Active Sprint Workbench

_Khu vực điều phối hành động - Khi mất phương hướng, nhìn vào đây đầu tiên để kéo tiêu điểm về bài toán hiện tại:_

### A. North Star & Timeline

- **Target Role**: [Mục tiêu vị trí hoặc cột mốc sự nghiệp cụ thể kèm deadline].
- **Key Metrics**:
  - [Chỉ số kỹ thuật 1: Throughput, Latency, SLA].
  - [Chỉ số kỹ thuật 2: Concurrency, Reliability, Test Coverage].
  - [Chỉ số kỹ thuật 3: Architecture Boundaries, Maintainability].

### B. Current Active Sprint (Work in Progress)

- [/] **[Project / Module 1]**: [Mô tả bài toán và nhiệm vụ cụ thể đang cày trong tuần].
- [/] **[Project / Module 2]**: [Mô tả bài toán và nhiệm vụ cụ thể đang cày trong tuần].
- [/] **Daily Technical Discipline**: [Kỷ luật giải thuật, ôn tập Anki hoặc thực hành code].

---

## 2. The 4 Evergreen Knowledge Pillars (Active Progression)

_Cây lộ trình tri thức - Đánh dấu `[x]` khi đã nghiệm thu, `[/]` khi đang code thực chiến, `[ ]` cho link chờ nghiên cứu sâu:_

### Pillar 1: [Under-the-Hood & Core Mechanics]

- **Foundations & Theory**:
  - [ ] [[Existing_Or_Placeholder_Atomic_Note_1]]
  - [ ] [[Existing_Or_Placeholder_Atomic_Note_2]]
- **Engine & Runtime Internals**:
  - [ ] [[Existing_Or_Placeholder_Atomic_Note_3]]

### Pillar 2: [Architecture & Clean Code]

- **Principles & Paradigms**:
  - [ ] [[Existing_Or_Placeholder_Atomic_Note_4]]
- **Modular Boundaries & Design Patterns**:
  - [ ] [[Existing_Or_Placeholder_Atomic_Note_5]]

### Pillar 3: [Storage, Scale & Concurrency]

- **Data Internals & Indexing**:
  - [ ] [[Existing_Or_Placeholder_Atomic_Note_6]]
- **Reliability & Distributed Patterns**:
  - [ ] [[Existing_Or_Placeholder_Atomic_Note_7]]

### Pillar 4: [Quality, Verification & Observability]

- **Testing & Verification SOPs**:
  - [ ] [[Existing_Or_Placeholder_Atomic_Note_8]]
- **Diagnostics & Profiling**:
  - [ ] [[Existing_Or_Placeholder_Atomic_Note_9]]

---

## 3. Diagnostic & Root Cause Analysis Toolkit

_Khi hệ thống gặp sự cố, tuyệt đối không restart mù quáng. Tuân thủ quy trình truy vết đến tận cùng:_

| Hiện Tượng / Sự Cố            | Công Cụ Chẩn Đoán Cấp Thấp             | Mục Tiêu Phân Tích                         | Placeholder Atomic Note             |
| :---------------------------- | :------------------------------------- | :----------------------------------------- | :---------------------------------- |
| **High CPU / CPU Spike**      | CPU Profiler, Flamegraphs              | Định vị hàm chiếm dụng chu kỳ CPU cao nhất | [ ] [[CPU_Profiling_Guide]]         |
| **Memory Leak / OOM**         | Heap Profiler, Heap Snapshot, GC Trace | Tìm đối tượng không được giải phóng        | [ ] [[Memory_Leak_Profiling_Guide]] |
| **Slow I/O / Blocked Thread** | Syscall Tracer (`strace`), I/O Monitor | Truy vết system call bị nghẽn              | [ ] [[Syscall_IO_Profiling_Guide]]  |

---

## 4. Engineering Craftsmanship & Decision Protocols

1. **KISS & Anti-Overengineering (Keep It Simple, Stupid)**:
   - Tối giản hóa giải pháp kỹ thuật, ưu tiên vắt kiệt hiệu năng và tài nguyên đơn nút/kiến trúc hiện tại trước khi gia tăng độ phức tạp.
   - [ ] [[KISS_in_System_Design]]
2. **"Show, don't tell" Mindset (Evidence-First)**:
   - Mọi quyết định kỹ thuật phải được chứng minh bằng số liệu thực nghiệm (Benchmarks, Metrics, Hardware footprint).
   - [ ] [[Performance_Benchmarking_SOP]]
3. **Technical Design Documentation (RFC / ADR)**:
   - Trình bày đề xuất kiến trúc rõ ràng: mô tả bài toán, các phương án thay thế, và phân tích các điểm đánh đổi (_Trade-offs_).
   - [ ] [[ADR_RFC_Standards]]

---

## 5. Definition of Done (Tiêu Chuẩn Đóng Gói Tri Thức)

Một chủ đề hoặc tính năng chỉ được đánh dấu `[x]` khi thỏa mãn đồng thời 3 điều kiện:

1. **Codebase Execution**: Triển khai trực tiếp trên mã nguồn thật, vượt qua 100% test suites, không có lỗi tiềm ẩn.
2. **Empirical Measurement**: Đo đạc được số liệu thực tế (Throughput, Latency, Resource footprint).
3. **Atomic Synthesis**: Tạo ít nhất 1 Atomic Note chuẩn cấu trúc đúc kết nguyên lý under the hood và trade-offs, chuyển trạng thái `[ ]` thành `[x]` ở Mục 2.

---

## Related Notes

- [[00_Dashboard]]
- [[000_Methods_MOC]]
- [[000_Tech_MOC]]
