# Reschedule Appointment — Feature Deep Dive

This document covers the complete reschedule feature as a reference for understanding how complex multi-layer features are built. It also documents the bugs fixed during initial development so they are not repeated.

---

## Route

```
/appointment/reschedule-appointment/[id]
```

`[id]` is the appointment ID (e.g., `150056`).

---

## File Map

```
src/app/(logged-in)/appointment/(pages)/reschedule-appointment/[id]/
├── page.tsx                          ← Entry: fetches appointment data
├── actions/
│   └── services.ts                  ← getAppointmentDetails(), rescheduleAppointment()
└── components/
    ├── AppointmentReschedule.tsx     ← Orchestrator (layout, state)
    ├── AppointmentInformation.tsx   ← Left panel: current appointment info
    ├── DoctorSwitchSelect.tsx       ← Debounced doctor search (switch doctor)
    └── RescheduleForm.tsx           ← Reason + type + submit button
```

**Reused from appointment-booking module:**
```
src/app/(logged-in)/appointment-booking/components/
├── BookingDateTimeSelection.tsx     ← Branch + date range + calendar + slots
├── BookingDoctor.tsx                ← Doctor card (avatar, name, specialty)
└── TimeSlots.tsx (DayPeriodSelector)← Time slot grid
```

---

## Component Hierarchy

```
page.tsx
└── AppointmentReschedule.tsx
    ├── AppointmentInformation.tsx   (left col)
    ├── [Switch Doctor button]
    ├── DoctorSwitchSelect.tsx       (conditionally shown)
    ├── BookingDoctor.tsx            (right col top)
    ├── BookingDateTimeSelection.tsx (right col middle)
    └── RescheduleForm.tsx           (right col bottom)
```

---

## State in `AppointmentReschedule.tsx`

```typescript
const [selectedDoctorDetails, setSelectedDoctorDetails] = useState(null); // full doctor object
const [scheduleStart, setScheduleStart] = useState(null);     // ISO string
const [scheduleEnd, setScheduleEnd] = useState(null);         // ISO string
const [selectedSlot, setSelectedSlot] = useState("");         // appointmentSlotId (number)
const [selectedSlotInfo, setSelectedSlotInfo] = useState(""); // slot object
const [branchId, setBranchId] = useState("");
const [isSwitchingDoctor, setIsSwitchingDoctor] = useState(false);
const [switchedDoctorId, setSwitchedDoctorId] = useState<number | null>(null);
```

---

## Doctor Switch Flow

```
User clicks "Switch Doctor"
        ↓
isSwitchingDoctor = true → DoctorSwitchSelect appears
        ↓
User types → debounced search → GET v1/doctor?name=...
        ↓
User selects doctor
        ↓
handleDoctorChange(doctorId):
  - Reset: selectedSlot, selectedSlotInfo, scheduleStart, scheduleEnd, branchId
  - setSwitchedDoctorId(Number(doctorId))
  - getDoctorDetails(doctorId) → setSelectedDoctorDetails
  - isSwitchingDoctor = false → DoctorSwitchSelect hides
        ↓
BookingDateTimeSelection re-renders with new doctor
(branch auto-selected from doctor.branches[0])
        ↓
User picks new date + slot
        ↓
RescheduleForm includes switchedDoctorId in payload
```

---

## Reschedule Payload

```typescript
// RescheduleForm.tsx
const payload: any = {
  appointmentType: selectedAppointmentType,   // "face-to-face" | "online-bd" | "online-abroad"
  appointmentSlotId: selectedSlot,             // number — the new slot's ID
  reason: reason,                              // required string
};

if (switchedDoctorId) {
  payload.doctorId = switchedDoctorId;         // only sent when doctor was switched
}

await rescheduleAppointment(payload, appointmentID);
```

**Backend endpoint:** `PATCH v1/appointment/{id}/reschedule`

**Backend DTO fields:**
| Field | Type | Required |
|-------|------|---------|
| `reason` | string | Yes |
| `appointmentSlotId` | number | One of these two |
| `scheduleStart` + `scheduleEnd` | ISO strings | Or these two |
| `appointmentType` | enum | No |
| `doctorId` | number | No (only for doctor switch) |

---

## Backend: How Reschedule Works

File: `lifespring-backend/src/appointment/appointment.service.ts` → `reschedule()`

1. Fetch existing appointment by ID
2. If cancelled → throw BadRequestException
3. If `appointmentSlotId` provided:
   - Fetch `AppointmentSlot` by ID
   - Extract `date`, `startTime`, `endTime`
   - Build `newScheduleStart`/`newScheduleEnd` using `Date.UTC()` ← **critical**
4. If `scheduleStart`/`scheduleEnd` provided:
   - Use `scheduleService.getAppointmentSchedule()`
5. If `doctorId` provided:
   - Fetch new `Doctor` entity
   - Include in `appointmentData`
6. Unbook old slot (decrement `bookedPatients`)
7. Book new slot (increment `bookedPatients`, set `appointmentId`)
8. Send SMS/WhatsApp notifications
9. Create changelog entry (`statusChangelog`)
10. Save via `_update()`

---

## Audit Trail: Last Updated By

The backend tracks every appointment change in `statusChangelog` table.

The `findOne()` method already returns `statusChangelog` sorted newest-first.

In `AppointmentInformation.tsx`:

```tsx
{appointment?.statusChangelog?.length > 0 && (
  <DoctorDetailField
    title="Last Updated By"
    value={
      appointment.statusChangelog[0].changerName ||
      appointment.statusChangelog[0].changerType
    }
  />
)}
```

`statusChangelog[0]` is the most recent change (ordered `DESC` by `createdAt`).

Each changelog entry has:
- `changerName` — full name of who made the change
- `changerType` — role (ADMIN, AGENT)
- `changeReason` — description (e.g., "Appointment rescheduled from...")
- `changeDate` / `createdAt` — when it happened

---

## Bugs Fixed (Do Not Repeat)

### Bug 1: Doctor not saved on reschedule
**Symptom:** Switching doctor in UI updated visually but database kept old doctor.  
**Root cause:** `reschedule()` service never updated the `doctor` field. DTO had no `doctorId`.  
**Fix:** Added `doctorId` to `RescheduleAppointmentDto`. Service fetches new doctor and includes it in `appointmentData`.

### Bug 2: Schedule time not saved (Invalid Date)
**Symptom:** After reschedule, time in list page did not change.  
**Root cause:** `appointmentSlot.date` is a TypeORM `date` column returned as a JavaScript `Date` object. Embedding it in a template literal (`${appointmentSlot.date}T${startTime}`) produced `"Tue May 12 2026 00:00:00...T18:45:00"` — an invalid date string. TypeORM silently dropped invalid dates.  
**Fix:** Normalized the date using `getUTCFullYear/Month/Date` and used `Date.UTC()`.

### Bug 3: Schedule time saved with 6-hour offset
**Symptom:** Slot at 6:45 PM stored and displayed as 12:45 PM (exactly 6 hours off).  
**Root cause:** Server runs at UTC+6. Using `setHours(18, 45)` on a Date object sets Bangladesh local time (18:45 = 12:45 UTC). TypeORM saves UTC 12:45. `FormattedTime` converts UTC→Bangladesh (+6) = 18:45, then `convertTimeBack6Hours` subtracts 6 = 12:45 PM (wrong).  
**Fix:** Use `Date.UTC(year, month, day, 18, 45)` which always writes 18:45 as UTC directly, regardless of server timezone.  
**See:** [TIMEZONE_HANDLING.md](./TIMEZONE_HANDLING.md) for the full explanation.

---

## Future Improvements

- [ ] Show confirmation modal before submitting reschedule (with old vs new time summary)
- [ ] Allow reschedule to also update appointment criteria (new/follow-up)
- [ ] Show changelog history in a collapsible section of `AppointmentInformation`
- [ ] Validate that the selected slot belongs to the selected doctor (frontend guard)
- [ ] Send email notification on reschedule (currently only SMS/WhatsApp)
