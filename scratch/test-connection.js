const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

console.log("URL:", supabaseUrl);
console.log("Key:", supabaseKey ? "EXISTS" : "MISSING");

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Testing connection...");
  const start = Date.now();
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    console.log("Session fetch time:", Date.now() - start, "ms");
    if (sessionError) {
      console.error("Session Error:", sessionError.message);
    } else {
      console.log("Session exists:", !!sessionData.session);
    }

    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    console.log("Profile query time:", Date.now() - start, "ms");
    if (error) {
      console.error("Error:", error.message);
    } else {
      console.log("Success! Data:", data);
    }
  } catch (err) {
    console.error("Crash:", err.message);
  }
}

test();
