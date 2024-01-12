"use server";

import { supabase } from '@/lib/supabase/server';
import NavBar from '@/components/NavBar';
import LoginForm from '@/components/forms/LoginForm';

export default async function Login() {

  // Fetch data
  const { data } = await supabase.auth.getSession();
  console.log(data);

  return (
    <div>
      <NavBar includeBurger={false} accountLink={"/auth/login"} logoLink={"/"}/>
      <LoginForm />
    </div>
  );
};
