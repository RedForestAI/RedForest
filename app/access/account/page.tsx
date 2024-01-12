"use server";

import NavBar from '@/components/NavBar';
import { supabase } from "@/lib/supabase/server";
import LogoutButton from '@/components/forms/LogoutButton';

export default async function Account() {
  // Fetch data
  const { data } = await supabase.auth.getSession();

  return (
    <div>
      <NavBar includeBurger={true} accountLink={"/access/account"} logoLink={"/access"}/>
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Account Settings</h1>
        {data && data.session
          ? <div className="mb-4">
            <label className="block text-gray-200 text-sm font-bold mb-2">Email</label>
            <input type="email" value={data.session.user.email} className="shadow appearance-none border rounded w-full py-2 px-3 text-white-700 leading-tight focus:outline-none focus:shadow-outline" disabled />
          </div>
          : <div className="mt-4 text-red-600">Failed to fetch account information</div>
        }
      <LogoutButton />
      </div>
    </div>
  );
};