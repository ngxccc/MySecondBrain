---
tags:
  [
    type/guide,
    type/strategy,
    topic/backend,
    topic/career,
    topic/productivity,
    topic/architecture,
    topic/system-design,
    layer/architecture,
    layer/core-mechanics,
    layer/infrastructure,
    layer/quality,
  ]
status: permanent
date: 2026-08-16
aliases:
  - Master Backend Engineering SSOT
  - Backend Engineering Mastery Pipeline
  - Backend Engineering Mastery SSOT
  - Evergreen Software Engineering Fundamentals
description: "Single Source of Truth (SSOT), Active Workbench, 4 Evergreen Fundamentals, Diagnostic Protocols, and 4-Layer Cognitive Roadmap for Backend & Software Engineers."
---

# Master Backend Engineering SSOT & Strategy Compass

## TL;DR

Tài liệu này là **Single Source of Truth (SSOT)** và **Interactive Command Center** định hình toàn bộ lộ trình phát triển năng lực, tư duy kiến trúc, và tiêu chuẩn kỹ nghệ cho Backend & Software Engineering. Được xây dựng dựa trên triết lý kỹ nghệ của các kỹ sư huyền thoại (_Salvatore Sanfilippo (antirez)_, _Mitchell Hashimoto_, _Fabrice Bellard_, _Martin Fowler_): **Giá trị cốt lõi đến từ độ sâu kiến trúc, khả năng giải quyết bài toán phức tạp bằng giải pháp tối giản (KISS), và sự thấu hiểu bản chất cách hệ thống vận hành under the hood.**

---

## 1. Strategic Intent & Active Sprint Workbench

_Khu vực điều phối hành động - Khi mất phương hướng, nhìn vào đây đầu tiên để kéo tiêu điểm về bài toán hiện tại:_

### A. North Star & Timeline

- **Target Role**: Offer Backend Developer chính thức (Node.js, NestJS, Go, PostgreSQL, Redis, System Design) trước ngày **06/12/2026**.
- **CV Golden Metrics**:
  - Throughput & Latency: `RPS > 1,500 req/sec` dưới `p95 Latency < 45ms` trên dự án Ticket Booking Backend.
  - Concurrency Control: 100% Zero Race Condition chứng minh qua Asynchronous Socket Flooding & Redis Redlock.
  - Architecture Boundaries: Phân tách ranh giới rõ ràng theo Modular Monolith và Clean Architecture, triệt tiêu Circular Dependency.
  - Automated Verification: Đạt chuẩn Playwright Automation Testing (CDP/IPC, Contract Drift, JSON Schema).

### B. Current Active Sprint (Work in Progress)

- [x] Tích hợp và chuẩn hóa toàn bộ hệ thống Second Brain theo tiêu chuẩn SSOT.
- [/] **Ticket Booking Backend**: Hoàn thiện kịch bản k6 Load Test, đo RPS/Latency và đóng gói số liệu vào CV.
- [/] **Software Testing Coursework**: Hoàn thiện toàn diện dự án Playwright Automation Testing (16 bài phân tích kiến trúc).
- [/] **Daily Technical Discipline**: 1 bài LeetCode Medium/ngày (15 Patterns) + Ôn 20 thẻ Anki (`50_Flashcards/`).

---

## 2. The 4 Evergreen Knowledge Pillars (Active Progression)

_Cây lộ trình 4 tầng nhận thức - Đánh dấu `[x]` khi đã nghiệm thu, `[/]` khi đang code thực chiến, `[ ]` cho link chờ nghiên cứu sâu:_

### Pillar 1: Under-the-Hood, Networking & Low-Level Runtime (Layer 1)

#### Computer Science & Memory Execution

- [x] [[Stack_vs_Heap_Memory_Fundamentals]]
- [x] [[Garbage_Collection_Fundamentals]]
- [x] [[Memory_Leaks_Core_Mechanics]]
- [x] [[Dynamic_Array_Exponential_Growth]]
- [x] [[Heap_Memory_Size_Classes_and_Alignment]]

#### JavaScript Engine & V8 Internals

- [x] [[JS_Stack_vs_Heap_Memory]]
- [x] [[JS_Generational_Garbage_Collection]]
- [x] [[JS_Memory_Leaks_and_Mitigation]]
- [x] [[JS_V8_Hidden_Classes_Inline_Caching]]
- [x] [[JS_Destructuring]]
- [x] [[AST_ESLint]]
- [x] [[JS_Temporal_API]]
- [x] [[JS_Immer_Immutable_State]]

#### Go Runtime & Memory Mechanics

- [x] [[Go_Slice_Underlying_Mechanics]]
- [x] [[Go_Array_Vs_Slice_Distinction]]
- [x] [[Go_Escape_Analysis_Mechanics]]

#### Type Systems & Compilers

- [x] [[TS_Type_System_Structural_Type_Erasure]]
- [x] [[TS_Distributive_Conditional_Types]]
- [x] [[TS_Type_Utilities_Omit_Pick_Exclude]]
- [x] [[TS_Decorators]]
- [x] [[Tree_Shaking]]

#### Low-Level Networking & I/O Multiplexing

- [ ] [[TCP_Handshake_and_Connection_Lifecycle]]
- [x] [[Client_Side_Encryption]]
- [ ] [[TLS_SSL_Handshake_Mechanics]]
- [ ] [[HTTP_Protocol_Evolution_HTTP1_HTTP2_HTTP3]]
- [ ] [[WebSockets_vs_gRPC_Streaming]]
- [ ] [[Event_Loop_and_IO_Multiplexing_Epoll]]
- [x] [[Serverless_Architecture]]
- [x] [[Edge_Computing]]
- [x] [[NextJS_after_API]]

---

### Pillar 2: Architecture, Boundaries & Clean Code (Layer 2)

#### Architecture Principles & Paradigms

- [x] [[Clean_Architecture]]
- [x] [[SOLID_Principles]]
- [x] [[Domain_Driven_Design]]
- [x] [[Layered_Architecture]]
- [x] [[MVC_Pattern]]

#### Modular Monolith & Boundary Rules

- [x] [[Modular_Monolith_Architecture]]
- [x] [[Shared_Module_Dependency_Rule]]
- [x] [[Circular_Dependency]]
- [x] [[Public_Interface_Pattern]]
- [x] [[Unified_Fullstack_vs_Split_Architecture]]

#### Design Patterns

- [x] [[Dependency_Injection]]
- [x] [[Interface_Driven_Design]]
- [x] [[Repository_Pattern_vs_Fat_Service]]
- [x] [[DI_WinForms_Components]]

#### System Design Frameworks

- [x] [[System_Design_Architecture_Roadmap]]
- [x] [[Problem_Driven_System_Design_Framework]]
- [x] [[Newsfeed_Architecture_Fanout]]

---

### Pillar 3: Database Internals, Storage & Distributed Systems (Layer 3)

#### Database Storage Engine & Indexing

- [x] [[Index_BPlusTree]]
- [x] [[Database_Indexing_Guidelines]]
- [x] [[Left_Prefix_Index_Postgres]]
- [x] [[Partial_Index]]
- [x] [[Prepare_Statements]]
- [x] [[N_Plus_1_Query_Problem]]
- [x] [[Postgres_18_New_Features]]
- [x] [[Timestamp_vs_Timestamptz]]
- [x] [[Junction_Table]]
- [x] [[DB_Naming]]
- [x] [[SQL_Quotes]]
- [ ] [[Postgres_WAL_and_Storage_Engine]]
- [ ] [[Database_Transaction_Isolation_and_MVCC]]

#### Concurrency & Distributed Locking

- [x] [[Postgres_Select_For_Update_Pessimistic_Locking]]
- [x] [[Redis_Redlock]]

#### In-Memory Systems & Caching Architecture

- [x] [[RFC_Trending_Cache]]
- [ ] [[Redis_Data_Structures_and_Memory_Optimization]]
- [ ] [[Cache_Stampede_Penetration_Avalanche_Mitigation]]

#### Messaging, Streaming & Reliability Patterns

- [x] [[Outbox_Pattern]]
- [x] [[Multi_Layer_Rate_Limiting_DDoS_Prevention]]
- [ ] [[Rate_Limiting_Token_Bucket_and_Sliding_Window]]
- [ ] [[Circuit_Breaker_Pattern]]
- [ ] [[Exponential_Backoff_with_Jitter]]
- [ ] [[Message_Broker_vs_Event_Streaming_Kafka_RabbitMQ]]
- [ ] [[Message_Ordering_and_Exactly_Once_Processing]]

#### Distributed Systems & Consensus

- [ ] [[CAP_Theorem_and_PACELC_Framework]]
- [ ] [[Distributed_Consensus_Raft_and_Paxos]]
- [ ] [[Consistent_Hashing_Distributed_Load_Balancing]]
- [ ] [[Saga_Pattern_Distributed_Transactions]]
- [ ] [[Two_Phase_Commit_Protocol]]

#### API & Pagination Strategies

- [x] [[API_Versioning_Strategies]]
- [x] [[Cursor_Pagination]]

#### Benchmarking & Infrastructure Ops

- [x] [[Postgres_SQL_Performance_Benchmarking_Guide]]
- [x] [[Go_Benchmarking_and_Allocation_Guide]]
- [x] [[Local_Stress_Testing_Benchmark]]
- [x] [[Turborepo]]
- [x] [[Trust_Proxy_Configuration]]
- [x] [[Tmux_Session_Window_Pane]]

---

### Pillar 4: Quality, Verification & Full-Stack Observability (Layer 4)

#### Testing Foundations & ISTQB Standards

- [x] [[7_Principles_of_Testing]]
- [x] [[Error_Defect_Failure]]
- [x] [[Test_Case]]
- [x] [[SDLC_Methodologies_Evolution]]

#### Test Design Techniques

- [x] [[Black_Box_Testing_Techniques]]
- [x] [[White_Box_Testing_Techniques]]
- [x] [[Equivalence_Partitioning]]

#### SDLC Models & Engineering SOPs

- [x] [[Waterfall]]
- [x] [[V_Model]]
- [x] [[Prototype_Model]]
- [x] [[Spiral_Model]]
- [x] [[Agile_Scrum]]
- [x] [[Agile_Management_via_GitHub]]
- [x] [[Standard_Project_Timeline_SOP]]

#### Automated Verification Frameworks

- [x] [[Automated_Verification_System_Framework]]
- [x] [[Test_Driven_Design]]

#### Playwright Protocol-Level Automation Suite

- [x] [[Browser_Automation_IPC_Fundamentals]]
- [x] [[Chrome_DevTools_Protocol_Mechanics]]
- [x] [[WebDriver_vs_CDP_Architectural_Comparison]]
- [x] [[Browser_Context_Isolation]]
- [x] [[APIRequestContext_vs_Browser_Engine]]
- [x] [[RFC_9457_Problem_Details_and_API_Boundary_Testing]]
- [x] [[Automated_JSON_Schema_and_Contract_Drift_Validation]]
- [x] [[Asynchronous_Socket_Flooding_and_Race_Condition_Testing]]
- [x] [[API_Test_Data_Lifecycle_and_State_Isolation]]
- [x] [[Hybrid_Auth_and_Storage_State_Injection]]
- [x] [[Role_Based_Locators_and_Accessibility_Tree]]
- [x] [[Playwright_Auto_Waiting_and_Actionability_Checks]]
- [x] [[Network_Interception_and_Mocking_Mechanics]]
- [x] [[Playwright_Trace_Viewer_and_Post_Mortem_Diagnostics]]
- [x] [[Page_Object_Model_and_Component_Architecture]]
- [x] [[Service_Object_Model_and_API_Request_Chaining]]

#### Full-Stack Observability & Tracing

- [ ] [[OpenTelemetry_Distributed_Tracing]]
- [ ] [[Prometheus_Metrics_and_Alerting]]

---

## 3. Diagnostic & Root Cause Analysis Toolkit

_Khi hệ thống gặp sự cố (High CPU, Memory Leak, Timeout, Deadlock), tuyệt đối không restart mù quáng. Tuân thủ quy trình truy vết đến tận cùng:_

| Hiện Tượng / Sự Cố                    | Công Cụ Chẩn Đoán Cấp Thấp             | Mục Tiêu Phân Tích                                    | Target Atomic Note                                  |
| :------------------------------------ | :------------------------------------- | :---------------------------------------------------- | :-------------------------------------------------- |
| **High CPU / CPU Spike**              | `pprof`, CPU Profiler, Flamegraphs     | Định vị hàm chiếm dụng chu kỳ CPU cao nhất            | [ ] [[Go_Pprof_and_Flamegraph_Analysis]]            |
| **Memory Leak / OOM**                 | Heap Profiler, Heap Snapshot, GC Trace | Tìm đối tượng không được giải phóng                   | [x] [[JS_Memory_Leaks_and_Mitigation]]              |
| **Slow I/O / Blocked Thread**         | Linux `strace`, `lsof`                 | Truy vết system call bị nghẽn (`epoll_wait`, `fsync`) | [ ] [[Linux_Strace_and_Syscall_Profiling]]          |
| **Network Latency / Dropped Packets** | `tcpdump`, Wireshark                   | Phân tích TCP Handshake, retransmission, reset        | [ ] [[Network_Packet_Analysis_Tcpdump_Wireshark]]   |
| **Slow Database Queries**             | `EXPLAIN (ANALYZE, BUFFERS)`           | Tìm Seq Scan, Buffer spill to disk, Index misses      | [x] [[Postgres_SQL_Performance_Benchmarking_Guide]] |

---

## 4. Engineering Craftsmanship & Decision Protocols

1. **KISS & Anti-Overengineering (Keep It Simple, Stupid)**:
   - Tuyệt đối không đưa Microservices, Kafka, hay Kubernetes vào bài toán khi 1 server đơn Postgres + Node.js/Go chưa được tối ưu hóa đến giới hạn.
   - [ ] [[KISS_and_Simplicity_in_System_Design]]
2. **"Show, don't tell" Mindset (Evidence-First)**:
   - Mọi khẳng định kỹ thuật phải được chứng minh bằng Benchmark có số liệu cụ thể ($p95/p99$ Latency, Throughput RPS, Hardware footprint).
   - [x] [[Local_Stress_Testing_Benchmark]]
3. **Technical Design Documentation (RFC / ADR)**:
   - Trình bày đề xuất kiến trúc rõ ràng: mô tả bài toán, các phương án thay thế, và phân tích sâu các điểm đánh đổi (_Trade-offs_: Consistency vs Latency, Cost vs Velocity).
   - [ ] [[Architecture_Decision_Record_ADR_Standard]]
   - [ ] [[RFC_Design_Document_Framework]]
4. **Open Source & Technical Writing**:
   - Tự tay xây dựng các công cụ thực tế và duy trì thói quen viết Engineering Post-mortems và Code Walkthroughs.
   - [ ] [[Open_Source_Contribution_and_Tooling_Guide]]
   - [ ] [[Engineering_Post_Mortem_Writing_Guide]]

---

## 5. Definition of Done (Tiêu Chuẩn Đóng Gói Tri Thức)

Một chủ đề hoặc tính năng chỉ được đánh dấu `[x]` khi thỏa mãn đồng thời 3 điều kiện:

1. **Codebase Execution**: Triển khai trực tiếp trên mã nguồn thật, vượt qua 100% test suites, không có lỗi tiềm ẩn.
2. **Empirical Measurement**: Đo đạc được số liệu thực tế (`p95/p99 Latency`, `Throughput RPS`, `Memory/CPU Footprint`).
3. **Atomic Synthesis**: Tạo ít nhất 1 Atomic Note chuẩn cấu trúc đúc kết nguyên lý under the hood và trade-offs, chuyển trạng thái `[ ]` thành `[x]` ở Mục 2.

---

## Related Notes

- [[System_Design_Architecture_Roadmap]]
- [[Problem_Driven_System_Design_Framework]]
- [[Postgres_SQL_Performance_Benchmarking_Guide]]
- [[Automated_Verification_System_Framework]]
- [[English_Learner_Profile]]
- [[00_Dashboard]]
- [[000_Methods_MOC]]
- [[000_Tech_MOC]]
