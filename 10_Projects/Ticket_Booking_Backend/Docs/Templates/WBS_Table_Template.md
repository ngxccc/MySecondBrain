---
title: Work Breakdown Structure (WBS) Table Skeleton Template
tags:
  - type/template
  - topic/wbs
docType: template
date: 2026-07-25
---

# Sơ Đồ Phân Rã Chức Năng (Work Breakdown Structure - WBS)

Bảng dưới đây phân rã chi tiết cấu trúc từ Module (L1) $\rightarrow$ Component (L2) $\rightarrow$ Logic (L3) $\rightarrow$ Output Artifact/Code (L4):

| Mã WBS    | Thành Phần / Chức Năng             | Phân Cấp (Level)  | Mô Tả Chi Tiết / Nhiệm Vụ                          | Output / Artifact                   |
| :-------- | :--------------------------------- | :---------------- | :------------------------------------------------- | :---------------------------------- |
| **1.0**   | **[Tên Module]**                   | **L1: Module**    | Mô tả phạm vi module tổng thể                      | `src/modules/[module-name]`         |
| **1.1**   | **[Tên Feature/Component]**        | **L2: Component** | Mô tả chức năng / API endpoint                     | `[HTTP_METHOD] /api/[endpoint]`     |
| **1.1.1** | **[Tên Guard / Middleware / DTO]** | **L3: Logic**     | Xử lý xác thực, phân quyền hoặc validate payload   | `src/common/guards/[guard].ts`      |
| 1.1.1.1   | Sub-task 1                         | L4: Execution     | Trích xuất token / validate field                  | `src/...`                           |
| 1.1.1.2   | Sub-task 2                         | L4: Execution     | Ánh xạ thông báo lỗi i18n                          | `src/i18n/{en,vi}/...`              |
| **1.1.2** | **[Tên Service / Crypto]**         | **L3: Logic**     | Xử lý nghiệp vụ chính và mã hóa dữ liệu            | `src/modules/[module]/[service].ts` |
| 1.1.2.1   | Sub-task 1                         | L4: Execution     | So sánh / Hash mật khẩu / Calculate business rules | `src/common/utils/[util].ts`        |
| 1.1.2.2   | Sub-task 2                         | L4: Execution     | Kiểm tra điều kiện nghiệp vụ phụ                   | `src/modules/[module]/...`          |
| **1.1.3** | **[Data Layer & Transaction]**     | **L3: Logic**     | Thao tác cơ sở dữ liệu và giao dịch nguyên tử      | `src/database/schemas/...`          |
| 1.1.3.1   | Sub-task 1                         | L4: Execution     | Thực thi Single DB Insert / Update                 | `src/database/schemas/[schema].ts`  |
| 1.1.3.2   | Sub-task 2                         | L4: Execution     | Ghi bản ghi Outbox / Delete session (Transaction)  | `src/database/schemas/...`          |
| **1.1.4** | **[Security & Rate Limiting]**     | **L3: Logic**     | Bảo vệ chống Bruteforce & Spam                     | `ThrottlerGuard`                    |
| 1.1.4.1   | Sub-task 1                         | L4: Execution     | Giới hạn tần suất gọi API per IP/User              | `@Throttle(...)`                    |
