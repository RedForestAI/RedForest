"use client";

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  async function logOut() {
    await supabase.auth.signOut();

    // POST request using fetch inside useEffect React hook
    fetch(`${origin}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => console.log(response))
    router.refresh();
  }

  return (
    <button onClick={logOut} className="bg-blue-500 hover:bg-blue-700 mt-2 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
      Logout
    </button>
  )
}