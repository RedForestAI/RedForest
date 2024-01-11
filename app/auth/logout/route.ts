import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import absoluteUrl from 'next-absolute-url'

export async function GET(request: Request) {
  const supabase = createClient();
  await supabase.auth.signOut();

  // return the user to an error page with some instructions
  const { origin } = absoluteUrl(request);
  return NextResponse.redirect(origin);
}
