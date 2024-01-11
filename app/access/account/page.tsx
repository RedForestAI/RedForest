"use server";

import Link from "next/link";
import NavBar from '@/components/NavBar';
import { createClient } from "@/utils/supabase/server";

export default async function Account() {
  // Fetch data
  const supabase = createClient()
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
        <Link key={'logout'} href={"/ops/logout"}>
          <button className="bg-blue-500 hover:bg-blue-700 mt-2 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Logout
          </button>
        </Link>
      </div>
    </div>
  );
};