# Shared Components Catalog

All shared components live in `src/app/components/`. **Check here first** before building a new component — you may find one that already does what you need.

---

## Layout Components

### `FormattedTime`
**Path:** `src/app/components/layout/FormattedTime.tsx`

Displays a UTC ISO date string as Bangladesh local time (12-hour AM/PM).  
**Important:** Contains a `convertTimeBack6Hours()` function that corrects for the browser's automatic UTC→Bangladesh timezone shift. See [TIMEZONE_HANDLING.md](./TIMEZONE_HANDLING.md) for why this exists.

```tsx
<FormattedTime isoString={appointment.scheduleStart} />
// Output: "6:45 PM"
```

### `FormattedDate`
**Path:** `src/app/components/layout/FormattedDate.tsx`

Displays a UTC ISO date string as a readable date.

```tsx
<FormattedDate isoString={appointment.scheduleStart} />
// Output: "Tue May 12 2026"
```

### `NoDataFound`
```tsx
<NoDataFound message="No appointments found" />
```

### `ContentWrapper`
Provides consistent page padding + permission-aware wrapper.

### `FilterWrapper`
Wraps filter controls in a styled bar.

---

## Button Components

### Action Buttons (`src/app/components/buttons/actionButtons/`)

| Component | Use case |
|-----------|---------|
| `ActionButton` | Generic button with icon + label |
| `CreateActionButton` | Green "Create" button |
| `UpdateActionButton` | Blue "Edit/Update" button |
| `DeleteActionButton` | Red "Delete" button with confirm |
| `ViewActionButton` | "View details" navigation button |

```tsx
<CreateActionButton onClick={() => router.push('/doctor/create')} />
<UpdateActionButton onClick={() => router.push(`/doctor/${id}/update`)} />
<DeleteActionButton onConfirm={handleDelete} />
<ViewActionButton onClick={() => router.push(`/appointment/${id}`)} />
```

### Standard Buttons

| Component | Use case |
|-----------|---------|
| `CreateButton` | Primary "Create" action |
| `SubmitButton` | Form submit (shows loading state) |
| `LoadingButton` | Button with spinner |
| `LogoutButton` | Calls logout server action |

---

## Form Input Components (`src/app/components/formInputs/`)

### `DropdownWithSearch`
Ant Design Select with search. Used throughout the app.

```tsx
<DropdownWithSearch
  labelText="Appointment Type"
  selectionValue={selectedType}
  onSelectChange={(value) => setSelectedType(value)}
  selectionOptions={[
    { value: "face-to-face", label: "Face2Face" },
    { value: "online-bd", label: "Online BD" },
  ]}
  inputPlaceholder="Select type"
  isRequired={true}
/>
```

### `MultiSelectDropdown`
Same as above but allows multiple selections.

### `DateInputField`
Single date picker.

### `InputField`
Labeled text input wrapper.

### `InternationalPhone`
Phone input with country code selector.

---

## Filter Components (`src/app/components/filters/`)

### `SearchableDropDown`
Dropdown with search used in filter bars.

### `SearchFromList`
Live-search filter from a predefined list.

---

## Sidebar (`src/app/components/sidebar/`)

### `Sidebar`
Main navigation sidebar. Menu items come from `src/hooks/sidebarMenus.ts`.  
Sidebar badge counters (e.g., "5 upcoming appointments") are fetched via `GetCounters.tsx`.

### `SidebarPermission`
Wraps sidebar items — hides them if the user lacks the required permission.

---

## Role/Permission Components

### `HandleRolePermission` / `RolePermissionChecker`
**Path:** `src/app/components/rolepermission/HandleRolePermission.tsx`

Conditionally renders children based on the current user's permissions.

```tsx
// Only show "Create Doctor" button if user has 'doctor-create' permission
<RolePermissionChecker tag="doctor" name="create">
  <CreateActionButton onClick={handleCreate} />
</RolePermissionChecker>
```

---

## Debounced Doctor/Patient Selects

### `DoctorDebounceSelect`
**Path:** `src/app/(logged-in)/appointment-booking/components/DoctorDebounceSelect.tsx`

For the **appointment booking** page. On doctor selection it pushes `?type=doctor&id={id}` to the URL.

### `DoctorSwitchSelect`
**Path:** `src/app/(logged-in)/appointment/(pages)/reschedule-appointment/[id]/components/DoctorSwitchSelect.tsx`

For the **reschedule** page. Same debounced search behaviour but calls a callback instead of changing the URL.

```tsx
<DoctorSwitchSelect onDoctorChange={(doctorId) => handleDoctorSwitch(doctorId)} />
```

---

## Appointment-Specific Shared Components

These are in the appointment-booking module but reused by reschedule:

### `BookingDateTimeSelection`
**Path:** `src/app/(logged-in)/appointment-booking/components/BookingDateTimeSelection.tsx`

Orchestrates: branch picker → date range → calendar → time slot grid.

Props:
```typescript
{
  doctor: DoctorDetails,
  setScheduleStart, setScheduleEnd,  // ISO strings
  branchId, setBranchId,
  selectedSlot, setSelectedSlot,     // appointmentSlotId (number)
  selectedSlotInfo, setSelectedSlotInfo
}
```

### `BookingDoctor`
**Path:** `src/app/(logged-in)/appointment-booking/components/BookingDoctor.tsx`

Displays doctor avatar, name, and specialty.

### `LoadingModal`
**Path:** (exported from `AppointmentForm.tsx`)

Full-screen loading overlay. Used during form submissions.

```tsx
<LoadingModal open={isSubmitting} />
```

---

## Tips

- **Ant Design** (`antd`) is the primary UI library. Use its `Select`, `DatePicker`, `Table`, `Modal`, `message` etc. directly.
- **Tailwind CSS** is used for layout and spacing. The primary brand color is `primary-400` / `primary-500` (green `#227F27`).
- Avoid creating one-off styled divs — check Tailwind utility classes first.
- When in doubt about an existing component's API, read the file — they're short and well-structured.
