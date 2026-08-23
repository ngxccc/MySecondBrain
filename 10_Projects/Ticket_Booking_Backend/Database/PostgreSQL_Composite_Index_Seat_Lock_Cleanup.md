# PostgreSQL Index Optimization for Seat Lock Cleanup

**Topic**: B-Tree Composite Index Performance  
**Date**: 2026-07-28  
**Category**: Database Performance & Indexing  
**Path**: `second-brain/Docs/Booking/PostgreSQL_Composite_Index_Seat_Lock_Cleanup.md`

---

## 1. Context Query

Executed every 5 minutes by `BookingCronService` and BullMQ cancellation worker:

```sql
UPDATE show_seats
SET status = 'available', locked_until = NULL
WHERE status = 'reserved' AND locked_until < NOW();
```

---

## 2. Existing Schema Index

Defined in `src/database/schemas/shows.schema.ts` (lines 52-55):

```typescript
export const showSeats = snakeCase.table("show_seats", {/* ... */}, (table) => [
  // Composite Index on (status, locked_until)
  index("show_seats_status_locked_until_idx").on(
    table.status,
    table.lockedUntil,
  ),
]);
```

---

## 3. Why This Index is CRITICAL

In production, `show_seats` easily reaches millions of rows (100 cinemas × 10 halls × 200 seats × 10 shows/day = 2,000,000 rows/day).

| Query Execution Method | Without Index                                      | With Composite Index `(status, locked_until)` |
| :--------------------- | :------------------------------------------------- | :-------------------------------------------- |
| **PostgreSQL Plan**    | **Sequential Scan** (Reads 2,000,000 disk rows)    | **Index Range Scan** (Reads <50 index nodes)  |
| **Execution Time**     | **2,000ms – 5,000ms** (High CPU & I/O Spikes)      | **<1ms**                                      |
| **Locking Impact**     | Holds exclusive table locks, blocking reservations | Touches only target expired rows              |

---

## 4. How PostgreSQL B-Tree Index Operates (Leftmost Prefix Rule)

Given index order `(status, locked_until)` and query `WHERE status = 'reserved' AND locked_until < NOW()`:

```
B-Tree Index
├── status = 'available'  [Skipped]
├── status = 'booked'     [Skipped]
└── status = 'reserved'   <-- Step 1: Jump directly to 'reserved' branch (Equality)
    ├── locked_until = 10:15  [Filtered: > NOW()]
    ├── locked_until = 10:10  [Filtered: > NOW()]
    └── locked_until = 09:55  <-- Step 2: Index Range Scan for < NOW() (Range)
```

1. **Equality First (`status = 'reserved'`)**: Instantly narrows candidate set.
2. **Range Second (`locked_until < NOW()`)**: Performs an efficient B-Tree range scan on the sorted timestamps.
