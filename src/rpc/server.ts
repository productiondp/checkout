/**
 *  RPC SERVER HUB
 * 
 * Maps domain modules to the global RPC namespace.
 * This structure enables the lazy-loading executor to dynamically
 * import the required handlers.
 */

import { profileRPC } from './modules/profile';

export const rpcHandlers = {
  profile: profileRPC,
};

export type RPCHandlers = typeof rpcHandlers;
