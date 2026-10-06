# Timezone Handling — Critical Reading

This is one of the most important files in the blueprint. Timezone bugs are subtle and hard to debug. **Read this before touching any appointment scheduling code.**

---

## The Setup

| Component | Timezone |
|-----------|---------|
| Server (NestJS backend) | UTC+6 (Bangladesh Standard Time) |
| MySQL database | Stores naive datetimes (no timezone stored) |
| TypeORM config | `timezone: 'Z'` — reads/writes all MySQL datetimes as UTC |
| Browser (admin users) | UTC+6 (Bangladesh) |
| `FormattedTime` component | Subtracts 6 hours after browser conversion |

---

## How Datetimes Are Stored

The system uses a **naive datetime convention**: Bangladesh local time digits are stored literally in MySQL, but TypeORM treats them as UTC.

**Example:** A slot at 6:45 PM Bangladesh time is stored as:
```
MySQL: 2026-05-12 18:45:00
TypeORM returns: 2026-05-12T18:45:00.000Z  (treated as UTC)
```

This is NOT `18:45 UTC` in real-world terms. The system knowingly stores the local time as if it were UTC. The `FormattedTime` component corrects for this on display.

---

## How Display Works (`FormattedTime`)

```
Stored in MySQL: 18:45:00 (Bangladesh 6:45 PM, stored as naive UTC)
        ↓
API returns: "2026-05-12T18:45:00.000Z"
        ↓
Browser (UTC+6) interprets: UTC 18:45 = Bangladesh 00:45 AM next day
        ↓
date.getHours() = 0 → formatted as "12:45 AM"
        ↓
convertTimeBack6Hours("12:45 AM") = subtracts 6h = 6:45 PM ✓
```

The `convertTimeBack6Hours` function in `FormattedTime.tsx` exists specifically to undo the browser's automatic UTC→Bangladesh conversion.

---

## The Bug: `setHours()` vs `Date.UTC()`

### Why `setHours()` is WRONG here

```typescript
// ❌ WRONG — DO NOT USE setHours() for schedule datetimes

const slotDate = new Date(appointmentSlot.date); // UTC midnight
const [h, m] = appointmentSlot.startTime.split(':').map(Number); // [18, 45]

const dt = new Date(slotDate);
dt.setHours(h, m, 0, 0); // setHours uses LOCAL time
// Server is UTC+6 → "18:45 local" = "12:45 UTC"
// TypeORM saves: 2026-05-12 12:45:00 ← WRONG (lost 6 hours!)
```

**What the user sees:** "12:45 PM" instead of "6:45 PM"

### Why `Date.UTC()` is CORRECT

```typescript
// ✅ CORRECT — always use Date.UTC() for slot-based schedule datetimes

const rawDate = appointmentSlot.date;
const base = rawDate instanceof Date ? rawDate : new Date(String(rawDate));
const year = base.getUTCFullYear();
const month = base.getUTCMonth();
const day = base.getUTCDate();

const [h, m] = appointmentSlot.startTime.split(':').map(Number); // [18, 45]

const dt = new Date(Date.UTC(year, month, day, h, m, 0, 0));
// Date.UTC ignores the server's local timezone → always stores 18:45
// TypeORM saves: 2026-05-12 18:45:00 ← CORRECT

// Display pipeline:
// Browser (UTC+6): 18:45 UTC → 00:45 AM Bangladesh next day
// FormattedTime: "12:45 AM" → convertTimeBack6Hours → "6:45 PM" ✓
```

---

## String Construction Is Also Wrong

```typescript
// ❌ WRONG — string template with T separator

new Date(`${dateStr}T${appointmentSlot.startTime}`)
// ECMAScript: ISO 8601 strings with T and no timezone suffix
// are parsed as LOCAL time in modern V8 → UTC+6 server
// → same 6-hour bug as setHours()
```

---

## The Only Safe Pattern for Slot Datetimes

```typescript
// In: appointment.service.ts (backend reschedule)
// Also applies anywhere you construct a Date from an AppointmentSlot

const rawDate = appointmentSlot.date;
const base = rawDate instanceof Date ? rawDate : new Date(String(rawDate));

// Use getUTC* because TypeORM timezone:'Z' returns date cols as UTC midnight
const year  = base.getUTCFullYear();
const month = base.getUTCMonth();
const day   = base.getUTCDate();

const [startHour, startMin] = appointmentSlot.startTime.split(':').map(Number);
const [endHour,   endMin  ] = appointmentSlot.endTime.split(':').map(Number);

const scheduleStart = new Date(Date.UTC(year, month, day, startHour, startMin, 0, 0));
const scheduleEnd   = new Date(Date.UTC(year, month, day, endHour,   endMin,   0, 0));
```

---

## For Original Appointment Creation (String-Based Path)

When the frontend sends `scheduleStart` as a string (e.g., `"2026-05-12 12:00"`), the schedule service uses `moment()`:

```typescript
// schedule.service.ts → validateScheduleTime()
const scheduleStartDate = moment(scheduleStart); // parses as local
const startDT = new Date(scheduleStartDate.format('YYYY-MM-DD HH:mm'));
```

`new Date("2026-05-12 12:00")` with space separator is parsed as local time in V8. On a UTC server this = UTC 12:00 → stored as 12:00 → displayed correctly. **This path is handled by existing code — don't change it.**

---

## Quick Decision Table

| Scenario | Use |
|----------|-----|
| Constructing Date from `AppointmentSlot.startTime` | `Date.UTC(year, month, day, h, m)` |
| Constructing Date from frontend string `"YYYY-MM-DD HH:mm"` | `new Date(momentString)` (existing path) |
| Displaying appointment time in UI | `<FormattedTime isoString={...} />` — never format manually |
| Checking if a date is in the past (Bangladesh time) | `moment().utcOffset(6)` |

---

## Where This Affects the Codebase

| File | Notes |
|------|-------|
| `backend: appointment.service.ts` → `reschedule()` | Fixed to use `Date.UTC()` |
| `frontend: FormattedTime.tsx` | Contains `convertTimeBack6Hours` — do not change |
| `frontend: FormattedDate.tsx` | Same timezone assumptions — use as-is |
| `backend: schedule.service.ts` → `validateScheduleTime()` | Uses `moment()` + string path — leave as-is |
| `backend: appointment.controller.ts` → slot booking | Uses `setHours()` in slot creation path (NOT reschedule) |

---

## Summary in Plain English

> The database stores "6:45 PM" as the literal string `18:45:00` — no timezone label.
> When TypeORM returns it, the browser thinks it's UTC 18:45 and adds 6 hours → midnight.
> `FormattedTime` then subtracts 6 hours → back to 6:45 PM.
> If you use `setHours()` on a UTC+6 server, it silently converts 18:45→12:45 before saving,
> which breaks the chain. `Date.UTC()` prevents this by writing 18:45 as UTC directly.
