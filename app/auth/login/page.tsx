import React from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';


import Login from '../../../components/auth/login'

export default async function LoginPage() {
  const cookieStore = cookies(cookies)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
  const { data } = await supabase.auth.getSession();

  if (data?.session) {
    redirect('/student')
  }

  return <Login />

}
