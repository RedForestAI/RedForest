"use client";

import { supabase } from "@/lib/supabase/client";
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter();

  async function logOut() {
    await supabase.auth.signOut();
    router.push("/ops/logout");
  }

  return (
    <button onClick={logOut} className="bg-blue-500 hover:bg-blue-700 mt-2 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
      Logout
    </button>
  )
}