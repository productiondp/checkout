# 🔒 AUTHENTICATION VALIDATION CHECKLIST

This document outlines the mandatory tests that must pass after ANY change to the codebase that might affect the authentication lifecycle.

## 1. 🧊 Refresh Stability
- [ ] **Refresh on /home**: User must remain on `/home` without any flicker to the landing page.
- [ ] **Refresh on /onboarding**: User must remain on `/onboarding`.
- [ ] **Refresh on / (Guest)**: User must remain on `/`.
- [ ] **Rapid Refresh (10x)**: The system must not trigger multiple redirect commands or enter a redirect loop.

## 2. 🐢 Network Resilience (Slow 3G/4G)
- [ ] **Slow Profile Fetch**: The `FullScreenLoader` must persist until the profile is fully hydrated. No "Guest" state should be visible.
- [ ] **Profile Timeout**: If the network hangs for >5s, the system must resolve to a fallback state (Onboarding or Home) using `AUTH_SAFE_MODE`.

## 3. 👯 Multi-Tab Synchronization
- [ ] **Logout Tab A**: Tab B must instantly redirect to `/` (Landing).
- [ ] **Login Tab A**: Tab B (on Landing) must instantly redirect to `/home` or `/onboarding`.

## 4. 🔀 Path Determinism
- [ ] **Direct Access /home (Guest)**: Must redirect to `/`.
- [ ] **Direct Access /login (Auth)**: Must redirect to `/home`.
- [ ] **Direct Access /onboarding (Auth+Onboarded)**: Must redirect to `/home`.
- [ ] **Partial Profile**: If session exists but `onboarding_completed` is false, user MUST be trapped on `/onboarding`.

## 5. 🛠️ Recovery & Edge Cases
- [ ] **Profile Missing (DB Error)**: System must fallback to `/onboarding`.
- [ ] **Token Expired**: System must refresh token silently (`TOKEN_REFRESHED` event).
- [ ] **Manual URL Tampering**: Changing the URL to `/login` while logged in must resolve to `/home` in < 500ms.

## 6. 🧹 Cleanup
- [ ] **Memory Leaks**: Verify that `supabase.auth.onAuthStateChange` is unsubscribed on unmount.
- [ ] **Console Logs**: Verify **ZERO** `[AUTH]` logs are visible in the production build.

---
**Protocol: SENTINEL_OS V.22**
**Author: Antigravity AI**
