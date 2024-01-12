"use server";

import NavBar from '@/components/NavBar';
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import LogoutButton from '@/components/forms/LogoutButton';

export default async function Account() {
  // Fetch data
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  const { data } = await supabase.auth.getUser();

  return (
    <div>
      <NavBar includeBurger={true} accountLink={"/access/account"} logoLink={"/access"}/>
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Account Settings</h1>
        {data && data.user
          ? <div className="mb-4">
            <label className="block text-gray-200 text-sm font-bold mb-2">Email</label>
            <input type="email" value={data.user?.email} className="shadow appearance-none border rounded w-full py-2 px-3 text-white-700 leading-tight focus:outline-none focus:shadow-outline" disabled />
          </div>
          : <div className="mt-4 text-red-600">Failed to fetch account information</div>
        }
      <LogoutButton />
      </div>
    </div>
  );
};