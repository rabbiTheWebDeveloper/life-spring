# API Patterns

## Golden Rule

**Never call `fetch()` directly.** Always use the methods from `src/api/ApiClient.ts`.  
The `ApiClient` automatically:
- Injects the Bearer token from cookies
- Sets Content-Type (JSON or FormData)
- Handles 401 → redirects to login
- Logs every request

---

## Available Methods

```typescript
import { get, post, put, patch, del } from "@/api/ApiClient";

get<T>(uri: string, headers?: object): Promise<T>
post<T>(uri: string, body?: object, headers?: object): Promise<T>
put<T>(uri: string, body?: object, headers?: object): Promise<T>
patch<T>(uri: string, body?: object, headers?: object): Promise<T>
del<T>(uri: string, body?: object, headers?: object): Promise<T>

// Returns the full Response object (useful for blobs, status checks)
getWithResponse<T>(uri, headers?): Promise<Response>
postWithResponse<T>(uri, body?, headers?): Promise<Response>
```

The `uri` is appended to `API_BASE_URL` from `.env`.

---

## Server Actions Pattern

All data-fetching functions that talk to the backend **must** use `"use server"` at the top of the file. They live in each feature's `/actions/` folder.

```typescript
// src/app/(logged-in)/appointment/actions/GetAppointmentList.ts

"use server";
import { get } from "@/api/ApiClient";

export async function getAppointmentList(
  page: number,
  size: number,
  status?: string
): Promise<any> {
  return await get(`v2/appointment?page=${page}&size=${size}${status ? `&status=${status}` : ""}`);
}
```

**Rules for server actions:**
- File must have `"use server"` as the very first line
- Functions are `async` and return `Promise<any>`
- Catch errors at the call site, not inside the action (unless you want a custom message)
- Never import client-only code (`useState`, `useEffect`, browser APIs) in these files

---

## Calling Actions from Client Components

```typescript
"use client";

import { useEffect, useState } from "react";
import { getAppointmentList } from "../actions/GetAppointmentList";

const AppointmentTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await getAppointmentList(0, 10, "Upcoming");
      setData(res?.data?.appointments || []);
    };
    fetch();
  }, []);

  // ...
};
```

---

## API Response Shape

The backend consistently returns:

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": { ... }
}
```

Always check `res?.statusCode === 200` before using `res?.data`.

For list endpoints:
```json
{
  "statusCode": 200,
  "data": {
    "appointments": [...],
    "total": 150,
    "page": 0,
    "size": 10
  }
}
```

---

## URL Patterns

| Version | Used for |
|---------|---------|
| `v1/...` | Most endpoints (appointments, doctors, patients, users) |
| `v2/appointment` | Appointment list (enhanced version) |

**Common endpoints used:**

```
GET  v1/appointment/{id}                  → appointment details
GET  v2/appointment?page=0&size=10        → appointment list
PATCH v1/appointment/{id}/reschedule      → reschedule
GET  v1/doctor?size=10&page=0             → doctor list
GET  v1/doctor/{id}                       → doctor details
GET  v1/doctor/{id}/schedules             → doctor schedule
GET  v1/appointment/availability?doctorId=&date=&branchId=  → time slots
GET  v1/patient/{id}                      → patient details
GET  v1/patient/identifier/{phone}        → patient by phone
GET  v1/user/{id}                         → user details
```

---

## Sending FormData vs JSON

`ApiClient` auto-detects the content type:
- If `body` is a `FormData` instance → sends as `multipart/form-data`
- Otherwise → sends as `application/json`

```typescript
// JSON (most common)
await post("v1/appointment", { doctorId: 5, patientId: 12, ... });

// FormData (for file uploads)
const form = new FormData();
form.append("profilePic", file);
await post("v1/doctor/upload", form);
```

---

## Error Handling

```typescript
try {
  const res = await post("v1/appointment", payload);
  if (res?.statusCode === 200) {
    message.success("Appointment created!");
  } else {
    message.error(res?.message || "Something went wrong");
  }
} catch (error) {
  message.error("Failed to submit. Please try again.");
  console.error(error);
}
```

Use Ant Design's `message` helper for user-facing toasts.  
`catchErrorMessage(error)` in `src/helper/error.ts` maps network errors (ECONNREFUSED, ETIMEDOUT) to readable strings.

---

## Adding a New API Call (Checklist)

1. Create (or add to) `/actions/yourAction.ts` with `"use server"` at top
2. Import `get`/`post`/etc from `@/api/ApiClient`
3. Build the URL with the correct `v1/` or `v2/` prefix
4. Return the raw response (`return response || {}`)
5. Call from a client component inside `useEffect` or an event handler
6. Check `res?.statusCode === 200` before using `res?.data`
