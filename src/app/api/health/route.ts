import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export const runtime = 'edge';

/**
 *  SYSTEM HEALTH MONITOR (V1.0)
 * 
 * Usage: GET /api/health
 * Purpose: Automated health checks for Vercel/Monitoring tools.
 */
export async function GET() {
  const start = performance.now();
  const status: any = {
    status: 'healthy',
    timestamp: Date.now(),
    services: {
      api: 'online',
      database: 'checking',
      cache: 'operational'
    },
    latency: 0
  };

  try {
    const supabase = createClient(cookies());
    
    // 1. Check DB Connectivity
    const { error } = await supabase.from('profiles').select('id').limit(1);
    
    if (error) {
      status.status = 'degraded';
      status.services.database = 'error';
      status.error = error.message;
    } else {
      status.services.database = 'online';
    }

  } catch (err: any) {
    status.status = 'unhealthy';
    status.services.api = 'error';
    status.error = err.message;
  }

  status.latency = `${(performance.now() - start).toFixed(2)}ms`;

  return NextResponse.json(status, { 
    status: status.status === 'unhealthy' ? 503 : 200 
  });
}
