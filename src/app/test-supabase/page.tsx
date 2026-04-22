import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: todos } = await supabase.from('todos').select()

  return (
    <div className="p-20">
      <h1 className="text-2xl font-bold mb-4">Supabase Test</h1>
      <ul className="space-y-2">
        {todos?.map((todo: any) => (
          <li key={todo.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            {todo.name}
          </li>
        ))}
      </ul>
      {!todos?.length && <p className="text-slate-400">No todos found in the 'todos' table.</p>}
    </div>
  )
}
