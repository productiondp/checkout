/**
 * 🔗 DYNAMIC RPC PROXY CLIENT
 * 
 * Uses a nested Proxy to enable a tree-shakable and domain-aware 
 * RPC interface.
 * 
 * Usage: rpc.profile.getProfile({ userId: '...' })
 */

import { executeRPC } from './execute';
import { rpcHandlers } from './server';

type RPCHandlers = typeof rpcHandlers;

type ClientRPC = {
  [D in keyof RPCHandlers]: {
    [M in keyof RPCHandlers[D]]: (
      input: Parameters<RPCHandlers[D][M]>[0]
    ) => Promise<Awaited<ReturnType<RPCHandlers[D][M]>>>;
  };
};

function createRPCProxy(): ClientRPC {
  return new Proxy({} as ClientRPC, {
    get(_, domain: string) {
      return new Proxy({}, {
        get(_, method: string) {
          return (input: unknown) => executeRPC(domain as any, method as any, input);
        }
      });
    }
  });
}

export const rpc = createRPCProxy();
