"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function signInWithEmail(e: any) {
    e.preventDefault()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    })

    if (error) {
      setError(error.message);
    } 
  }

  return (
    <div className="flex justify-center items-center h-screen bg-zinc-950">
      <div className="p-6 max-w-sm w-full bg-white rounded-lg border border-gray-200 shadow-md">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Login</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
              <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="name@example.com" required onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
              <input type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <button className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" onClick={signInWithEmail}>Login</button>
          </form>
          {error && <div className="mt-4 text-red-600">{error}</div>}
          <div className="flex justify-between items-center mt-4">
          <Link href="signup">
            <button className="text-sm text-blue-600 hover:underline">Sign Up</button>
          </Link>
          <Link href="forgot-password">
            <button className="text-sm text-blue-600 hover:underline">Forgot Password?</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
