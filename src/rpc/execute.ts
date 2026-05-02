'use server';

/**
 *  LAZY-LOADING RPC EXECUTOR
 * 
 * Centralized server action that dynamically imports domain modules.
 * 1. Minimizes cold starts by loading only the target code.
 * 2. Tree-shakable architecture.
 * 3. Unified error and telemetry handling.
 */

import { rpcHandlers } from './server';

type Domain = keyof typeof rpcHandlers;

export async function executeRPC<D extends Domain, M extends keyof (typeof rpcHandlers)[D]>(
  domain: D,
  method: M,
  input: unknown
): Promise<any> {
  try {
    console.log(`[RPC LAZY] Executing: ${domain}.${String(method)}`);
    
    // Dynamic import for code-splitting
    const mod = await import(`./modules/${domain}`);
    const handler = mod[`${domain}RPC`][method];

    if (typeof handler !== 'function') {
      throw new Error(`RPC Handler not found: ${domain}.${String(method)}`);
    }

    return await handler(input);
  } catch (error) {
    console.error(`[RPC ERROR] ${domain}.${String(method)}:`, error);
    throw error;
  }
}
