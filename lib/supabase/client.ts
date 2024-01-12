import { createBrowserClient } from "@supabase/ssr";

declare global {
  var supabase: ReturnType<typeof createClient> | undefined
}

const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export const supabase =
  global.supabase ||
  createClient()