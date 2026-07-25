# PostgreSQL Locking & Concurrency Control Deep Dive

**Date:** 2026-07-24  
**Topics:** `PostgreSQL`, `Database`, `Locking`, `Concurrency`, `FOR UPDATE`, `SKIP LOCKED`, `Drizzle ORM`, `Architecture`  
**Reference Applications:** Ticket Booking, Wallet Balance, Job Queue / Outbox Workers

---

## 1. Overview & Concurrency Strategies

In high-concurrency applications, multiple database transactions often attempt to read and write the same rows simultaneously. To prevent race conditions and data corruption, two primary locking strategies exist:

1. **Optimistic Locking**: Assumes conflicts are rare. Uses a `version` column or timestamp to verify no changes occurred between read and write (`UPDATE ... WHERE id = x AND version = old_version`).
2. **Pessimistic Locking**: Assumes conflicts will happen. Explicitly locks database rows at the `SELECT` phase using SQL clauses like `FOR UPDATE`.

---

## 2. `FOR UPDATE` (Exclusive Row Lock)

### How It Works

When a transaction executes `SELECT ... FOR UPDATE`, PostgreSQL places an **Exclusive Row Lock** on the selected rows. Any other transaction attempting to read (with `FOR UPDATE`), modify, or delete those same rows will be **blocked** until the holding transaction commits or rolls back.

```sql
BEGIN;
SELECT * FROM seats WHERE id = 'seat_123' FOR UPDATE;
-- Rows are locked. Other transactions MUST wait.
UPDATE seats SET status = 'BOOKED' WHERE id = 'seat_123';
COMMIT;
```

---

## 3. When to Use vs. When NOT to Use `FOR UPDATE`

### ✅ When to Use `FOR UPDATE`

Use `FOR UPDATE` for **Read-Check-Modify-Write** workflows on **shared, limited resources** where race conditions cause data corruption:

1. **Ticket Booking / Seat Reservation**: Two users clicking the last available seat simultaneously (`A-12`).
2. **Financial Wallet & Inventory**: Checking user balance before deducting funds (`wallet.balance >= amount`).
3. **State Machine Guards**: Ensuring an order transitions from `PENDING` $\rightarrow$ `PROCESSING` exactly once.

### ❌ When NOT to Use `FOR UPDATE`

Avoid `FOR UPDATE` when:

1. **Executing CPU-Heavy Operations (e.g., Argon2 / Bcrypt Password Hashing)**:
   Hashing operations take 50-100ms of CPU time. Locking a `users` row during hashing holds the lock unnecessarily, blocking other read/write operations for that user.
2. **Atomic Single-Row Updates**:
   Standard SQL `UPDATE users SET password_hash = ... WHERE id = userId` is already atomic in PostgreSQL.
3. **Single-User Resources**:
   Profile updates or settings changes where concurrent write contention by multiple clients is virtually zero.

---

## 4. PostgreSQL Locking Modes Comparison

| Drizzle ORM Method                     | Generated SQL            | Behavior on Lock Contention                                            | Primary Use Cases                                               |
| :------------------------------------- | :----------------------- | :--------------------------------------------------------------------- | :-------------------------------------------------------------- |
| `.for('update')`                       | `FOR UPDATE`             | **Blocks & Waits** until the holding transaction releases the lock.    | Specific resource reservation (e.g., User selects Seat `A-10`). |
| `.for('update', { noWait: true })`     | `FOR UPDATE NOWAIT`      | **Fails immediately** throwing error `could not obtain lock`.          | Strict financial operations where waiting is unacceptable.      |
| `.for('update', { skipLocked: true })` | `FOR UPDATE SKIP LOCKED` | **Skips locked rows** and immediately returns available unlocked rows. | **Job Queues, Outbox Workers**, Auto-assigning random seats.    |

---

## 5. Deep Dive: `SKIP LOCKED` Applications

### 🎯 Application 1: Concurrent Message Outbox / Job Queue Workers

When running multiple worker processes in parallel (e.g. 5 email workers polling an `outbox_events` table):

Without `SKIP LOCKED`, all 5 workers would try to lock the first `PENDING` job, causing 4 workers to block or fail.

With `SKIP LOCKED`:

```typescript
// Each worker atomically claims a unique PENDING job without waiting or blocking
const [job] = await tx
  .select()
  .from(outboxEvents)
  .where(eq(outboxEvents.status, "PENDING"))
  .limit(1)
  .for("update", { skipLocked: true });

if (job) {
  await sendEmail(job.payload);
  await tx
    .update(outboxEvents)
    .set({ status: "PROCESSED" })
    .where(eq(outboxEvents.id, job.id));
}
```

**Result:** All 5 workers process 5 different jobs concurrently with zero blocking and zero duplicate processing.

---

### 🎯 Application 2: Automatic Seat Assignment

When a customer selects "Assign me any available seat":

```typescript
const [availableSeat] = await tx
  .select()
  .from(seats)
  .where(and(eq(seats.showtimeId, showtimeId), eq(seats.status, "AVAILABLE")))
  .limit(1)
  .for("update", { skipLocked: true });
```

If another customer is currently checking out seat `A-1`, this query automatically skips `A-1` and immediately locks `A-2` for this user.

---

## 6. Drizzle ORM Code Examples

### Basic Exclusive Lock

```typescript
const [seat] = await tx
  .select()
  .from(seats)
  .where(eq(seats.id, seatId))
  .for("update");
```

### Non-blocking Lock (`NOWAIT`)

```typescript
const [account] = await tx
  .select()
  .from(accounts)
  .where(eq(accounts.id, accountId))
  .for("update", { noWait: true });
```

### Skip Locked Work Distribution (`SKIP LOCKED`)

```typescript
const pendingJobs = await tx
  .select()
  .from(outboxEvents)
  .where(eq(outboxEvents.status, "PENDING"))
  .limit(10)
  .for("update", { skipLocked: true });
```
