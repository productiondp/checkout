import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function findAchu() {
  console.log("Searching for 'Achu'...");
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .ilike('full_name', '%achu%');

  if (error) {
    console.error("Error:", error.message);
  } else {
    console.log("Search Results:", data);
  }
}

findAchu();
