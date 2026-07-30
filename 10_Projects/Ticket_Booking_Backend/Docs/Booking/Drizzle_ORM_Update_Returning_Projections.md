# Drizzle ORM Update Query Execution & Returning Projections

**Topic**: Drizzle ORM & PostgreSQL Update Result Handling  
**Date**: 2026-07-28  
**Category**: ORM Performance & Type Safety  
**Path**: `second-brain/Docs/Booking/Drizzle_ORM_Update_Returning_Projections.md`

---

## 1. PostgreSQL UPDATE Behavior

In PostgreSQL:

- Standard `UPDATE ... WHERE ...` returns execution metadata containing `rowCount`.
- `UPDATE ... WHERE ... RETURNING <columns>` returns the updated rows as a result set (array of objects).

---

## 2. Why `.returning({ id: showSeats.id })` is Used

```typescript
const updated = await this.db
  .update(showSeats)
  .set({ status: "available", lockedUntil: null })
  .where(and(eq(showSeats.status, "reserved"), lt(showSeats.lockedUntil, now)))
  .returning({ id: showSeats.id });
```

### Reason A: Type-Safe JavaScript Array `.length`

In Drizzle ORM, appending `.returning(...)` converts the query promise payload into a typed JavaScript array `Array<{ id: string }>`.

- `updated.length` is 100% type-safe in TypeScript without casting driver result objects.

### Reason B: Network & Memory Bandwidth Projection

- Bare `.returning()` (no arguments) forces PostgreSQL to serialize and transmit **all table columns** (`id`, `showId`, `seatId`, `status`, `lockedUntil`, `createdAt`, `updatedAt`).
- `.returning({ id: showSeats.id })` performs column projection, transferring **only the single 16-byte UUID column** over the database TCP socket.

---

## 3. Alternative: Driver `rowCount` (No RETURNING Clause)

If column payload is omitted entirely:

```typescript
const result = await this.db
  .update(showSeats)
  .set({ status: "available", lockedUntil: null })
  .where(and(eq(showSeats.status, "reserved"), lt(showSeats.lockedUntil, now)));

// Access driver rowCount directly
if (result.rowCount && result.rowCount > 0) {
  this.logger.log(`Cleaned up ${result.rowCount} seats`);
}
```

### Trade-off Comparison

| Approach                        | SQL Query Executed        | Driver Result Shape     | Network Payload         | Type-Safety                      |
| :------------------------------ | :------------------------ | :---------------------- | :---------------------- | :------------------------------- |
| **`.returning({ id })` (Used)** | `UPDATE ... RETURNING id` | `Array<{ id: string }>` | Small (UUID only)       | ✅ **100% Strict Type-Safe**     |
| **No `.returning()`**           | `UPDATE ...`              | `QueryResult`           | Minimal (Metadata only) | ⚠️ Driver-dependent (`rowCount`) |
| **Bare `.returning()`**         | `UPDATE ... RETURNING *`  | `Array<TShowSeat>`      | Large (All columns)     | ✅ Type-Safe but wasteful        |
