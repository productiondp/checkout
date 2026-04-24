import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zlsjqrcesbvwpbdlbyru.supabase.co";
const supabaseKey = "sb_publishable_oXl6XBDlWWOY4xljChlu4A_opPmS70L";

const supabase = createClient(supabaseUrl, supabaseKey);

async function probe() {
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  if (error) {
    console.error("Probe failed:", error);
  } else {
    console.log("Profile Columns:", Object.keys(data[0] || {}));
  }
}

probe();
