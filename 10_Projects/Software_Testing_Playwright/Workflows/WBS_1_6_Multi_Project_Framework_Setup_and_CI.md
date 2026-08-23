---
tags: [type/method, topic/project-management, layer/quality]
status: permanent
date: 2026-08-18
description: Technical architecture, multi-project configuration specification, and Definition of Done for WBS 1.6 - Framework Setup and CI Pipeline
---

# WBS 1.6: Multi-Project Framework Setup and CI Pipeline

## Metadata

- **WBS Code:** `1.6`
- **Task Name:** Thiết Lập Khung Kiểm Thử Multi-Project, TypeScript & CI Pipeline
- **Assignee:** Trần Văn Ngọc (MSSV: 0306241131)
- **Task Weight:** `2.0%`
- **Deliverable Artifacts:** File `playwright.config.ts`, `package.json`, `.github/workflows/playwright.yml` trong repository `software-testing-playwright`, PR #1 pass base command.

## TL;DR

Tài liệu đặc tả kỹ thuật cho Trưởng nhóm khởi tạo cấu trúc repository kiểm thử chuẩn công nghiệp, cấu hình Playwright Multi-Project phân tách rõ ràng các tầng `api` (Headless microsecond execution), `chromium` / `e2e` (Browser execution), và `smoke` (Healthcheck baseline), thiết lập biến môi trường `.env`, cấu hình TypeScript và xây dựng pipeline tự động hóa CI/CD trên GitHub Actions.

## Core Architectural Blueprint

### 1. Cấu Trúc Thư Mục Repository Chuẩn Mực (`software-testing-playwright`)

```text
software-testing-playwright/
├── .github/
│   └── workflows/
│       └── playwright.yml         # CI/CD pipeline
├── tests/                         # Root test directory (Playwright testDir)
│   ├── api/                       # API Test Suite (WBS Phase 2)
│   │   ├── auth.spec.ts
│   │   ├── booking.spec.ts
│   │   ├── concurrency.spec.ts
│   │   └── rfc9457_throttling.spec.ts
│   ├── e2e/                       # Web UI Test Suite (WBS Phase 3)
│   │   ├── checkout.spec.ts
│   │   ├── network_mock.spec.ts
│   │   ├── glitch_diagnostics.spec.ts
│   │   └── visual_regression.spec.ts
│   └── smoke/                     # Healthcheck Baseline
│       └── smoke.spec.ts
├── fixtures/                      # Custom Fixtures mở rộng từ test.extend()
│   ├── api.fixture.ts
│   └── auth.fixture.ts
├── pages/                         # Page Object Model (POM & COM) cho Web UI
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   └── CheckoutPage.ts
├── schemas/                       # Zod validation schemas (chống Contract Drift)
│   └── rfc9457.schema.ts
├── utils/                         # Helper functions, data generators
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

### 2. Cấu Hình Multi-Project trong `playwright.config.ts`

```typescript
import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["list"],
  ],

  projects: [
    {
      name: "api",
      testMatch: /.*tests\/api\/.*\.spec\.ts/,
      use: {
        baseURL:
          process.env.API_BASE_URL ||
          "https://ticket-booking-amqv.onrender.com",
        extraHTTPHeaders: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    },
    {
      name: "chromium",
      testMatch: /.*tests\/e2e\/.*\.spec\.ts/,
      use: {
        baseURL: process.env.WEB_BASE_URL || "https://www.saucedemo.com",
        ...devices["Desktop Chrome"],
        trace: "on-first-retry",
        screenshot: "only-on-failure",
        video: "retain-on-failure",
      },
    },
    {
      name: "smoke",
      testMatch: /.*tests\/smoke\/.*\.spec\.ts/,
      use: {
        baseURL: process.env.WEB_BASE_URL || "https://www.saucedemo.com",
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
```

### 3. GitHub Actions CI Workflow (`.github/workflows/playwright.yml`)

```yaml
name: Playwright Tests CI

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  test:
    timeout-minutes: 30
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: lts/*
      - name: Install dependencies
        run: npm ci || bun install
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps chromium
      - name: Run Playwright tests
        run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 14
```

---

## Acceptance Criteria & Definition of Done (DoD Checklist)

- [ ] **Khởi Tạo Repository & Dependencies:**
  - [ ] Khởi tạo hoàn tất thư mục `software-testing-playwright/` với cấu trúc `tests/api/`, `tests/e2e/`, `fixtures/`, `pages/`, `schemas/`.
  - [ ] Cài đặt đầy đủ các package: `@playwright/test`, `typescript`, `zod`, `dotenv`.
- [ ] **Cấu Hình Multi-Project:**
  - [ ] Cấu hình `playwright.config.ts` với `testDir: './tests'` và các project `api`, `chromium`, `smoke`.
  - [ ] Chạy thử lệnh `npx playwright test --list` hiển thị đầy đủ danh sách test thuộc 2 project.
- [ ] **Tích Hợp CI/CD:**
  - [ ] File `.github/workflows/playwright.yml` được push lên GitHub và kích hoạt thành công khi có Pull Request.
- [ ] **Bàn Giao & Phân Quyền:**
  - [ ] Cung cấp tài liệu mẫu cho 6 thành viên còn lại clone repo và chạy thử lệnh ban đầu thành công.

## Related Notes

- [[WBS_Detailed_Acceptance_Criteria_and_DoD]]
- [[Team_Work_Breakdown_and_Contribution_Matrix_Template]]
- [[Distributed_CI_CD_Sharding_and_Blob_Report_Merging]]
- [[000_Software_Testing_Playwright_MOC]]
