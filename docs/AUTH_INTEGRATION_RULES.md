# 🔒 AUTH INTEGRATION RULES

To maintain the integrity of the Checkout OS deterministic state machine, all components and pages MUST adhere to these integration rules.

## 1. Zero Direct Auth Access
- **NEVER** call `supabase.auth.getSession()` or `supabase.auth.getUser()` in any component.
- **ALWAYS** consume authentication data through the `useAuth()` hook.
- **EXCEPTION**: Server-side middleware and API routes are permitted to use direct auth calls for request validation.

## 2. No Manual Routing
- **NEVER** use `router.push("/")` or `router.replace("/home")` for auth-related transitions (login, signup, onboarding).
- **ALWAYS** rely on the `useAuth` state machine to detect session changes and execute the correct redirection.
- UI-based navigation (e.g., clicking a link to `/marketplace`) is permitted.

## 3. Safe State Consumption
- **NEVER** assume `user` or `profile` exists inside a component without checking `authState`.
- **ALWAYS** implement a safe fallback:
  ```tsx
  const { user, authState } = useAuth();
  if (authState !== "authenticated" || !user) return null;
  ```

## 4. Protected Page Pattern
- **ALWAYS** wrap protected terminal pages in the `<ProtectedRoute>` component.
- This ensures that internal logic does not execute before the auth state is finalized.

## 5. Lifecycle Isolation
- The authentication system is treated as **Infrastructure**. 
- It must remain isolated from feature code. 
- Do not add feature-specific logic (e.g., wallet balance, notifications) into `useAuth.tsx`.

---
**Protocol: SENTINEL_OS V.23**
**Enforced by: Antigravity AI**
