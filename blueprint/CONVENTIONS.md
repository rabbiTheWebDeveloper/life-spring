# Coding Conventions

## File Naming

| Type | Convention | Example |
|------|-----------|---------|
| React components | PascalCase `.tsx` | `AppointmentTable.tsx` |
| Server actions | PascalCase or camelCase `.ts` | `GetAppointmentList.ts` |
| Custom hooks | camelCase with `use` prefix `.ts` | `useLogin.ts` |
| Type definitions | PascalCase `.ts` | `Types.ts` |
| Utility/helper | camelCase `.ts` | `DateHelper.ts` |
| Pages | `page.tsx` (Next.js convention) | `page.tsx` |
| Layouts | `layout.tsx` | `layout.tsx` |

---

## Folder Conventions

Every feature module follows this structure — be consistent:

```
/feature-name/
├── page.tsx
├── components/     ← UI only, no direct API calls
├── actions/        ← "use server" files only
├── types/          ← Interfaces, enums, type aliases
└── (pages)/        ← Sub-routes (detail, edit, etc.)
    └── [id]/
```

**Never put API calls directly inside a component.** Extract them to `/actions/`.

---

## Component Patterns

### Client vs Server Components

```typescript
// ✅ Server component (default in App Router)
// No "use client" directive
// Can use async/await, fetch data server-side
export default async function DoctorPage({ searchParams }) {
  const doctors = await getDoctorList(searchParams.page);
  return <DoctorTable data={doctors} />;
}

// ✅ Client component (needs interactivity)
"use client";
import { useState, useEffect } from "react";
export default function DoctorTable({ data }) {
  const [selected, setSelected] = useState(null);
  ...
}
```

**Rule:** Keep pages as server components when possible. Move interactivity down to leaf components.

---

## Server Actions

```typescript
// ✅ Correct
"use server";
import { get } from "@/api/ApiClient";

export async function getDoctorList(page: number): Promise<any> {
  try {
    const response = await get(`v1/doctor?page=${page}&size=10`);
    return response || {};
  } catch (e) {
    // Log but don't rethrow — let the caller handle display
    console.error("getDoctorList failed:", e);
    return {};
  }
}

// ❌ Wrong — no "use server"
export async function getDoctorList() {
  return await fetch("/api/doctor"); // Direct fetch without auth
}
```

---

## State Management

Use **React `useState`** for local component state.  
Use **React Context** (`AuthContext`) for global auth state.  
**Do not add Redux, Zustand, or other global stores** unless there's a compelling reason.

URL search params are used as "state" for filters and pagination:

```typescript
// Read from URL
const searchParams = useSearchParams();
const page = searchParams.get("page") || "0";

// Write to URL
const router = useRouter();
router.push(`?page=${newPage}&status=${status}`);
```

---

## API Response Handling

Always check `statusCode` before using `data`:

```typescript
// ✅ Correct
const res = await createAppointment(payload);
if (res?.statusCode === 200) {
  message.success("Appointment created!");
  router.push("/appointment");
} else {
  message.error(res?.message || "Failed to create appointment");
}

// ❌ Wrong — assumes success
const res = await createAppointment(payload);
router.push("/appointment");
```

---

## TypeScript

- **Always type props** of shared components. Use `any` only in internal/private component state as a last resort.
- **Prefer interfaces** over `type` for object shapes.
- Use the global types in `src/types/` and feature-specific types in `/types/Types.ts`.

```typescript
// ✅ Good
interface DoctorProps {
  id: number;
  name: string;
  specialty: string;
}

// ❌ Avoid when possible
const DoctorCard = ({ doctor }: any) => { ... };
```

---

## Styling

- **Tailwind CSS** first. Check utility classes before writing custom CSS.
- **Brand color classes:** `bg-primary-400`, `text-primary-500` (green, `#227F27`).
- Use `clsx` for conditional class names:

```tsx
import clsx from "clsx";

<button className={clsx("px-4 py-2 rounded", {
  "bg-primary-400 text-white": isActive,
  "bg-gray-200 text-gray-400": !isActive,
})} />
```

- For complex UI patterns, fall back to Ant Design components.
- Do **not** write inline `style` objects unless absolutely necessary.

---

## Error Handling in UI

```tsx
// ✅ Use Ant Design message for toasts
import { message } from "antd";
message.success("Saved!");
message.error("Something went wrong");

// ✅ Use try/catch with user-facing error
try {
  await someAction();
} catch (err) {
  message.error("Failed to save. Please try again.");
  console.error(err);
}
```

---

## Imports Order

Recommended import order (enforced by eslint if configured):

```typescript
// 1. React & Next
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 2. Third-party
import { message, Select } from "antd";
import debounce from "lodash/debounce";

// 3. Internal — absolute paths (@/)
import { get } from "@/api/ApiClient";
import { getAppointmentDetails } from "@/app/(logged-in)/appointment/actions/GetAppointmentList";

// 4. Internal — relative paths (same feature)
import AppointmentForm from "./AppointmentForm";
import { AppointmentType } from "../types/Types";
```

---

## Commenting

- **Do not add comments** for obvious code.
- **Add comments** for non-obvious business logic, timezone quirks, or workarounds.

```typescript
// ✅ Good comment — explains WHY, not WHAT
// Use Date.UTC() here — do NOT use setHours(). The server runs UTC+6 and
// setHours() would convert Bangladesh time to UTC before storage, resulting
// in a 6-hour shift. See blueprint/TIMEZONE_HANDLING.md for the full story.
newScheduleStart = new Date(Date.UTC(year, month, day, startHour, startMinute, 0, 0));

// ❌ Useless comment
// Set the hours
newScheduleStart.setHours(18, 45, 0, 0);
```

---

## Do Not Do List

| Anti-pattern | Instead |
|-------------|---------|
| Direct `fetch()` calls | Use `ApiClient` methods |
| `localStorage` for tokens | Tokens are in cookies, managed by `TokenManager` |
| Global state for filters | Use URL search params |
| `setHours()` for schedule datetimes | Use `Date.UTC()` — see TIMEZONE_HANDLING.md |
| Duplicating existing components | Check `src/app/components/` first |
| Skipping `statusCode` check | Always validate API response |
| `"use server"` inside a component file | Keep server actions in `/actions/` files |
