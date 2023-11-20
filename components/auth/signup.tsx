"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr'

const SignUp = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [error, setError] = useState<string>("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function signUpWithEmail(e: any) {
    e.preventDefault()
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password
    })

    console.log(data)

    if (error) {
      setError(error.message);
    } else {
      setSuccessMsg("Success! Please check your email for further instructions.");
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-zinc-950">
      <div className="p-6 max-w-sm w-full bg-white rounded-lg border border-gray-200 shadow-md">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Sign Up</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
              <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="name@example.com" required onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
              <input type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <button className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" onClick={signUpWithEmail}>Submit</button>
          </form>
          {error && <div className="mt-4 text-red-600">{error}</div>}
          {successMsg && <div className="mt-4 text-green-600">{successMsg}</div>}
          <div className="flex justify-between items-center mt-4">
          <Link href="login">
            <button className="text-sm text-blue-600 hover:underline">Already have an account? Sign In</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
