---
tags: [type/project, type/moc, topic/testing, layer/quality]
status: permanent
date: 2026-08-14
description: Project MOC for Software Testing Coursework - Playwright Automation Testing
---

# Software Testing Playwright Project MOC

## TL;DR

Map of Content trung tâm điều hướng tiến trình nghiên cứu từ nguyên lý gốc (First Principles), thực hành kiểm thử và đúc kết các ghi chú nguyên tử (Atomic Notes) cho đồ án môn học **Kiểm thử phần mềm**.

## Objective (SMART Goal)

- **Goal:** Nắm vững bản chất cơ chế điều khiển trình duyệt và tự động hóa API thông qua **Playwright**, xây dựng bộ test thực chiến cho hệ thống `ticket-booking` và hoàn thiện các sản phẩm bàn giao môn học.
- **Scope & Strategic Directive (Theo chỉ đạo của GVHD - Thầy Nguyễn Hoàng Việt):**
  - Triển khai **cả 2 phần Demo: Web UI Automation VÀ API Automation** (tận dụng tối đa ưu thế hỗ trợ đa tầng của Playwright).
  - Áp dụng nguyên lý $20/80$ Pareto: Không chạy theo số lượng test case vụn vặt, tập trung vào các test case trọng tâm có độ bao phủ lớn và chiều sâu kiến trúc (Auth, Concurrency Redlock, Contract Drift, POM/COM Flow, Network Mocking).
- **Deliverables:**
  1. Slide thuyết trình lý thuyết và kiến trúc (`STT nhom_Slide.pptx`).
  2. Báo cáo Word chi tiết (`STT nhom_Bao cao.docx`).
  3. Video clip demo đăng tải YouTube (`STT nhom_Demo.txt`) bao gồm cả 2 phần UI & API.
  4. Báo cáo đánh giá thành viên (`STT nhom_Danh gia.docx`).

## First Principles Inquiry Tree (Cây câu hỏi bản chất)

1. **Bản chất của Automation Testing:** Tại sao một chương trình code bên ngoài lại có thể click, gõ phím và đọc dữ liệu từ một Browser Process?
2. **Kiến trúc giao tiếp:** Chrome DevTools Protocol (CDP) và WebSocket hoạt động như thế nào? Khác biệt gì so với cơ chế HTTP Proxy của Selenium?
3. **Bài toán Flaky Test & Đồng bộ (Synchronization):** Vì sao các bài test tự động hay bị chết ngẫu nhiên? Cơ chế Auto-waiting giải quyết bài toán này ở tầng nguyên tử ra sao?
4. **Cô lập trạng thái (Isolation):** Browser Context vận hành như thế nào trong RAM để cho phép test song song không bị rò rỉ session?
5. **Kiểm thử đa tầng (API vs UI):** Khi nào nên kiểm thử qua HTTP Request và khi nào bắt buộc phải render qua DOM?

## Active Domain Notes

### Stage 1A: UI Engine Mechanics

- [[Browser_Automation_IPC_Fundamentals]]
- [[Chrome_DevTools_Protocol_Mechanics]]
- [[WebDriver_vs_CDP_Architectural_Comparison]]
- [[Browser_Context_Isolation]]
- [[Playwright_Auto_Waiting_and_Actionability_Checks]]
- [[Role_Based_Locators_and_Accessibility_Tree]]
- [[Network_Interception_and_Mocking_Mechanics]]
- [[Page_Object_Model_and_Component_Architecture]]
- [[Playwright_Trace_Viewer_and_Post_Mortem_Diagnostics]]

### Stage 1B: API Engine Mechanics

- [[APIRequestContext_vs_Browser_Engine]]
- [[Hybrid_Auth_and_Storage_State_Injection]]
- [[Asynchronous_Socket_Flooding_and_Race_Condition_Testing]]
- [[RFC_9457_Problem_Details_and_API_Boundary_Testing]]
- [[API_Test_Data_Lifecycle_and_State_Isolation]]
- [[Automated_JSON_Schema_and_Contract_Drift_Validation]]
- [[Service_Object_Model_and_API_Request_Chaining]]

### Stage 2: Architectural Evaluation & Trade-offs

- [[Playwright_vs_TestComplete_Architectural_Comparison]]
- [[Playwright_vs_Cypress_Architectural_Comparison]]
- [[Playwright_vs_Selenium_and_Puppeteer_Comparison]]
- [[Playwright_Hard_Technical_Boundaries_and_Non_Goals]]
- [[Production_SDET_Anti_Patterns_and_Flaky_Test_Traps]]
- [[SauceDemo_Ecosystem_and_Selection_Rationale]]

### Stage 2 Advanced: Enterprise Specializations

- [[Visual_Regression_Testing_and_Dynamic_Data_Masking]]
- [[Automated_Accessibility_Testing_with_Axe_Core]]
- [[Distributed_CI_CD_Sharding_and_Blob_Report_Merging]]
- [[Real_Time_WebSocket_and_SSE_Mocking_Mechanics]]

### Planning & Workflows

- [Google Sheets Master WBS (Live)](https://docs.google.com/spreadsheets/d/1jc5ae9wDK6p7h40i_gdDkzsnAYVMor-UWrUUTGSdZRo/edit?usp=sharing)
- [[Team_Work_Breakdown_and_Contribution_Matrix_Template]]
- [[Group_Presentation_Deck_Structure_and_Guidelines]]

#### Phase 1: Theory & Tool Overview (25%)

- [[WBS_1_1A_Playwright_Overview_and_Code_First_Philosophy]]
- [[WBS_1_1B_WebSocket_CDP_vs_HTTP_WebDriver_Architecture]]
- [[WBS_1_2A_Auto_Waiting_and_Actionability_Checks]]
- [[WBS_1_2B_Browser_Context_Isolation_and_Memory_Optimization]]
- [[WBS_1_3A_Environment_Setup_CLI_and_Codegen]]
- [[WBS_1_3B_Playwright_UI_Mode_and_Trace_Viewer_Diagnostics]]
- [[WBS_1_4A_Web_UI_Testing_Capabilities_and_Patterns]]
- [[WBS_1_4B_API_Testing_Capabilities_and_Patterns]]
- [[WBS_1_5A_Playwright_vs_TestComplete_Comparison]]
- [[WBS_1_5B_Playwright_vs_Selenium_and_Cypress_Comparison]]
- [[WBS_1_6_Multi_Project_Framework_Setup_and_CI]]

#### Phase 2: API Automation Suite (30%)

- [[WBS_2_1_API_Auth_Lifecycle_and_Token_Rotation]]
- [[WBS_2_2_API_Concurrency_and_Redis_Redlock_Testing]]
- [[WBS_2_3_API_Booking_Transaction_and_Idempotency]]
- [[WBS_2_4_API_RFC_9457_Schema_and_Rate_Limiting]]

#### Phase 3: Web UI Automation Suite (25%)

- [[WBS_3_1_UI_Checkout_Flow_POM_and_COM]]
- [[WBS_3_2_UI_Network_Mocking_and_Error_Handling]]
- [[WBS_3_3_UI_Post_Mortem_Trace_Viewer_Diagnostics]]
- [[WBS_3_4_UI_Visual_Regression_and_Data_Masking]]

#### Phase 4: Submission Deliverables (20%)

- [[WBS_4_1A_Report_Compilation_Chapters_1_and_2]]
- [[WBS_4_1B_Report_Compilation_Chapters_3_and_4]]
- [[WBS_4_2A_Slide_Deck_Theory_and_Tooling]]
- [[WBS_4_2B_Slide_Deck_Demo_and_Synthesis]]
- [[WBS_4_3A_Video_Demo_API_Automation_Suite]]
- [[WBS_4_3B_Video_Demo_Web_UI_Automation_Suite]]

- [[Software_Testing_Life_Cycle]]
- [[Seven_Testing_Principles]]
