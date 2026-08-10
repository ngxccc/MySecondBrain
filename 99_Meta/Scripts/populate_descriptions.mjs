import fs from "node:fs";
import path from "node:path";

const descriptions = {
  // Tech MOC
  Layered_Architecture:
    "Kiến trúc N-Tier truyền thống chia theo Technical Concerns.",
  Modular_Monolith_Architecture:
    "Kiến trúc chia theo Domain/Feature (High Cohesion, Low Coupling).",
  MVC_Pattern: "Mô hình kinh điển và sự tiến hóa thành REST API hiện đại.",
  Public_Interface_Pattern: "Cổng giao tiếp an toàn giữa các module (Facade).",
  Dependency_Injection:
    "Kỹ thuật đảo ngược luồng điều khiển (IoC) để giảm tight-coupling và dễ test.",
  Shared_Module_Dependency_Rule:
    "Quy tắc mũi tên một chiều chống Circular Dependency.",
  Circular_Dependency:
    "Vòng lặp phụ thuộc tai hại giữa các module và cách giải quyết.",
  Clean_Architecture:
    "Hệ tư tưởng phân tầng kiến trúc để cô lập và bảo vệ Core Business Logic khỏi sự phụ thuộc công nghệ.",
  SOLID_Principles:
    "Bộ 5 nguyên lý vàng thiết kế hướng đối tượng giúp code modular, linh hoạt và dễ bảo trì.",
  Interface_Driven_Design:
    "Thiết kế dựa trên giao diện (contract-first) giúp các lớp lỏng lẻo và phát triển song song.",
  Test_Driven_Design:
    "Quy trình viết test trước, code sau giúp định hình kiến trúc phần mềm sạch.",
  Domain_Driven_Design:
    "Thiết kế hướng tên miền, giải quyết độ phức tạp của nghiệp vụ cốt lõi.",
  DI_WinForms_Components:
    "Kỹ thuật Dependency Injection cho Dumb, Root và Smart Child Components trong C# WinForms.",
  Newsfeed_Architecture_Fanout:
    "Thiết kế hệ thống Newsfeed tải cao bằng kiến trúc Hybrid Fan-out (Push + Pull).",
  Repository_Pattern_vs_Fat_Service:
    "So sánh giữa Repository Pattern và Fat Service (Direct ORM) trong thiết kế tầng dữ liệu.",
  Unified_Fullstack_vs_Split_Architecture:
    "Phân tích so sánh chi tiết giữa mô hình Fullstack gộp (Next.js Monorepo) và mô hình chia tách repo Backend/Frontend.",
  React_Server_Components:
    "Cơ chế render UI trên server, gửi payload tĩnh về client.",
  NextJS_Server_Actions:
    "Kỹ thuật mutate data trực tiếp từ server bằng RPC ngầm.",
  Next_Intl: "Thư viện i18n hỗ trợ strict type-safety và Server Components.",
  NextJS_16_Cache_Components:
    "Mô hình Caching component-level mới của Next.js 16 dùng chỉ thị 'use cache' và cacheLife.",
  NextJS_PPR_Platform_Support:
    "Cơ chế và cách thức các Cloud Platform hỗ trợ triển khai Partial Prerendering.",
  NextJS_ISR:
    "Cơ chế cập nhật và tái tạo các trang tĩnh ở runtime mà không cần rebuild toàn bộ site.",
  NextJS_Dynamic_Opt_Out_Connection:
    "Cơ chế ngắt Prerender tĩnh và chuyển đổi sang Dynamic Rendering ở Next.js 15/16.",
  NextJS_after_API:
    "Cơ chế lập lịch tác vụ nền không chặn (non-blocking) sau khi response đã được gửi về client.",
  NextJS_Route_Groups_and_Nested_Layouts:
    "Bản chất của Route Groups và cơ chế kế thừa layout (Nested Layouts) trong Next.js App Router.",
  NextJS_Monorepo_Package_Transpilation:
    "Cơ chế biên dịch gói nội bộ (transpilePackages) và tối ưu hóa build trong Turborepo.",
  Turborepo:
    "Công cụ xây dựng hiệu suất cao cho các dự án Monorepo sử dụng JavaScript/TypeScript.",
  WinForms_Layout_Optimization:
    "Tối ưu hóa Layout Engine của WinForms bằng SuspendLayout và ResumeLayout.",
  React_Component_Declaration_Standards:
    "Tiêu chuẩn khai báo React component (export function vs arrow function).",
  React_State:
    "Trạng thái nội bộ của component, quản lý dữ liệu động thay đổi theo thời gian.",
  React_Props:
    "Thuộc tính truyền từ component cha xuống, mang tính chất bất biến (read-only).",
  Backend_Frameworks_Comparison:
    "So sánh toàn diện giữa NestJS, Express, Fastify và ElysiaJS về hiệu năng, DX, độ tương thích và trường hợp sử dụng phù hợp.",
  Cursor_Pagination:
    "Phân trang hiệu suất cao O(1) thay thế cho Offset O(N) cồng kềnh.",
  API_Versioning_Strategies:
    "Quản lý tương thích ngược (Backward Compatibility) bằng URI hoặc Header.",
  DB_Naming:
    "Quy tắc đặt tên đồng bộ và nhất quán giữa Database (Số ít) và TypeScript ORM (Số nhiều).",
  Prepare_Statements:
    "Cơ chế truy vấn chuẩn bị trước để tối ưu hiệu năng và bảo mật SQL.",
  Outbox_Pattern:
    "Mẫu thiết kế xử lý Dual-Write tin cậy bằng bảng Outbox và Worker.",
  Partial_Index:
    "Lập chỉ mục có điều kiện giúp tiết kiệm dung lượng đĩa và tối ưu hóa ghi.",
  SQL_Quotes:
    "Phân biệt dấu nháy đơn (String Literals) và nháy kép (Identifiers) trong SQL.",
  Left_Prefix_Index_Postgres:
    "Nguyên lý Left-Prefix của Composite Index trong PostgreSQL.",
  Junction_Table:
    "Giải quyết quan hệ Nhiều-Nhiều bằng bảng liên kết và khóa chính phức hợp.",
  Timestamp_vs_Timestamptz:
    "Phân biệt timestamp và timestamptz, quy tắc Enterprise bắt buộc.",
  RFC_Trending_Cache:
    "RFC đề xuất caching realtime leaderboard bằng Redis Sorted Sets (ZSET).",
  Database_Indexing_Guidelines:
    "Hướng dẫn chi tiết khi nào dùng Index thường, Composite Index và Partial Index.",
  Index_BPlusTree:
    "Bản chất của Index, cấu trúc B+Tree và lý do tại sao Disk I/O quyết định kiến trúc Database.",
  Postgres_18_New_Features:
    "Tổng hợp các tính năng mới và cải tiến kiến trúc nhân (Meson build, AIO, Failover Slots, Radix Tree Vacuum) của PostgreSQL 18.",
  Postgres_Select_For_Update_Pessimistic_Locking:
    "Cơ chế Row-Level Exclusive Lock trong PostgreSQL chống tranh chấp đồng thời (TOCTOU / Race Condition).",
  Serverless_Architecture:
    "Hạ tầng thực thi auto-scale, không lưu state (Stateless).",
  Edge_Computing: "Đưa code ra các node CDN gần user nhất để giảm latency.",
  Torrent_CLI_Download_Tools:
    "So sánh các công cụ download torrent CLI thay thế aria2c; qBittorrent-nox là all-rounder hàng đầu cho server headless năm 2026.",
  Client_Side_Encryption: "Mã hóa LocalStorage/IndexedDB bằng thuật toán AES.",
  Offline_Sync_Queue:
    "Kỹ thuật Outbox Pattern ở phía client cho ứng dụng Offline-First.",
  Cognitive_Strain_UX: "Áp dụng tâm lý học tạo độ khó chủ đích vào UI/UX.",
  Multi_Layer_Rate_Limiting_DDoS_Prevention:
    "Chiến lược rate limit đa lớp (IP/Email) và chống DDoS/Credential Stuffing.",
  Trust_Proxy_Configuration:
    "Cấu hình tin tưởng proxy trong Express & NestJS để lấy client IP chính xác.",
  Rust_Hybrid_Roadmap:
    "Lộ trình học Rust thực chiến kết hợp hệ thống & an ninh mạng.",
  Go_Learning_Roadmap:
    "Lộ trình học Go thực chiến từ cơ bản đến microservices & production.",
  JS_Runtimes_Bun_vs_NodeJS:
    "So sánh kiến trúc runtime Bun (JavaScriptCore + Zig) vs Node.js (V8 + Libuv) và cơ chế Event Loop cốt lõi.",
  JS_Temporal_API:
    "API xử lý ngày giờ thế hệ mới chính thức của JavaScript (ECMAScript 2026).",
  JS_Stack_vs_Heap_Memory:
    "Mô hình phân tầng bộ nhớ Stack (LIFO) và Heap (Dynamic Allocation) trong JavaScript.",
  JS_Generational_Garbage_Collection:
    "Cơ chế dọn rác phân thế hệ (Generational GC) trong V8 Engine gồm Scavenger và Mark-Sweep-Compact.",
  JS_Memory_Leaks_and_Mitigation:
    "Các mô hình gây rò rỉ bộ nhớ (Memory Leaks) phổ biến trong JavaScript và phương pháp phòng ngừa.",
  JS_Immer_Immutable_State:
    "Quản lý trạng thái bất biến (Immutable State) thông qua cơ chế Copy-on-Write (COW) và ES6 Proxy, giải pháp tối ưu cho Zustand/Redux stores.",
  TS_Type_System_Structural_Type_Erasure:
    "Hệ thống kiểu cấu trúc (Structural Typing), cơ chế xóa bỏ kiểu (Type Erasure) và cách thu hẹp kiểu an toàn với Type Predicates.",
  TS_Decorators:
    "Phương pháp trang trí trong TypeScript chuẩn ES (Stage 3) vs cũ (experimentalDecorators).",
  V8_Performance_Audit:
    "Báo cáo đánh giá hiệu năng V8 Engine và Memory (Cấp phát Stack/Heap, tối ưu hóa Hidden Classes, tránh delete/spread trên hot-path).",
  TS_Distributive_Conditional_Types:
    "Cơ chế tự động xé lẻ Union Type trong các biểu thức Generic của TypeScript.",
  TS_Type_Utilities_Omit_Pick_Exclude:
    "So sánh chi tiết bản chất và phân biệt các tiện ích kiểu Omit, Pick, Exclude.",
  JS_Destructuring: "Kỹ thuật bóc tách dữ liệu mảng và đối tượng trong ES6.",
  CSharp_WinForms_Thread_Invoke:
    "Cơ chế Invoke đa luồng an toàn tránh lỗi Cross-thread trong WinForms.",
  Dotnet_10_and_11_New_Features:
    "So sánh các tính năng mới cốt lõi của .NET 10 (LTS) & .NET 11 (Preview) so với .NET 9.",
  Tree_Shaking:
    "Kỹ thuật phân tích tĩnh để loại bỏ dead code khi đóng gói Javascript.",

  // Concepts MOC
  Liquidity_Trap_Spread: "Rủi ro thanh khoản khi thị trường hoảng loạn.",
  Opportunity_Cost_Hold: "Đánh đổi giữa việc gồng lỗ và cắt lỗ.",
  Safe_Haven_Asset: "Bản chất của tài sản trú ẩn (Vàng).",
  Kelly_Criterion: "Tối ưu hóa quy mô vị thế vốn trong đầu tư tài chính.",
  Critical_Thinking_Models: "Các lăng kính lọc nhiễu thông tin.",
  Systems_Thinking:
    "Tư duy hệ thống và quy chiếu 6 lăng kính trong kỹ nghệ phần mềm.",
  Cognitive_Stack_Framework:
    "Khung phân cấp nhận thức 5 tầng đi từ bộ lọc thiên kiến đến đưa ra quyết định thực thi tối ưu.",
  Kanban_Methodology:
    "Phương pháp và bảng Kanban quản lý dòng công việc trực quan theo mô hình Kéo (Pull).",
  Swimmers_Body_Illusion: "Nhầm lẫn giữa tiêu chí chọn lọc và kết quả thực tế.",
  Confirmation_Bias:
    "Thiên kiến xác nhận - Lỗi tư duy chỉ tập trung tìm kiếm thông tin ủng hộ niềm tin sẵn có và bác bỏ bằng chứng trái chiều.",
  Product_Mindset:
    "Chuyển dịch trọng tâm từ hoàn thành dự án sang tối ưu hóa giá trị sản phẩm.",
  Customer_Outcome_Thinking:
    "Tập trung vào thay đổi hành vi tích cực của người dùng (Outcomes) thay vì tính năng (Outputs).",
  Student_Mindsets:
    "Mô hình tư duy tối ưu hóa học tập, tài chính và sự nghiệp cho sinh viên.",
  Maslow_Hierarchy_and_Brain_Structure:
    "Phân tầng thần kinh học của tháp nhu cầu Maslow theo tiến hóa não bộ (Brainstem, Limbic, PFC).",
  BATNA_Negotiation_Model:
    "Phương án thay thế tốt nhất - Điểm tựa an toàn và nguồn sức mạnh thương lượng cốt lõi.",
  ZOPA_Negotiation_Framework:
    "Vùng thỏa thuận khả thi - Khoảng không gian giao thoa ranh giới chấp nhận được giữa hai bên.",
  Principled_Negotiation_Getting_To_Yes:
    "Đàm phán nguyên tắc Harvard - Giải quyết xung đột dựa trên lợi ích cốt lõi và tiêu chí khách quan.",
  Tactical_Empathy_Chris_Voss:
    "Thấu cảm chiến thuật & Kỹ thuật đàm phán tâm lý FBI (Mirroring, Labeling, Accusation Audit).",
  Zettelkasten_Method: "Quản lý tri thức bằng Atomic Notes và Links.",
  Map_of_Content: "Nút giao thông điều hướng hệ thống.",
  PARA_Method: "Tổ chức thông tin theo mức độ hành động (Actionability).",
  Spaced_Repetition_SM2: "Thuật toán chống quên lãng bằng toán học.",
  Phonetic_Chunking: "Hack não học từ vựng bằng cách gom nhóm âm tiết.",
  Linguistic_False_Friends: "Cạm bẫy từ đồng dạng và dịch chuyển trọng âm.",
  English_Learning_Roadmap:
    "Lộ trình tự học tiếng Anh giao tiếp và chuyên ngành hàng ngày.",
  Herbert_Simon_Learning_Method:
    "Phương pháp nhận thức dựa trên chunking và deliberate practice để thành thạo kỹ năng mới.",
  Evan_Wallace_Path:
    "Con đường phát triển sự nghiệp của Evan Wallace (Figma CTO, esbuild creator) – chuyên môn sâu graphics/WebGL + timing + execution.",
  Error_Defect_Failure:
    "Định nghĩa và chu kỳ lỗi nhầm lẫn, lỗi sai sót, và sự cố phần mềm theo chuẩn ISTQB.",
  "7_Principles_of_Testing":
    "7 nguyên lý kiểm thử phần mềm nền tảng định hình hoạt động kiểm định.",
  Black_Box_Testing_Techniques:
    "Kỹ thuật kiểm thử hộp đen tập trung vào phân vùng tương đương (EP) và phân tích giá trị biên (BVA).",
  White_Box_Testing_Techniques:
    "Kỹ thuật kiểm thử hộp trắng tập trung vào độ phủ dòng lệnh và độ phủ nhánh/quyết định.",
  Test_Case:
    "Khái niệm cơ bản về kịch bản kiểm thử và 3 bước cấu thành cốt lõi.",
  Equivalence_Partitioning:
    "Kỹ thuật phân hoạch tương đương chia miền dữ liệu thành các tập rời nhau để tối ưu số lượng test case.",

  // Methods MOC
  First_Principles_Thinking:
    "Phá vỡ vấn đề thành các hạt nguyên tử sự thật để tìm giải pháp đột phá từ con số 0.",
  Socratic_Questioning_Method:
    "Bộ 6 câu hỏi truy vấn để bóc mẽ các giả định (assumptions) ngầm và tránh bị dắt mũi.",
  Top_University_Mindset:
    "Lộ trình rèn luyện tư duy phản biện, giải quyết vấn đề và truy vết nguồn gốc thông tin theo tiêu chuẩn đại học top đầu.",
  Mental_Model_Automation_Method:
    "Quy trình 4 bước Deliberate Practice chuyển hóa các mô hình tư duy từ System 2 thành phản xạ System 1 tự động khi đối thoại.",
  Standard_Project_Timeline_SOP:
    "Quy trình 16 tuần tiêu chuẩn (Hybrid SDLC) để build đồ án/project từ số 0 đến lúc deploy và bảo vệ thành công.",
  Agile_Scrum:
    "Quy trình quản lý và phát triển phần mềm linh hoạt thông qua các chu kỳ ngắn (Sprints) và cải tiến quy trình liên tục.",
  Agile_Management_via_GitHub:
    "Hướng dẫn cấu hình và quy trình vận hành Kanban Board, Sprints bằng GitHub Projects & Issues.",
  WBS_Best_Practices:
    "Phương pháp phân rã công việc WBS chuẩn PMBOK (PMI) và cách phân rã task cá nhân.",
  Vim_Shortcuts: "Các phím tắt và câu lệnh thay thế vùng nâng cao trong Vim.",
  Local_Stress_Testing_Benchmark:
    "SOP thiết lập kịch bản và tư duy stress test an toàn trên máy local.",
  STAR_Method_Tech:
    "Framework kể chuyện (Situation-Task-Action-Result) để flex kinh nghiệm mượt mà trong các vòng phỏng vấn hành vi (Behavioral Interview).",
  IELTS_Simon_Writing_Method:
    "Chiến thuật làm bài thi IELTS Writing đơn giản và mạch lạc để đạt band score cao.",
  Dollar_Cost_Averaging:
    "Chiến thuật trung bình giá để triệt tiêu tâm lý FOMO/Panic, biến việc đầu tư thành một Cron Job tự động vô tri.",
  Short_Term_Income_and_Defensive_Saving:
    "Chiến lược tăng thu nhập ngắn hạn và xây dựng quỹ khẩn cấp phòng thủ ở tầng nhu cầu sinh tồn/an toàn.",
};

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (file.endsWith(".md")) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const resourcesDir = path.join(process.cwd(), "30_Resources");
const allNoteFiles = getAllFiles(resourcesDir);

let updatedCount = 0;

for (const filePath of allNoteFiles) {
  const baseName = path.basename(filePath, ".md");
  const desc = descriptions[baseName];
  if (!desc) continue;

  let content = fs.readFileSync(filePath, "utf8");

  // Check if YAML frontmatter exists
  if (content.startsWith("---")) {
    const endYaml = content.indexOf("---", 3);
    if (endYaml !== -1) {
      const frontmatter = content.slice(0, endYaml);
      // Check if description already exists
      if (!frontmatter.includes("description:")) {
        const cleanDesc = desc.replace(/"/g, '\\"');
        const newFrontmatter = frontmatter + `description: "${cleanDesc}"\n`;
        content = newFrontmatter + content.slice(endYaml);
        fs.writeFileSync(filePath, content, "utf8");
        updatedCount++;
        console.log(`Updated frontmatter in: ${baseName}`);
      }
    }
  }
}

console.log(`Done! Added description to ${updatedCount} note files.`);
