# Project Structure

## Root Layout

```
lifespring-admin/
├── blueprint/              ← You are here (developer docs)
├── public/
├── src/
│   ├── api/                ← HTTP client layer
│   ├── app/                ← Next.js App Router (pages + layouts)
│   ├── helper/             ← Pure utility functions
│   ├── hooks/              ← Custom React hooks
│   ├── provider/           ← React providers (cookies)
│   ├── services/           ← Auth manager, logger, toast
│   └── types/              ← Global TypeScript types
├── .env                    ← Environment variables
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json           ← Path alias: @/* → ./src/*
```

---

## App Router Structure

Next.js uses **Route Groups** (folder names in parentheses) to separate guest and authenticated pages.

```
src/app/
├── layout.tsx              ← Root layout (wraps everything with CookiesProvider)
├── page.tsx                ← Redirects / → /dashboard
├── globals.css
│
├── (guest)/                ← Public pages (no auth required)
│   ├── layout.tsx
│   ├── login/
│   │   ├── page.tsx
│   │   ├── components/     ← Login form UI
│   │   ├── actions/        ← LoginAction.ts (server action)
│   │   └── useLogin.ts     ← Form state hook
│   └── reset/
│       ├── page.tsx
│       └── set-password/page.tsx
│
└── (logged-in)/            ← Protected pages (auth required)
    ├── layout.tsx           ← Checks auth, wraps with AuthProvider
    ├── AuthContext.tsx      ← User/permissions React Context
    ├── action/token.ts      ← Token refresh / logout helpers
    │
    ├── dashboard/
    ├── appointment/
    ├── appointment-booking/
    ├── doctor/
    ├── patient/
    ├── user/
    ├── organization/
    ├── role/
    ├── branch/
    ├── settlement/
    ├── payment-gateway/
    ├── permission/
    ├── daily-patients/
    ├── available-slot-report/
    ├── refund-report/
    ├── doctor-revenue/
    ├── payment-report/
    ├── invoice/
    └── profile/
```

---

## Feature Module Anatomy

Every feature follows the **same folder layout**. Use this as a template when adding new features:

```
/some-feature/
├── page.tsx                ← Entry point (server or client component)
├── components/             ← UI components for this feature only
│   ├── FeatureTable.tsx
│   ├── FeatureForm.tsx
│   └── ...
├── actions/                ← Server actions ("use server")
│   ├── getFeatureList.ts
│   ├── createFeature.ts
│   └── updateFeature.ts
├── types/                  ← TypeScript interfaces for this feature
│   └── Types.ts
└── (pages)/                ← Sub-pages (detail, edit, nested routes)
    └── [id]/
        ├── page.tsx
        ├── components/
        └── actions/
```

---

## Shared Components Location

```
src/app/components/
├── layout/
│   ├── logged-in/          ← LoggedInLayout, Title, AccountButton, GoBack
│   ├── wrappers/           ← ContentWrapper, FilterWrapper
│   ├── FormattedTime.tsx   ← Displays time with Bangladesh timezone correction
│   ├── FormattedDate.tsx
│   └── NoDataFound.tsx
├── buttons/
│   ├── actionButtons/      ← ActionButton, CreateActionButton, DeleteActionButton...
│   ├── CreateButton.tsx
│   ├── SubmitButton.tsx
│   └── LoadingButton.tsx
├── formInputs/
│   ├── DateInputField.tsx
│   ├── DropdownWithSearch.tsx
│   ├── MultiSelectDropdown.tsx
│   └── InputField.tsx
├── filters/
│   ├── SearchableDropDown.tsx
│   └── SearchFromList.tsx
├── sidebar/
│   ├── Sidebar.tsx
│   ├── SidebarItem.tsx
│   └── SidebarPermission.tsx
├── rolepermission/
│   └── HandleRolePermission.tsx
└── tables/
    └── (pagination helpers)
```

---

## API Layer

```
src/api/
├── ApiClient.ts            ← Main entry: get(), post(), put(), patch(), del()
├── TokenManager.ts         ← Read/write JWT tokens from cookies
├── RequestBuilder.ts       ← Build fetch() options, inject auth header
├── CookieUtils.ts          ← JWT decode, setCookie, token validation
├── HttpStatusChecks.ts     ← HttpError, HttpUnauthorizedError classes
├── ContentType.ts          ← Auto-detect FormData vs JSON
└── Types.ts                ← HttpMethod enum, FetchOption, ApiCall log types
```

---

## Helpers & Utilities

```
src/helper/
├── DateHelper.ts           ← convertToAMPM, formatTime, getAge, ageToDob, formateDate
├── DateTimeHelper.ts       ← Additional datetime utilities
├── StringHelper.ts         ← trimChar, ucFirst, titleCase, truncateText,
│                              formatMobileNumber, getBMI, cmToFeetInch, getFileType
├── error.ts                ← catchErrorMessage (maps network errors to messages)
├── ImageHelper.ts
├── packageHelper.ts
└── IndexCount.ts

src/services/
├── AuthManager.ts          ← login(), logout(), isLoggedIn(), getLoggedUser()
├── Logger.ts               ← API call logging
├── PasswordStrengthChecker.ts
└── toast/                  ← Toast notification helpers
```

---

## Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `APP_MODE` | `development` or `production` | `development` |
| `API_BASE_URL` | Backend NestJS API root | `http://localhost:3000` |
| `ADMIN_PUBLIC_URL` | This frontend's public URL | `http://admin.shukhee.test` |
| `NEXT_PUBLIC_GOOGLE_MAP_KEY` | Google Maps (optional) | `AIza...` |
| `NEXT_PUBLIC_PAHO` | External service (optional) | — |

`API_BASE_URL` is the most important — all API calls are prefixed with this value.

---

## TypeScript Path Alias

`tsconfig.json` defines:
```json
"paths": { "@/*": ["./src/*"] }
```

Use `@/` instead of relative paths:
```typescript
// Good
import { get } from "@/api/ApiClient";
import DoctorDebounceSelect from "@/app/(logged-in)/appointment-booking/components/DoctorDebounceSelect";

// Avoid
import { get } from "../../../../../api/ApiClient";
```
