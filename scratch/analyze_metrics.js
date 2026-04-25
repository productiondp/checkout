const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function checkData() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );

  const { data, error } = await supabase
    .from('analytics_events')
    .select('event_type, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('--- ANALYTICS SUMMARY ---');
  console.log('Total Events:', data.length);
  
  const counts = data.reduce((acc, curr) => {
    acc[curr.event_type] = (acc[curr.event_type] || 0) + 1;
    return acc;
  }, {});

  console.log('Event Counts:', JSON.stringify(counts, null, 2));
}

checkData();
