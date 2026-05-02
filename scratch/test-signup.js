const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignup() {
  console.log("Testing SignUp...");
  const email = `test_${Math.floor(Math.random() * 10000)}@example.com`;
  const password = "Password123!";
  
  const start = Date.now();
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    console.log("Time taken:", Date.now() - start, "ms");
    
    if (error) {
      console.error("SignUp Error:", error.message);
      if (error.status === 429) {
        console.log("RATE LIMITED!");
      }
    } else {
      console.log("SignUp Success! User ID:", data.user?.id);
    }
  } catch (err) {
    console.error("Crash:", err.message);
  }
}

testSignup();
