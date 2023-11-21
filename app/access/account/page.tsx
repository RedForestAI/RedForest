"use client";

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';

const Account = () => {
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const [profile, setProfile] = useState({ email: '' });
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const {data: {user}}= await supabase.auth.getUser();
      user && setProfile({ email: user.email || '' });
    } catch (error: any) {
      setError(error.message);
      return null;
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/")
  }

  return (
    <div>
      <NavBar />
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Account Settings</h1>
        {error && <div className="mt-4 text-red-600">{error}</div>}
        <div className="mb-4">
          <label className="block text-gray-200 text-sm font-bold mb-2">Email</label>
          <input type="email" value={profile.email} className="shadow appearance-none border rounded w-full py-2 px-3 text-white-700 leading-tight focus:outline-none focus:shadow-outline" disabled />
        </div>
        <button onClick={handleLogout} className="bg-blue-500 hover:bg-blue-700 mt-2 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Account;
