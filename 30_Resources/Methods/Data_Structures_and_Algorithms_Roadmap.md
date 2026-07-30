---
tags: [type/method, topic/dsa, topic/learning]
date: 2026-07-28
aliases:
  [
    DSA Roadmap,
    Lộ trình Thuật toán và Cấu trúc Dữ liệu,
    Practical DSA Curriculum,
  ]
---

# Data Structures and Algorithms Roadmap

## TL;DR

Lộ trình học Cấu trúc Dữ liệu & Thuật toán (DSA) cải tiến được phân tầng theo **Giá trị Thực chiến & Mục đích Kỹ nghệ** thay vì cày LeetCode dàn phẳng. Khung lộ trình chia làm 3 Tầng: **Tầng 1 (Kỹ nghệ Thực chiến)** phục vụ 90% công việc lập trình hệ thống hàng ngày, **Tầng 2 (Tư duy Mẫu & Phỏng vấn)** giúp chinh phục các vòng phỏng vấn kỹ thuật bằng 8 Dạng Mẫu (Patterns), và **Tầng 3 (Hệ thống Chuyên sâu)** dành cho phát triển Core Engine, Database và Compiler.

---

## Core Concept

### Limitations of Standard Roadmaps (Phân tích Nhược điểm Lộ trình Phổ biến)

Khảo sát các lộ trình phổ biến hiện nay như **NeetCode 150** và **roadmap.sh**:

1. **Quá tập trung vào Phỏng vấn (Interview-Centric):** Liệt kê danh sách phẳng 18 chủ đề (từ Arrays đến 2D Dynamic Programming) nhưng thiếu bối cảnh ứng dụng thực tế trong hệ thống phần mềm.
2. **Gây ngợp nhận thức (Cognitive Overload):** Buộc người học dành hàng tuần làm các bài toán học thuật ít ứng dụng thực tế (như _Longest Common Subsequence_ hay _Bit Manipulation_ nâng cao) trong khi chưa nắm được cách thiết kế B-Tree Index hay LRU Cache trong Production.

---

## Practical Implementation

---

## The 3-Tier Practical DSA Roadmap (Lộ trình 3 Tầng Cải tiến)

```
[Tầng 1: Lập trình Thực chiến (Production & Systems)]
        ↓
[Tầng 2: Tư duy Mẫu & Phỏng vấn (Interview Mastery)]
        ↓
[Tầng 3: Chuyên sâu Hệ thống & Học thuật (Deep Systems)]
```

### 🟢 TẦNG 1: Thuật toán Kỹ nghệ Thực chiến (Production & Systems Engineering - MUST HAVE)

> **Mục tiêu:** Nắm vững các Cấu trúc Dữ liệu & Thuật toán xuất hiện trong 90% ứng dụng thực tế (Backend, Database, Caching, Build Tools). Mọi Senior Engineer đều phải thành thạo.

- **Hash Table / Hash Map & Hash Set ($O(1)$ Lookup):**
  - _Ứng dụng:_ Caching (Redis), Session Storage, Indexing trong Database, Deduplication.
  - _Golang Mapping:_ `map[K]V` (Non-thread-safe), `sync.Map` (Thread-safe cho luồng đọc nhiều).
- **Arrays, Strings & In-place Memory Management:**
  - _Ứng dụng:_ Xử lý chuỗi, đọc ghi file, Buffer trong Network I/O, tối ưu Spatial Locality cho CPU Cache.
  - _Golang Mapping:_ Slice (`len`, `cap`, backing array), `bytes.Buffer`, `strings.Builder`.
- **Trees & Indexing (B-Tree / LSM-Tree):**
  - _Ứng dụng:_ Cơ chế tìm kiếm dữ liệu hàng triệu bản ghi trong PostgreSQL, MySQL (B-Tree) hay MongoDB, Cassandra (LSM-Tree).
- **Graph & Duyệt Đồ thị (Topological Sort / Dependency Graph):**
  - _Ứng dụng:_ Quản lý phụ thuộc Package (npm, pip), Build Tools (Turborepo, Vite, Webpack), tính toán DAGs trong Airflow.
- **LRU Cache (Doubly Linked List + Hash Map):**
  - _Ứng dụng:_ Thiết kế bộ nhớ đệm Cache memory (Browser cache, API response cache).
  - _Golang Mapping:_ Tự viết bằng `map[string]*Node` + Doubly LinkedList bọc qua `sync.RWMutex`.

---

### 🟡 TẦNG 2: Tư duy Mẫu & Phỏng vấn Tech (Interview Pattern Mastery - HIGH VALUE)

> **Mục tiêu:** Giải quyết 95% các bài toán phỏng vấn Coding (Big Tech & Startups) dựa trên **8 Dạng Mẫu (Patterns)** thay vì giải từng bài riêng lẻ:

1. **Two Pointers & Sliding Window:**
   - _Dạng bài:_ Mảng/chuỗi liên tục, tìm chuỗi con dài nhất/ngắn nhất thỏa điều kiện.
2. **Fast & Slow Pointers (Floyd's Cycle Detection):**
   - _Dạng bài:_ Phát hiện chu kỳ (Cycle) trong Linked List hoặc mảng.
3. **Binary Search & Search Space Reduction:**
   - _Dạng bài:_ Tìm kiếm trên mảng đã sắp xếp hoặc tìm giá trị $X$ tối ưu trong khoảng xác định.
4. **BFS / DFS (Breadth-First & Depth-First Search):**
   - _Dạng bài:_ Duyệt cây (Tree Traversal), tìm đường đi ngắn nhất trên đồ thị không trọng số (BFS), tìm tất cả đường đi (DFS).
5. **Top-K / Heap / Priority Queue:**
   - _Dạng bài:_ Tìm K phần tử lớn nhất/nhỏ nhất, hàng đợi ưu tiên.
6. **Backtracking (Quay đống / Thử và sai):**
   - _Dạng bài:_ Tìm tất cả tổ hợp, chỉnh hợp, bài toán Sudoku, N-Queens.
7. **Dynamic Programming 1D / 2D (Quy hoạch động):**
   - _Dạng bài:_ Bài toán tối ưu (Max/Min) hoặc Đếm số cách có bài toán con gối lên nhau. Tiếp cận theo _Memoization_ (Top-down) trước khi chuyển sang _Tabulation_ (Bottom-up).

---

### 🔴 TẦNG 3: Chuyên sâu Hệ thống & Học thuật (Deep Systems & Niche - ADVANCED)

> **Mục tiêu:** Dành cho kỹ sư phát triển Database Engines, Compilers, Game Engines, Network Protocols hoặc thi đấu thuật toán.

- **Trie (Prefix Tree):** Tối ưu tính năng Autocomplete, Search Bar gợi ý từ khóa.
- **Segment Tree & Fenwick Tree:** Xử lý truy vấn dải số (Range Queries) biến đổi liên tục.
- **Union-Find / Disjoint Set Union (DSU):** Phát hiện chu trình trong đồ thị trọng số, phân cụm (Clustering).
- **Shortest Path Algorithms (Dijkstra, Bellman-Ford):** Tìm đường đi ngắn nhất có trọng số (Google Maps, Routing Protocols).

---

## Effective Learning Methodology (Phương pháp Học Đúng đắn)

1. **Không gõ lại code mẫu (Avoid Rote Copying):** Tránh "Ảo tưởng về sự hiểu biết" (Illusion of Competence).
2. **Chu trình 4 bước:**
   - _Bước 1:_ Mô phỏng thủ công trên giấy (Visual & Dry Run).
   - _Bước 2:_ Nắm vững Nguyên tắc Bất biến (Algorithm Invariant).
   - _Bước 3:_ Tự code từ con số 0 (Blank Slate Coding) & Tự Debug.
   - _Bước 4:_ Thử thách trường hợp biên (Edge Cases) và làm bài tập biến thể.

---

## Related Notes

- [[First_Principles_Thinking]]
- [[Herbert_Simon_Learning_Method]]
- [[Top_University_Mindset]]
- [[Systems_Thinking]]
- [[Critical_Thinking_Models]]
