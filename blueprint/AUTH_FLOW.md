# Authentication & Authorization Flow

## Overview

Auth is JWT-based. Tokens are stored in HTTP cookies (server-side via `next/headers`).  
The `ApiClient` automatically reads the token from cookies and injects it into every request.

---

## Login Flow

```
User submits /login form
        ↓
LoginAction.ts (server action)
        ↓
POST API_BASE_URL/v1/auth/login
        ↓
On success → AuthManager.login(tokens)
        ↓
TokenManager.setCookies({ userId, accessToken, refreshToken })
        ↓
redirect('/dashboard')
```

**Files involved:**
- `src/app/(guest)/login/page.tsx` — form UI
- `src/app/(guest)/login/actions/LoginAction.ts` — server action
- `src/services/AuthManager.ts` — `login()`, `logout()`, `isLoggedIn()`
- `src/api/TokenManager.ts` — cookie read/write
- `src/api/CookieUtils.ts` — JWT decode, expiry calculation

---

## Token Storage

Tokens are stored in **server-side cookies** (not `localStorage`):

| Cookie name | Content |
|-------------|---------|
| `accessToken` | JWT Bearer token for API requests |
| `refreshToken` | Used to get a new access token |
| `userId` | Logged-in user's ID |

Each cookie expiry matches the JWT `exp` claim (decoded via `jwt-decode`).

```typescript
// src/api/TokenManager.ts (simplified)
export function getAccessToken(): string | undefined {
  return cookies().get('accessToken')?.value;
}

export function setTokens(tokens: Tokens): void {
  const exp = decodeJwtExpiry(tokens.accessToken);
  cookies().set('accessToken', tokens.accessToken, { expires: exp });
  cookies().set('refreshToken', tokens.refreshToken, { expires: exp });
}
```

---

## Protected Routes

`src/app/(logged-in)/layout.tsx` guards all routes under `/(logged-in)/`:

```typescript
// Simplified layout.tsx
export default async function LoggedInLayout({ children }) {
  const isLoggedIn = await AuthManager.isLoggedIn();
  if (!isLoggedIn) redirect('/login');
  return <AuthProvider>{children}</AuthProvider>;
}
```

---

## AuthContext — User & Permissions

`AuthContext.tsx` makes the current user available throughout the app:

```typescript
// Usage in any client component:
import { useAuth } from '@/app/(logged-in)/AuthContext';

const { user, loading } = useAuth();
```

`user` contains: id, firstName, lastName, role, permissions, etc.  
It is fetched once on mount via `GET v1/user/{userId}`.

---

## Token Refresh / 401 Handling

When any API call returns 401 (Unauthorized):

```
ApiClient receives 401
        ↓
callRefreshToken() in action/token.ts
        ↓
Clears all cookies (accessToken, refreshToken, userId)
        ↓
redirect('/login')
```

There is **no silent token refresh** — the user is redirected to login and must re-authenticate.

---

## Logout

```typescript
// src/services/AuthManager.ts
export async function logout(): Promise<void> {
  await removeCookies(); // clears all auth cookies
  redirect('/login');
}
```

The `LogoutButton` component calls this action.

---

## Role-Based Access Control

Permissions are attached to the `user` object from `AuthContext`.

**Sidebar-level:** `SidebarPermission` component hides menu items.

**Component-level:** `RolePermissionChecker` wraps UI elements:

```tsx
<RolePermissionChecker tag="appointment" name="create">
  <CreateButton />
</RolePermissionChecker>
```

If the user lacks the `create` permission on `appointment`, the button is not rendered.

**Admin-only** items check `user.role === 'ADMIN'` or the presence of a specific permission tag.
