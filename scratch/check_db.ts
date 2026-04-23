import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMetadata() {
  console.log("Checking profiles table for 'metadata' column...");
  const { data, error } = await supabase
    .from('profiles')
    .select('id, metadata')
    .limit(1);

  if (error) {
    console.error("Error fetching metadata:", error.message);
    if (error.message.includes("column \"metadata\" does not exist")) {
      console.log("CONFIRMED: Column 'metadata' is missing from the database.");
    }
  } else {
    console.log("SUCCESS: 'metadata' column found and accessible.");
    console.log("First row data:", data);
  }
}

checkMetadata();
