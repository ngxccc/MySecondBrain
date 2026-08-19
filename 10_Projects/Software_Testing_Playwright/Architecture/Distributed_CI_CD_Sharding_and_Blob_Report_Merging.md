---
tags: [type/concept, topic/testing, layer/quality]
status: permanent
date: 2026-08-14
description: Distributed test sharding across CI matrix runners, blob reporting architecture, and unified HTML report merging in Playwright
---

# Distributed CI CD Sharding and Blob Report Merging

## TL;DR

Khi một dự án phần mềm đạt quy mô hàng ngàn bài test E2E/API, việc chạy tuần tự hoặc chạy song song trên một máy chủ đơn lẻ sẽ kéo dài thời gian CI/CD lên hàng tiếng đồng hồ. Playwright giải quyết bài toán nghẽn cổ chai này bằng cơ chế **Distributed Sharding** (phân mảnh bài test theo cờ `--shard=x/y`) chạy song song trên hàng chục máy ảo phân tán, kết hợp với định dạng báo cáo nhị phân **Blob Reporter** để gom (merge) toàn bộ kết quả thành một file HTML Report duy nhất trong bước CI cuối cùng.

## Distributed Sharding & Blob Merging Pipeline

```text
                                [GitHub Actions Matrix CI]
                                             │
         ┌───────────────────────────────────┼───────────────────────────────────┐
         ▼                                   ▼                                   ▼
[Runner 1: Shard 1/3]               [Runner 2: Shard 2/3]               [Runner 3: Shard 3/3]
npx playwright test --shard=1/3     npx playwright test --shard=2/3     npx playwright test --shard=3/3
(Chạy 33% bài test)                 (Chạy 33% bài test)                 (Chạy 33% bài test)
         │                                   │                                   │
         ▼                                   ▼                                   ▼
blob-report-1.zip                   blob-report-2.zip                   blob-report-3.zip
         │                                   │                                   │
         └───────────────────────────────────┼───────────────────────────────────┘
                                             │
                             (Upload to CI Artifacts Storage)
                                             │
                                             ▼
                             [Merge Step: Máy Runner Tổng Hợp]
                             npx playwright merge-reports ./all-blobs
                                             │
                                             ▼
                               ┌───────────────────────────┐
                               │ Unified HTML Report       │
                               │ (100% Tests, Traces, Video│
                               └───────────────────────────┘
```

## How Deterministic Sharding Works

Khi truyền cờ `--shard=1/4`:

1. Playwright Test Runner quét toàn bộ cây thư mục `tests/` để lập danh sách toàn bộ các test case.
2. Sử dụng thuật toán băm xác định (**Deterministic Hashing Algorithm**) trên tên file và title của test để chia đều danh sách thành $4$ phần độc lập không trùng lặp.
3. Shard 1 chỉ thực thi phần $1$, Shard 2 thực thi phần $2$, đảm bảo không có bài test nào bị chạy trùng hoặc bị bỏ sót.
4. **Tăng tốc độ tuyến tính:** Nếu test suite chạy mất 40 phút trên 1 máy, chia 4 shards sẽ hoàn thành chỉ trong **10 phút**!

## Production GitHub Actions Workflow Pattern

```yaml
# .github/workflows/playwright-matrix.yml
name: Playwright Distributed CI
on: [push, pull_request]

jobs:
  test-sharding:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shardIndex: [1, 2, 3, 4]
        shardTotal: [4]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npx playwright install --with-deps

      # Chạy phân mảnh và lưu report dưới dạng binary blob
      - run: npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}
        env:
          PLAYWRIGHT_BLOB_OUTPUT_NAME: blob-report-${{ matrix.shardIndex }}.zip

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: all-blob-reports
          path: blob-report-*.zip

  merge-reports:
    if: always()
    needs: [test-sharding]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - uses: actions/download-artifact@v4
        with: { name: all-blob-reports, path: ./all-blobs }

      # Gom tất cả blob files thành 1 HTML Report hoàn chỉnh
      - run: npx playwright merge-reports ./all-blobs --reporter=html
      - uses: actions/upload-artifact@v4
        with: { name: final-html-report, path: playwright-report }
```

## Related Notes

- [[Playwright_Trace_Viewer_and_Post_Mortem_Diagnostics]]
- [[APIRequestContext_vs_Browser_Engine]]
- [[Production_SDET_Anti_Patterns_and_Flaky_Test_Traps]]
- [[000_Software_Testing_Playwright_MOC]]
