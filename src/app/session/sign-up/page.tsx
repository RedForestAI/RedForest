"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import NavBar from '@/components/ui/navbar';

export default function SignUp() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [error, setError] = useState<string>("");
  const supabase = createClientComponentClient();

  async function signUpWithEmail(e: any) {
    e.preventDefault()
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: `${origin}/api/auth/callback`
      }
    })

    console.log(data)
    
    if (error) {
      setError(error.message);
    } else {
      setSuccessMsg("Success! Please check your email for further instructions.");
    }
  }

  return (
    <div>
      <NavBar />
      <div className="flex justify-center items-center h-screen">
        <div className="p-6 max-w-sm w-full rounded-lg border shadow-md">
          <h2 className="mb-4 text-xl font-bold">Sign Up</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2 text-sm font-medium">Email</label>
                <input type="email" id="email" className="border border-gray-300 text-sm rounded-lg block w-full p-2.5" placeholder="name@example.com" required onChange={(e) => setEmail(e.target.value)}/>
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block mb-2 text-sm font-medium">Password</label>
                <input type="password" id="password" className="border border-gray-300 text-sm rounded-lg block w-full p-2.5" required onChange={(e) => setPassword(e.target.value)}/>
              </div>
              <button className="w-full btn btn-ghost text-primary" onClick={signUpWithEmail}>Submit</button>
            </form>
            {error && <div className="mt-4 text-error">{error}</div>}
            {successMsg && <div className="mt-4 text-success">{successMsg}</div>}
            <div className="flex justify-between items-center mt-4">
            <Link href="login">
              <button className="text-sm btn btn-ghost text-primary hover:underline">Already have an account? Sign In</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}