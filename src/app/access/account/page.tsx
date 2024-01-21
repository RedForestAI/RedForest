"use server";

import NavBar from '@/components/ui/navbar';
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import LogoutButton from '@/components/FormInput/LogoutButton';
import { api } from '~/trpc/server';
import { Profile } from '@prisma/client';
import DangerZoneForm from './_components/DangerZoneForm';

export default async function Account() {
  // Fetch data
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  const { data } = await supabase.auth.getUser();
  let profile: Profile = await api.auth.getProfile.query();

  return (
    <div>
      <NavBar profile={profile}/>
      <div className="container mx-auto pl-12 pr-12">
        {data && data.user
          ? <>
            <h1 className="text-xl font-bold mb-4 mt-4">Account</h1>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Email</label>
              <input type="email" value={data.user?.email} className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" disabled />
              <label className="block text-sm font-bold mb-2 mt-4">Role</label>
              <input type="email" value={profile.role.toString()} className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" disabled />
            </div>
            <DangerZoneForm profile={profile}/>
          </>
          : <div className="mt-4 text-error">Failed to fetch account information</div>
        }
        <div className="mt-4">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
};