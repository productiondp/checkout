import { describe, it, expect } from 'vitest';
import { AuthState, AuthEvent, transition, resolveRoute, isRouteValid, assertInvariants } from '../lib/auth-fsm';

describe('Auth FSM Formal Verification', () => {
  
  describe('Transition Invariants', () => {
    it('moves from initializing to authenticated when session and profile exist', () => {
      const state: AuthState = { tag: 'initializing' };
      const next = transition(state, { type: 'SESSION_FOUND', hasProfile: true });
      expect(next.tag).toBe('authenticated');
    });

    it('moves from initializing to onboarding when session exists but no profile', () => {
      const state: AuthState = { tag: 'initializing' };
      const next = transition(state, { type: 'SESSION_FOUND', hasProfile: false });
      expect(next.tag).toBe('onboarding');
    });

    it('moves to unauthenticated when no session is found during boot', () => {
      const state: AuthState = { tag: 'initializing' };
      const next = transition(state, { type: 'NO_SESSION' });
      expect(next.tag).toBe('unauthenticated');
    });

    it('handles logout from any active state', () => {
      const authState: AuthState = { tag: 'authenticated' };
      const onboardState: AuthState = { tag: 'onboarding' };
      
      expect(transition(authState, { type: 'LOGOUT' }).tag).toBe('unauthenticated');
      expect(transition(onboardState, { type: 'LOGOUT' }).tag).toBe('unauthenticated');
    });

    it('prevents invalid transitions (stay in current state)', () => {
      const state: AuthState = { tag: 'unauthenticated' };
      const next = transition(state, { type: 'LOGOUT' }); // Already logged out
      expect(next.tag).toBe('unauthenticated');
    });
  });

  describe('Route Resolution', () => {
    it('resolves authenticated state to /home if on restricted page', () => {
      const state: AuthState = { tag: 'authenticated' };
      expect(resolveRoute(state, '/')).toBe('/home');
      expect(resolveRoute(state, '/onboarding')).toBe('/home');
      expect(resolveRoute(state, '/home')).toBeNull(); // Already there
    });

    it('resolves onboarding state to /onboarding', () => {
      const state: AuthState = { tag: 'onboarding' };
      expect(resolveRoute(state, '/')).toBe('/onboarding');
      expect(resolveRoute(state, '/home')).toBe('/onboarding');
    });

    it('resolves guest state to /', () => {
      const state: AuthState = { tag: 'unauthenticated' };
      expect(resolveRoute(state, '/home')).toBe('/');
      expect(resolveRoute(state, '/onboarding')).toBe('/');
    });
  });

  describe('Bidirectional Validation', () => {
    it('identifies /home as invalid for guest', () => {
      const state: AuthState = { tag: 'unauthenticated' };
      expect(isRouteValid(state, '/home')).toBe(false);
      expect(isRouteValid(state, '/')).toBe(true);
    });

    it('identifies /onboarding as invalid for fully authenticated', () => {
      const state: AuthState = { tag: 'authenticated' };
      expect(isRouteValid(state, '/onboarding')).toBe(false);
      expect(isRouteValid(state, '/home')).toBe(true);
    });
  });

  describe('Formal Invariants', () => {
    it('throws on invalid state tag', () => {
      expect(() => assertInvariants({ tag: 'corrupted' as any })).toThrow('[FSM INVARIANT]');
    });

    it('passes for all defined states', () => {
      expect(() => assertInvariants({ tag: 'initializing' })).not.toThrow();
      expect(() => assertInvariants({ tag: 'unauthenticated' })).not.toThrow();
      expect(() => assertInvariants({ tag: 'onboarding' })).not.toThrow();
      expect(() => assertInvariants({ tag: 'authenticated' })).not.toThrow();
    });
  });
});
