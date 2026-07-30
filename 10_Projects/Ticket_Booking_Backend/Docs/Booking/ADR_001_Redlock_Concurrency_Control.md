# Core Booking & Concurrency Control Architecture

## ADR 001: Distributed Lock Mechanism for Show Seat Reservation

### Status

Accepted

### Context

High-concurrency ticket booking systems face race conditions when multiple users attempt to reserve the same seat simultaneously. The system uses a double-locking mechanism:

1. **Memory Layer (RAM)**: Redis Distributed Lock (Redlock algorithm) with 2000ms TTL for fast rejection (<5ms).
2. **Database Layer (Persistence)**: PostgreSQL `SELECT ... FOR UPDATE` pessimistic locking inside a DB transaction.

### Decision

We use `redlock` (v5) wrapped in `RedlockService` with a local ambient declaration `src/types/redlock.d.ts`.

### Rationale

- **Feature-Complete Algorithm**: The Redlock algorithm specification by Salvatore Sanfilippo (Redis author) is immutable. A library implementing Redlock does not require frequent feature updates.
- **Minimal Surface**: `redlock` package executes atomic Redis Lua scripts (`evalsha`). It has zero heavy third-party dependencies.
- **Double-Locking Safety Net**: Even if Redlock were to fail, the secondary PostgreSQL `SELECT ... FOR UPDATE` transaction guarantees 100% data integrity and prevents double-booking.

### Maintenance Risk & Mitigation

- **Unmaintained Upstream Status**: The `mike-marcacci/node-redlock` repository has had no commits in >11 months.
- **Risk Acceptance**: Accepted because the library is a thin wrapper over Redis Lua scripts with zero transient dependencies. The local `src/types/redlock.d.ts` Type Bridge decouples our build pipeline from upstream packaging issues.
- **Fail-Safe Guarantee**: PostgreSQL `SELECT ... FOR UPDATE` acts as the authoritative persistence lock barrier.
- **Exit Strategy**: If future Node.js runtime changes break `redlock`, `RedlockService` can be swapped for a ~40-line custom Lua script service via `ioredis` without modifying `BookingService` or public REST APIs.
