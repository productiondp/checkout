import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { 
  AuthState, 
  AuthEvent, 
  transition, 
  resolveRoute, 
  isRouteValid, 
  assertInvariants 
} from '../lib/auth-fsm';

/**
 *  ARBITRARY GENERATORS
 */
const authEventArb: fc.Arbitrary<AuthEvent> = fc.oneof(
  fc.constant({ type: 'BOOT' as const }),
  fc.record({
    type: fc.constant('SESSION_FOUND' as const),
    hasProfile: fc.boolean(),
  }),
  fc.constant({ type: 'NO_SESSION' as const }),
  fc.constant({ type: 'LOGOUT' as const }),
  fc.record({
    type: fc.constant('PROFILE_LOADED' as const),
    hasProfile: fc.boolean(),
  })
);

const eventSeqArb = fc.array(authEventArb, {
  minLength: 1,
  maxLength: 100,
});

describe('Auth FSM Property-Based Testing', () => {
  
  it('never violates formal invariants across random sequences', () => {
    fc.assert(
      fc.property(eventSeqArb, (events) => {
        let state: AuthState = { tag: 'initializing' };

        for (const e of events) {
          state = transition(state, e);
          // Invariant Check
          expect(() => assertInvariants(state)).not.toThrow();
        }
      }),
      { numRuns: 2000, seed: 42 }
    );
  });

  it('guarantees routing is always consistent with internal state', () => {
    fc.assert(
      fc.property(eventSeqArb, (events) => {
        let state: AuthState = { tag: 'initializing' };

        for (const e of events) {
          state = transition(state, e);
          
          // Test across common application paths
          const paths = ['/', '/home', '/onboarding', '/settings', '/login'];
          for (const path of paths) {
            const target = resolveRoute(state, path);
            const finalPath = target || path;
            
            // Core Property: If we are at finalPath, it MUST be valid for state
            expect(isRouteValid(state, finalPath)).toBe(true);
          }
        }
      }),
      { numRuns: 2000 }
    );
  });

  it('maintains state idempotency (repeated events are safe)', () => {
    fc.assert(
      fc.property(authEventArb, (event) => {
        let state: AuthState = { tag: 'initializing' };

        // Apply once
        state = transition(state, event);
        const stateAfterOnce = { ...state };

        // Apply twice
        state = transition(state, event);
        const stateAfterTwice = { ...state };

        // Property: Repeated events shouldn't cause illegal transitions or state corruption
        expect(stateAfterTwice).toEqual(stateAfterOnce);
        expect(() => assertInvariants(stateAfterTwice)).not.toThrow();
      }),
      { numRuns: 1000 }
    );
  });

  it('never reaches an invalid state shape', () => {
    fc.assert(
      fc.property(eventSeqArb, (events) => {
        let state: AuthState = { tag: 'initializing' };

        for (const e of events) {
          state = transition(state, e);

          // Structural Integrity Property
          expect(state).toHaveProperty('tag');
          const validTags = ['initializing', 'unauthenticated', 'onboarding', 'authenticated'];
          expect(validTags).toContain(state.tag);
        }
      }),
      { numRuns: 2000 }
    );
  });

  it('handles chaotic event interleaving without crashing', () => {
    // This tests the robust error handling of the pure transition function
    fc.assert(
      fc.property(eventSeqArb, (events) => {
        let state: AuthState = { tag: 'initializing' };
        
        // We just ensure no combination of events can cause a runtime exception
        for (const e of events) {
          state = transition(state, e);
        }
        
        expect(state).toBeDefined();
      }),
      { numRuns: 5000 }
    );
  });

});
