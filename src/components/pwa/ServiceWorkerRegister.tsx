'use client';

import { useEffect } from 'react';

/**
 * PWA Service Worker Registration
 * - Runs only in browser (useEffect)
 * - Silent fail-safe: errors are only warnings, never exceptions
 * - Does NOT interfere with auth, routing, or any app logic
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none', // Always check for SW updates
        });

        // Check for updates when app regains focus
        const handleVisibilityChange = () => {
          if (document.visibilityState === 'visible') {
            registration.update().catch(() => {});
          }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
      } catch (err) {
        // Silent — PWA is enhancement only, never a blocker
        console.warn('[SW] Registration skipped:', err);
      }
    };

    // Defer registration until after page load to not compete with critical resources
    if (document.readyState === 'complete') {
      register();
    } else {
      window.addEventListener('load', register, { once: true });
    }
  }, []);

  return null;
}
