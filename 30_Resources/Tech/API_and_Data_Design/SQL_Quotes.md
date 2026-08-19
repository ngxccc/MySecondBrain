---
tags: [type/concept, topic/tech, topic/database, layer/infrastructure]
date: 2026-06-07
aliases: [Dấu nháy trong SQL, SQL Quotes, Single vs Double Quotes SQL]
description: "Phân biệt dấu nháy đơn (String Literals) và nháy kép (Identifiers) trong SQL."
---

# SQL Quotes: Identifiers vs String Literals

## TL;DR

Phân biệt sử dụng dấu nháy đơn và nháy kép trong SQL: Nháy đơn `''` dùng cho giá trị chuỗi (String Literals), nháy kép `""` dùng cho tên thực thể (Identifiers như tên cột, tên bảng).

## Core Concept

Trong SQL chuẩn (ANSI SQL):

1. **Dấu nháy đơn (`'value'`)**:
   - Mục đích: Khai báo một chuỗi ký tự (String literal).
   - Ví dụ: `SELECT * FROM users WHERE username = 'ngxc';` ('ngxc' là giá trị chuỗi).
2. **Dấu nháy kép (`"column"`)**:
   - Mục đích: Xác định một định danh (Identifier) như tên cột, tên bảng khi chúng chứa ký tự đặc biệt, trùng với từ khóa hệ thống, hoặc phân biệt hoa thường.
   - Ví dụ: `SELECT "first name" FROM "users";` ("first name" là tên cột có dấu cách).

## Related Notes

- Tổng quan thiết kế API & Dữ liệu: [[000_Tech_MOC]]
