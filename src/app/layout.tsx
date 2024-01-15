// app/layout.tsx

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { Providers } from "@/providers";
import { TailwindIndicator } from "@/components/TailwindIndicator";
import { getServerUser } from "@/utils/auth";
import { AuthProvider } from "@/providers/AuthProvider/AuthProvider";
import { TRPCReactProvider } from "@/trpc/react";
import { headers } from "next/headers";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RedForest',
  description: 'AI-powered reading assistance',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getServerUser();

  return (
    <html lang="en">
      <body className={inter.className}>
        <TRPCReactProvider headers={headers()}>
              <AuthProvider {...user}>
                <Providers>
                  {children}
                </Providers>
              </AuthProvider>
            </TRPCReactProvider>
            <TailwindIndicator />
      </body>
    </html>
  )
}
