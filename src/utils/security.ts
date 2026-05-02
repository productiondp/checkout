import { NextRequest, NextResponse } from 'next/server';

/**
 *  PRODUCTION SECURITY UTILITIES (V14.2)
 * 
 * Provides authorization, rate limiting, and telemetry features 
 * for production-grade API protection.
 */

// Simple in-memory rate limit store (Note: In multi-instance production, use Redis)
const rateLimitStore = new Map<string, { count: number; reset: number }>();

/**
 *  SURGICAL RATE LIMITER
 * Limits requests per IP to prevent infrastructure abuse.
 */
export function rateLimit(req: NextRequest, limit: number = 100, windowMs: number = 60000) {
  const ip = req.ip || req.headers.get('x-forwarded-for') || 'anonymous';
  const now = Date.now();
  const record = rateLimitStore.get(ip) || { count: 0, reset: now + windowMs };

  if (now > record.reset) {
    record.count = 1;
    record.reset = now + windowMs;
  } else {
    record.count++;
  }

  rateLimitStore.set(ip, record);

  if (record.count > limit) {
    console.warn(`%c[SECURITY: RATE_LIMIT] IP: ${ip}`, "color: #E53935; font-weight: bold;");
    return false;
  }
  return true;
}

/**
 *  SECURITY TELEMETRY
 * Logs sensitive events for production visibility.
 */
export function logSecurityEvent(event: string, details: any) {
  const timestamp = new Date().toISOString();
  console.log(`%c[SECURITY EVENT] ${timestamp} - ${event}`, "color: #E53935; font-weight: bold;", details);
  
  // In a real production system, you would send this to a logging service (e.g. Axiom, Sentry)
}

/**
 *  AUTHORIZATION GUARD (AuthZ)
 * Ensures the authenticated user has permission to access the resource.
 */
export function assertAuthorization(userId: string, resourceOwnerId: string) {
  if (userId !== resourceOwnerId) {
    logSecurityEvent('AUTHORIZATION_VIOLATION', { userId, resourceOwnerId });
    return false;
  }
  return true;
}
