# Class-Validator Rules & Optional/Required Field Semantics

**Topic**: NestJS & Class-Validator Payload Validation  
**Date**: 2026-07-28  
**Category**: Validation & API Contracts  
**Path**: `second-brain/Docs/Booking/Class_Validator_Optional_Required_Semantics.md`

---

## 1. Core Rule: Default Required Behavior

In `class-validator` (when evaluated by NestJS `ValidationPipe`):

- **Without `@IsOptional()`**: A field is **Required** by default.
- If the payload omits the field (`undefined` or missing key), `ValidationPipe` rejects the request with `400 Bad Request`.

---

## 2. How `@IsOptional()` Operates

```typescript
export class ReserveSeatsDto {
  @IsUUID("7")
  showId!: string; // <-- Required field

  @IsOptional()
  @IsString()
  voucherCode?: string; // <-- Optional field
}
```

1. **When `voucherCode` is omitted or `null` / `undefined`**:
   - `@IsOptional()` intercepts the property and skips all downstream validators (`@IsString()`).
   - The DTO passes validation cleanly.
2. **When `voucherCode` is provided (e.g. `"VOUCHER50"`)**:
   - `@IsOptional()` passes control to downstream validators.
   - `@IsString()` validates that the provided value is a valid string.

---

## 3. NestJS `ValidationPipe` Configuration Safeguards

In `main.ts`, the global `ValidationPipe` should enforce strict payload rules:

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true, // Strip un-decorated properties
    forbidNonWhitelisted: true, // Reject requests with unknown extra properties
    transform: true, // Auto-transform payloads to DTO class instances
  }),
);
```

---

## 4. Summary Table

| Field Decorator Pattern           | Payload Value         | Validation Result                           |
| :-------------------------------- | :-------------------- | :------------------------------------------ |
| `@IsUUID("7")` (No `@IsOptional`) | Omitted / `undefined` | ❌ **400 Bad Request** (Field required)     |
| `@IsUUID("7")` (No `@IsOptional`) | Valid UUIDv7 string   | ✅ **Pass**                                 |
| `@IsOptional()` + `@IsString()`   | Omitted / `undefined` | ✅ **Pass** (Skipped)                       |
| `@IsOptional()` + `@IsString()`   | `12345` (Number)      | ❌ **400 Bad Request** (Failed `@IsString`) |
