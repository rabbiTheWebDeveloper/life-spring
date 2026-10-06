# Feature Modules

## Appointment

**Routes:**
| Path | Purpose |
|------|---------|
| `/appointment` | List with filters (status, date, doctor, payment status, branch) |
| `/appointment/[id]` | Detail view with logs, payment info, prescription |
| `/appointment/reschedule-appointment/[id]` | Reschedule — change date/time/doctor |
| `/appointment-booking` | Create new appointment (doctor + slot + patient form) |

**Key Components:**
- `AppointmentDataTable.tsx` — Ant Design table, 15+ columns
- `AppointmentTableFilter.tsx` — All filter controls
- `CancelModal`, `RefundModal`, `PaymentModal`, `DiscountModal`, `VatUpdateModal` — Action modals
- `AppointmentReschedule.tsx` — Reschedule page orchestrator
- `DoctorSwitchSelect.tsx` — Debounced doctor search for switching during reschedule
- `RescheduleForm.tsx` — Reason + appointment type + submit
- `BookingDateTimeSelection.tsx` — Branch selector, date range picker, calendar, time slots
- `DayPeriodSelector` (TimeSlots.tsx) — Grid of available time slots
- `AppointmentForm.tsx` — Full patient + booking details form

**Key Actions:**
```
GetAppointmentList.ts      → GET v2/appointment (list)
getAppointmentDetails()    → GET v1/appointment/{id}
rescheduleAppointment()    → PATCH v1/appointment/{id}/reschedule
createAppointmentBooking() → POST v1/appointment
getDoctorScheduleTimeSlot()→ GET v1/appointment/availability?doctorId=&date=&branchId=
CancelAction.ts            → PATCH v1/appointment/{id}/cancel
updateVat.ts               → PATCH v1/appointment/{id} (VAT update)
```

**Reschedule payload (PATCH v1/appointment/{id}/reschedule):**
```json
{
  "appointmentSlotId": 123,
  "appointmentType": "face-to-face",
  "reason": "Patient request",
  "doctorId": 45
}
```
`doctorId` is optional — only send it when switching doctor.

---

## Appointment Booking

**Route:** `/appointment-booking?type=doctor&id=146`

The page accepts query parameters:
- `type=doctor&id={doctorId}` — pre-select a specific doctor
- `type=patient&id={patientId}` — pre-fill patient info

**Booking flow:**
1. Search/select doctor (`DoctorDebounceSelect`)
2. Pick branch, date range, calendar day (`BookingDateTimeSelection`)
3. Pick time slot (`DayPeriodSelector`)
4. Fill patient form (`AppointmentForm`)
5. Submit → `POST v1/appointment`

---

## Doctor

**Routes:**
| Path | Purpose |
|------|---------|
| `/doctor` | List with search and specialty filter |
| `/doctor/create` | Create new doctor (server-side specialty/org fetch) |
| `/doctor/[id]` | Doctor profile detail |
| `/doctor/[id]/update` | Edit doctor info |
| `/doctor/schedule/[id]` | Manage weekly schedule |
| `/doctor/schedule/[id]/view` | Read-only schedule view |

**Key Actions:**
```
GetDoctorList.ts           → GET v1/doctor
getDoctorDetails()         → GET v1/doctor/{id}
getDoctorSchedule()        → GET v1/doctor/{id}/schedules
getDoctorScheduleTimeSlot()→ GET v1/appointment/availability
getDoctorSpeciality()      → GET v1/doctor/specialties
```

---

## Patient

**Routes:**
| Path | Purpose |
|------|---------|
| `/patient` | List with search + active filter, XLSX export |
| `/patient/[id]` | Patient detail |

**Create:** Modal-based (no separate route).

**Export:** Calls `/v1/patient/export` with the current filters — downloads XLSX.

**Key Actions:**
```
getPatientData()   → GET v1/patient
getPatientById()   → GET v1/patient/{id}
patientByPhone()   → GET v1/patient/identifier/{phone}  ← used in booking
AddPatient()       → POST v1/patient
```

---

## User Management

**Routes:**
| Path | Purpose |
|------|---------|
| `/user` | List all users |
| `/user/[id]` | View/edit user detail (toggle view/edit mode) |

**Roles system:** Users have roles (ADMIN, AGENT, etc.). Roles have permission sets.

**Key Actions:**
```
GetUserList.ts     → GET v1/user
CreateUser.ts      → POST v1/user
UpdateUser.ts      → PATCH v1/user/{id}
```

---

## Role & Permission

**Routes:**
| Path | Purpose |
|------|---------|
| `/role` | List all roles |
| `/role/[id]` | Role detail — assign permissions |
| `/permission` | Permission management |

Permissions are **tag-based strings** like `"appointment-create"`, `"doctor-update"`.  
They control what UI elements are visible per user via `RolePermissionChecker`.

---

## Organization & Branch

**Routes:** `/organization`, `/branch`

Simple CRUD for hospital/clinic organizations and their physical branches.  
Branches are linked to doctors (a doctor can belong to multiple branches).

---

## Reports

| Route | Purpose |
|-------|---------|
| `/available-slot-report` | View doctor availability slots |
| `/refund-report` | Track refunds |
| `/doctor-revenue` | Revenue breakdown per doctor |
| `/payment-report` | All payment transactions |
| `/daily-patients` | Patients seen per day per doctor |
| `/settlement` | Financial settlement records |
| `/invoice` | Invoice management |

---

## Dashboard

**Route:** `/dashboard`

Shows summary statistics cards (total appointments, paid, unpaid, etc.).  
Data from `getDashboardStats()`, `getPaymentStats()`, `getCountStats()`.

Sidebar counters (badge numbers on menu items) come from `GetCounters.tsx` server action.

---

## Profile

**Routes:** `/profile`, `/profile/update`

Logged-in admin's own profile view and edit.

---

## Adding a New Feature Module (Steps)

1. Create folder under `src/app/(logged-in)/your-feature/`
2. Add `page.tsx` (can be server component if no interactivity)
3. Create `components/`, `actions/`, `types/` subdirectories
4. Add server actions in `actions/` with `"use server"`
5. Add a sidebar entry in `src/hooks/sidebarMenus.ts` if needed
6. Wrap the page with `ContentWrapper` for consistent layout
7. Add permission tag to `RolePermissionChecker` if access should be restricted
