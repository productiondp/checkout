const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: posts, error: postError } = await supabase.from('posts').select('*, author:profiles(full_name)');
  if (postError) {
    console.error("Error fetching posts:", postError.message);
  } else {
    console.log("Posts in Database:", posts);
  }
}

check();
