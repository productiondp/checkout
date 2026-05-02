import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function TestSafePage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Note: This expects a 'todos' table to exist in your new DEV project.
  // If you haven't created it yet, this will show an error or empty list.
  const { data: todos, error } = await supabase.from('todos').select()

  if (error) {
    return (
      <div className="p-20 text-center">
        <h1 className="text-red-500 font-black uppercase">Connection Error</h1>
        <p className="text-gray-400 text-xs mt-2">{error.message}</p>
        <p className="text-[10px] mt-4 uppercase text-gray-300">Check if 'todos' table exists in your DEV project.</p>
      </div>
    );
  }

  return (
    <div className="p-20">
      <h1 className="text-2xl font-black uppercase mb-8">Safe Sandbox Test</h1>
      <ul className="space-y-4">
        {todos?.length === 0 && <p className="text-gray-400 italic">No todos found. Connection successful but table is empty.</p>}
        {todos?.map((todo: any) => (
          <li key={todo.id} className="p-4 bg-gray-50 border border-gray-100 rounded-xl font-bold uppercase text-xs">
            {todo.name}
          </li>
        ))}
      </ul>
    </div>
  )
}
