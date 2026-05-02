/**
 *  CENTRALIZED ROUTE CONFIGURATION (V14.0)
 * 
 * Defines all protected and public route patterns for the Checkout Business OS.
 * Used by Middleware and Client-Side guards to ensure consistent access control.
 */

export const PROTECTED_ROUTES = [
  '/home',
  '/chat',
  '/marketplace',
  '/advisors',
  '/discover',
  '/matches',
  '/profile',
  '/settings',
  '/onboarding',
  '/admin',
  '/network',
  '/insights',
  '/opportunities',
];

export const PUBLIC_ROUTES = [
  '/',
  '/what-is-checkout',
  '/sw.js',
  '/manifest.json',
  '/api/public-feed',
];
