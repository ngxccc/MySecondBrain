# Concurrency Control: Micro-Collisions, Redlock Parameters & Retry Trade-offs

**Topic**: High-Concurrency Ticket Booking System Design  
**Date**: 2026-07-28  
**Category**: Distributed Systems & Database Concurrency  
**Path**: `second-brain/Docs/Booking/Concurrency_Control_Micro_Collisions_And_Retry_Tradeoffs.md`

---

## 1. Context & Problem Statement

In flash-sale cinema ticketing applications, thousands of users click to select the exact same seat (e.g., Seat `A12` at Showtime `S99`) at the exact same millisecond.

A naive implementation causes two failure modes:

1. **Double-Booking / Overselling**: Two transactions read the seat as `available` concurrently and both set it to `reserved`.
2. **Poor User Experience (False Rejections)**: If the system rejects a request immediately on the first microsecond lock failure, users whose requests arrived only 1ms apart get instantly rejected, even if the leading transaction fails a split-second later.

---

## 2. Distinction: Memory Lock vs Business Reservation

| Dimension          | RAM Lock (Redis Redlock)                                | Business Seat Reservation                   |
| :----------------- | :------------------------------------------------------ | :------------------------------------------ |
| **Storage**        | In-Memory (Redis RAM)                                   | Relational Database (`show_seats` table)    |
| **Duration (TTL)** | **2000 ms (2 seconds)**                                 | **10 minutes (600,000 ms)**                 |
| **Purpose**        | Protects the DB execution window during transaction     | Protects user payment window                |
| **Life Cycle**     | Automatically deleted upon DB commit in `finally` block | Cleared by BullMQ delayed job / Cron worker |

---

## 3. The Micro-Collisions Problem

When Request A and Request B arrive $1\text{ms}$ apart:

- **Without Retries (`retryCount: 0`)**: Request B fails instantly. If Request A drops network connection or aborts $2\text{ms}$ later without booking, Request B was rejected unnecessarily.
- **With Micro-Retries (`retryCount: 3`)**: Request B waits a tiny window ($200\text{ms}$). If Request A finishes or releases the lock, Request B acquires the lock seamlessly without the user noticing any lag.

---

## 4. Retry Strategy Trade-off Matrix

| Strategy                                 | User Experience (UX)                                              | System & Connection Load                                       | Verdict                     |
| :--------------------------------------- | :---------------------------------------------------------------- | :------------------------------------------------------------- | :-------------------------- |
| **`retryCount: 0` (No Retry)**           | ❌ Poor. High false rejection rate for 1ms race conditions.       | ✅ Lowest (Instant Fail-Fast).                                 | Unsuitable for flash sales. |
| **`retryCount: 10` (Excessive Retry)**   | ❌ Poor. User sees spinner for 5 seconds before error.            | ❌ High risk of worker thread & DB connection pool exhaustion. | Dangerous under load.       |
| **`retryCount: 3`, `retryDelay: 200ms`** | ✅ Optimal. Absorbs 99% of microsecond race collisions in <600ms. | ✅ Safe. Strict upper bound prevents connection starvation.    | **Production Standard**     |

---

## 5. Redlock Configuration Parameter Reference

```typescript
this.redlock = new Redlock([this.redisClient], {
  driftFactor: 0.01, // 1% Clock Drift Ratio
  retryCount: 3, // Max retries before throwing 409
  retryDelay: 200, // Base delay between retries (ms)
  retryJitter: 50, // Random jitter window 0-50ms
  automaticExtensionThreshold: 500, // Extension threshold (ms)
});
```

### Parameter Breakdown

1. **`driftFactor: 0.01`**: Accounts for hardware clock drift between Redis and Node.js servers:
   $$\text{Lock TTL Valid} = \text{TTL} - (\text{TTL} \times \text{driftFactor}) - \text{Time Elapsed}$$
2. **`retryCount: 3`**: Upper boundary preventing thread hanging while resolving micro-collisions.
3. **`retryDelay: 200`**: Base sleep window between retry attempts.
4. **`retryJitter: 50`**: Adds pseudo-random variation ($200\text{ms} \pm [0 \dots 50\text{ms}]$) to prevent **Thundering Herd Problem** (synchronized retry storms).
5. **`automaticExtensionThreshold: 500`**: Auto-renews memory lock if DB transaction runtime approaches lock expiry.

---

## 6. Double-Locking Defense In Depth Architecture

```
Client Request
      │
      ▼
┌──────────────────────────┐
│  Redis Redlock (RAM)     │  <-- Layer 1: Fast rejection (<5ms)
│  TTL: 2000ms, Retries: 3 │
└─────────────┬────────────┘
              │ Success
              ▼
┌──────────────────────────┐
│ PostgreSQL Transaction   │  <-- Layer 2: Hard invariant guarantee
│ SELECT ... FOR UPDATE    │      Pessimistic lock on `show_seats`
└─────────────┬────────────┘
              │ Commit
              ▼
┌──────────────────────────┐
│ BullMQ Delayed Job       │  <-- Layer 3: Expiration cleanup
│ Delay: 10 minutes        │      Reverts `reserved` -> `available`
└──────────────────────────┘
```

---

## 7. Conclusion

By pairing **RAM Micro-Retries** (`retryCount: 3`, `retryJitter: 50ms`) with **Database Pessimistic Locking** (`SELECT ... FOR UPDATE`), the system achieves sub-millisecond rejection of invalid requests, zero overselling, and optimal user experience during flash sale events.
