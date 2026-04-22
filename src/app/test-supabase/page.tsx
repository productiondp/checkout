import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Note: Your instructions referenced a 'todos' table.
  // Make sure this table exists in your Supabase dashboard.
  const { data: todos, error } = await supabase.from('todos').select()

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-red-500 font-bold">Supabase Error</h1>
        <p>{error.message}</p>
        <p className="mt-4 text-sm text-slate-500">Note: Ensure the 'todos' table exists in your database.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Supabase Connection Test</h1>
      <ul className="space-y-2">
        {todos?.length === 0 && <p className="text-slate-500">No todos found. Connection is working but table is empty.</p>}
        {todos?.map((todo: any) => (
          <li key={todo.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            {todo.name}
          </li>
        ))}
      </ul>
    </div>
  )
}
