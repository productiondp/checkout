/**
 *  FORMALLY VERIFIABLE AUTHENTICATION FSM (V7.0)
 * 
 * This module defines the core state machine, transition logic, 
 * and routing resolution as pure, testable functions.
 */

export type AuthState =
  | { tag: 'initializing' }
  | { tag: 'unauthenticated' }
  | { tag: 'onboarding' } // Explicit state for profile missing
  | { tag: 'authenticated' };

export type AuthEvent =
  | { type: 'BOOT' }
  | { type: 'SESSION_FOUND'; hasProfile: boolean }
  | { type: 'NO_SESSION' }
  | { type: 'LOGOUT' }
  | { type: 'PROFILE_LOADED'; hasProfile: boolean };

/**
 *  DETERMINISTIC TRANSITION FUNCTION
 * Pure function that computes the next state based on current state and event.
 */
export function transition(state: AuthState, event: AuthEvent): AuthState {
  switch (state.tag) {
    case 'initializing':
      if (event.type === 'SESSION_FOUND') {
        return event.hasProfile ? { tag: 'authenticated' } : { tag: 'onboarding' };
      }
      if (event.type === 'NO_SESSION') {
        return { tag: 'unauthenticated' };
      }
      return state;

    case 'unauthenticated':
      if (event.type === 'SESSION_FOUND') {
        return event.hasProfile ? { tag: 'authenticated' } : { tag: 'onboarding' };
      }
      return state;

    case 'onboarding':
      if (event.type === 'PROFILE_LOADED' && event.hasProfile) {
        return { tag: 'authenticated' };
      }
      if (event.type === 'LOGOUT') {
        return { tag: 'unauthenticated' };
      }
      return state;

    case 'authenticated':
      if (event.type === 'LOGOUT') {
        return { tag: 'unauthenticated' };
      }
      // Re-validate profile if needed
      if (event.type === 'PROFILE_LOADED' && !event.hasProfile) {
        return { tag: 'onboarding' };
      }
      return state;

    default:
      return state;
  }
}

/**
 *  AUTHORITATIVE ROUTE RESOLVER
 * Pure function mapping state to route.
 */
export function resolveRoute(state: AuthState, currentPath: string): string | null {
  if (state.tag === 'initializing') return null;

  const isAuthPage = currentPath === "/" || currentPath === "/login" || currentPath === "/signup";
  const isOnboardingPage = currentPath === "/onboarding";

  switch (state.tag) {
    case 'unauthenticated':
      return isAuthPage ? null : "/";
    
    case 'onboarding':
      return isOnboardingPage ? null : "/onboarding";
    
    case 'authenticated':
      return (isAuthPage || isOnboardingPage) ? "/home" : null;

    default:
      return null;
  }
}

/**
 *  BIDIRECTIONAL ROUTE VALIDATOR
 */
export function isRouteValid(state: AuthState, currentPath: string): boolean {
  if (state.tag === 'initializing') return true;

  const isAuthPage = currentPath === "/" || currentPath === "/login" || currentPath === "/signup";
  const isOnboardingPage = currentPath === "/onboarding";

  switch (state.tag) {
    case 'unauthenticated':
      return isAuthPage;
    case 'onboarding':
      return isOnboardingPage;
    case 'authenticated':
      return !isAuthPage && !isOnboardingPage;
    default:
      return false;
  }
}

/**
 *  INVARIANT ENFORCEMENT
 */
export function assertInvariants(state: AuthState) {
  // Add formal invariants here if needed
  // e.g., Ensuring tag is valid
  const validTags = ['initializing', 'unauthenticated', 'onboarding', 'authenticated'];
  if (!validTags.includes(state.tag)) {
    throw new Error(`[FSM INVARIANT] Invalid state tag: ${state.tag}`);
  }
}
