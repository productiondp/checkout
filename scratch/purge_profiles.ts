
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials missing')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function purge() {
  const targets = ['achu']
  
  for (const name of targets) {
    console.log(`--- Purging: ${name} ---`)
    
    // 1. Find profile
    const { data: profile, error: findError } = await supabase
      .from('profiles')
      .select('id')
      .ilike('full_name', `%${name}%`)
      .maybeSingle()
      
    if (findError) {
      console.error(`Error finding ${name}:`, findError)
      continue
    }
    
    if (!profile) {
      console.log(`Profile ${name} not found.`)
      continue
    }
    
    const id = profile.id
    console.log(`Found ID: ${id}`)
    
    // 2. Delete related items (Manually just in case)
    const tables = ['posts', 'connections', 'messages', 'notifications', 'participants', 'community_members', 'bookings', 'reviews']
    
    for (const table of tables) {
      // For some tables, we need to check different columns
      let column = 'user_id'
      if (table === 'posts') column = 'author_id'
      if (table === 'connections') {
        // Special case for connections (sender or receiver)
        const { error: connErr } = await supabase.from('connections').delete().or(`sender_id.eq.${id},receiver_id.eq.${id}`)
        if (connErr) console.error(`Error deleting from ${table}:`, connErr)
        else console.log(`Cleared connections for ${id}`)
        continue
      }
      if (table === 'bookings') {
        const { error: bookErr } = await supabase.from('bookings').delete().or(`advisor_id.eq.${id},client_id.eq.${id}`)
        if (bookErr) console.error(`Error deleting from ${table}:`, bookErr)
        else console.log(`Cleared bookings for ${id}`)
        continue
      }
      if (table === 'reviews') {
          // reviews usually have reviewer_id or advisor_id
          const { error: revErr } = await supabase.from('reviews').delete().or(`reviewer_id.eq.${id},advisor_id.eq.${id}`)
          if (revErr) console.error(`Error deleting from ${table}:`, revErr)
          else console.log(`Cleared reviews for ${id}`)
          continue
      }
      if (table === 'participants') column = 'user_id'
      if (table === 'messages') column = 'sender_id'

      const { error: delErr } = await supabase.from(table).delete().eq(column, id)
      if (delErr) console.error(`Error deleting from ${table}:`, delErr)
      else console.log(`Cleared ${table} for ${id}`)
    }
    
    // 3. Delete Profile
    const { error: profileDelErr } = await supabase.from('profiles').delete().eq('id', id)
    if (profileDelErr) {
      console.error(`Error deleting profile ${id}:`, profileDelErr)
    } else {
      console.log(`--- SUCCESS: Purged ${name} (${id}) ---`)
    }
  }
}

purge()
