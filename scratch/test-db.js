import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function test() {
  const { data, error } = await supabase.from('posts').select(`*, profiles(*)`).limit(1)
  console.log('Posts test:', { data, error })

  const { data: lData, error: lError } = await supabase.from('listings').select(`*`).limit(1)
  console.log('Listings test:', { data: lData, error: lError })
}

test()
