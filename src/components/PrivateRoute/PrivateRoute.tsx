import { type PropsWithChildren } from "react";
import { PrivateRouteBase } from "./PrivateRouteBase";
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

export const PrivateRoute = async ({ children }: PropsWithChildren) => {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  const { data } = await supabase.auth.getUser();

  if (!data.user) return null; // Prevent server side render of authorized page

  return <PrivateRouteBase>{children}</PrivateRouteBase>;
};
